import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync, unlinkSync, readFileSync } from "fs";

const execAsync = promisify(exec);

function parseJson3(raw: string): { time: string; text: string }[] {
  try {
    const data = JSON.parse(raw);
    const events = data.events || [];
    const lines: { time: string; text: string }[] = [];
    for (const e of events) {
      const segs = e.segs || [];
      const text = segs.map((s: { utf8?: string }) => s.utf8 || "").join("").trim();
      if (!text || text === "\n") continue;
      const ms = e.tStartMs || 0;
      const time = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
      lines.push({ time, text });
    }
    return lines;
  } catch {
    return [];
  }
}

function parseVtt(raw: string): { time: string; text: string }[] {
  const lines: { time: string; text: string }[] = [];
  const blocks = raw.split(/\n\n+/);
  for (const block of blocks) {
    const rows = block.trim().split("\n");
    const timeLine = rows.find((r) => r.includes("-->"));
    if (!timeLine) continue;
    const timeMatch = timeLine.match(/^(\d+):(\d+):(\d+)/);
    if (!timeMatch) continue;
    const h = parseInt(timeMatch[1]), m = parseInt(timeMatch[2]), s = parseInt(timeMatch[3]);
    const totalMin = h * 60 + m;
    const time = `${totalMin}:${String(s).padStart(2, "0")}`;
    const text = rows
      .filter((r) => !r.includes("-->") && !r.match(/^\d+$/) && r.trim())
      .join(" ")
      .replace(/<[^>]+>/g, "") // strip HTML tags
      .trim();
    if (text) lines.push({ time, text });
  }
  return lines;
}

async function aiSummarize(title: string, transcript: { time: string; text: string }[]) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) throw new Error("AI_API_KEY not configured");

  // Limit transcript to ~3000 chars to stay within token budget
  const fullText = transcript
    .map((t) => `[${t.time}] ${t.text}`)
    .join("\n")
    .slice(0, 3000);

  const prompt = `You are a helpful assistant. Given the following YouTube video transcript, provide:
1. A concise summary (2-3 sentences) of what the video is about
2. 5 key points from the video

Video title: ${title}

Transcript:
${fullText}

Respond in JSON format exactly like this:
{
  "summary": "...",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content) as { summary: string; keyPoints: string[] };
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const videoId = extractVideoId(url);
  if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

  const outPath = `/tmp/transcript-${videoId}`;

  try {
    // Clean up any old subtitle files
    [`${outPath}.en.json3`, `${outPath}.zh-Hans.json3`, `${outPath}.zh.json3`].forEach((f) => { try { if (existsSync(f)) unlinkSync(f); } catch {} });

    // Get title + subtitles: try json3 first, fallback to vtt
    const { stdout: titleOut } = await execAsync(
      `PATH=$PATH:/root/.deno/bin yt-dlp --cookies /root/yt-cookies.txt --js-runtimes deno --remote-components ejs:github --write-auto-sub --sub-lang "en,zh-Hans,zh,zh-TW" --skip-download --sub-format json3 --print "%(title)s" -o "${outPath}" "${url}" 2>/dev/null`,
      { timeout: 120000 }
    );
    const title = titleOut.trim() || `YouTube Video (${videoId})`;

    // Find subtitle file — json3 preferred, vtt fallback
    const subCandidates = [
      `${outPath}.en.json3`, `${outPath}.zh-Hans.json3`, `${outPath}.zh.json3`, `${outPath}.zh-TW.json3`,
      `${outPath}.en.vtt`, `${outPath}.zh-TW.vtt`, `${outPath}.zh-Hans.vtt`, `${outPath}.zh.vtt`,
    ];
    let subFile = subCandidates.find((f) => existsSync(f));

    // If no json3 found, retry with vtt format
    if (!subFile) {
      await execAsync(
        `PATH=$PATH:/root/.deno/bin yt-dlp --cookies /root/yt-cookies.txt --js-runtimes deno --remote-components ejs:github --write-auto-sub --sub-lang "en,zh-Hans,zh,zh-TW" --skip-download --sub-format vtt -o "${outPath}" "${url}" 2>/dev/null`,
        { timeout: 120000 }
      ).catch(() => {});
      subFile = subCandidates.find((f) => existsSync(f));
    }

    if (!subFile) {
      return NextResponse.json({ error: "No subtitles available for this video. The video may not have captions enabled." }, { status: 404 });
    }

    const raw = readFileSync(subFile, "utf-8");
    const transcript = subFile.endsWith(".vtt") ? parseVtt(raw) : parseJson3(raw);
    subCandidates.forEach((f) => { try { if (existsSync(f)) unlinkSync(f); } catch {} });

    if (transcript.length === 0) {
      return NextResponse.json({ error: "Could not parse subtitles for this video." }, { status: 404 });
    }

    // AI summary
    const { summary, keyPoints } = await aiSummarize(title, transcript);

    return NextResponse.json({ title, summary, keyPoints, transcript });
  } catch (err) {
    [`${outPath}.en.json3`, `${outPath}.zh-Hans.json3`, `${outPath}.zh.json3`].forEach((f) => { try { if (existsSync(f)) unlinkSync(f); } catch {} });
    const msg = err instanceof Error ? err.message : "Failed to process video";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
