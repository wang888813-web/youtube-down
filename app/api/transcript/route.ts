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

function generateSummary(transcript: { time: string; text: string }[], title: string) {
  const fullText = transcript.map((t) => t.text).join(" ").replace(/\[.*?\]/g, "").trim();
  const sentences = fullText.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);

  // Pick first, middle, last meaningful sentences as summary
  const picked: string[] = [];
  if (sentences[0]) picked.push(sentences[0]);
  if (sentences[Math.floor(sentences.length / 2)]) picked.push(sentences[Math.floor(sentences.length / 2)]);
  if (sentences[sentences.length - 1] && sentences.length > 2) picked.push(sentences[sentences.length - 1]);

  const summary = picked.join(". ") + (picked.length ? "." : "");

  // Key points: pick sentences with keywords
  const keywords = ["important", "key", "main", "first", "second", "third", "finally", "remember", "note", "tip", "step", "must", "should", "need", "best"];
  const keyPoints = sentences
    .filter((s) => keywords.some((k) => s.toLowerCase().includes(k)))
    .slice(0, 5);

  if (keyPoints.length < 3) {
    // fallback: evenly spaced sentences
    const step = Math.max(1, Math.floor(sentences.length / 5));
    for (let i = 0; i < sentences.length && keyPoints.length < 5; i += step) {
      if (!keyPoints.includes(sentences[i])) keyPoints.push(sentences[i]);
    }
  }

  return {
    summary: summary || `This video titled "${title}" contains ${transcript.length} segments of content.`,
    keyPoints: keyPoints.slice(0, 5),
  };
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
  const subFile = `${outPath}.en.json3`;

  try {
    // Clean up old file
    if (existsSync(subFile)) unlinkSync(subFile);

    // Get video title
    const { stdout: titleOut } = await execAsync(
      `PATH=$PATH:/root/.deno/bin yt-dlp --cookies /root/yt-cookies.txt --js-runtimes deno --remote-components ejs:github --get-title "${url}" 2>/dev/null`,
      { timeout: 60000 }
    );
    const title = titleOut.trim() || `YouTube Video (${videoId})`;

    // Extract subtitles
    await execAsync(
      `PATH=$PATH:/root/.deno/bin yt-dlp --cookies /root/yt-cookies.txt --js-runtimes deno --remote-components ejs:github --write-auto-sub --sub-lang en --skip-download --sub-format json3 -o "${outPath}" "${url}" 2>/dev/null`,
      { timeout: 120000 }
    );

    if (!existsSync(subFile)) {
      return NextResponse.json({ error: "No subtitles available for this video." }, { status: 404 });
    }

    const raw = readFileSync(subFile, "utf-8");
    const transcript = parseJson3(raw);

    if (transcript.length === 0) {
      return NextResponse.json({ error: "Could not parse subtitles for this video." }, { status: 404 });
    }

    const { summary, keyPoints } = generateSummary(transcript, title);

    // Cleanup
    if (existsSync(subFile)) unlinkSync(subFile);

    return NextResponse.json({ title, summary, keyPoints, transcript });
  } catch (err) {
    if (existsSync(subFile)) unlinkSync(subFile);
    const msg = err instanceof Error ? err.message : "Failed to process video";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
