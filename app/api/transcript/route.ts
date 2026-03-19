import { NextRequest, NextResponse } from "next/server";


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
      .replace(/<[^>]+>/g, "")
      .trim();
    if (text) lines.push({ time, text });
  }
  return lines;
}

function parseSrt(raw: string): { time: string; text: string }[] {
  const lines: { time: string; text: string }[] = [];
  const blocks = raw.split(/\n\n+/);
  for (const block of blocks) {
    const rows = block.trim().split("\n");
    const timeLine = rows.find((r) => r.includes("-->"));
    if (!timeLine) continue;
    const timeMatch = timeLine.match(/(\d+):(\d+):(\d+)/);
    if (!timeMatch) continue;
    const h = parseInt(timeMatch[1]), m = parseInt(timeMatch[2]), s = parseInt(timeMatch[3]);
    const totalMin = h * 60 + m;
    const time = `${totalMin}:${String(s).padStart(2, "0")}`;
    const text = rows
      .filter((r) => !r.includes("-->") && !r.match(/^\d+$/) && r.trim())
      .join(" ")
      .replace(/<[^>]+>/g, "")
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

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const apiKey = process.env.MEOWLOAD_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  // Step 1: fetch subtitle list from meowload
  const subRes = await fetch("https://api.meowload.net/openapi/extract/subtitles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "accept-language": "zh",
    },
    body: JSON.stringify({ url }),
  });

  if (!subRes.ok) {
    const err = await subRes.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || "Failed to fetch subtitles" }, { status: subRes.status });
  }

  const subData = await subRes.json();
  const title: string = subData.text || "YouTube Video";
  const subtitles: { language_tag: string; urls: { url: string; format: string }[] }[] = subData.subtitles || [];

  if (!subtitles.length) {
    return NextResponse.json({ error: "No subtitles available for this video." }, { status: 404 });
  }

  // Step 2: pick best subtitle — prefer en, fallback to first available
  const preferred = ["en", "zh-CN", "zh-TW", "zh"];
  const picked =
    preferred.map((tag) => subtitles.find((s) => s.language_tag === tag)).find(Boolean) || subtitles[0];

  // prefer vtt, fallback srt
  const vttUrl = picked.urls.find((u) => u.format === "vtt")?.url;
  const srtUrl = picked.urls.find((u) => u.format === "srt")?.url;
  const subUrl = vttUrl || srtUrl;
  const subFormat = vttUrl ? "vtt" : "srt";

  if (!subUrl) {
    return NextResponse.json({ error: "No downloadable subtitle URL found." }, { status: 404 });
  }

  // Step 3: download and parse subtitle file
  const rawRes = await fetch(subUrl);
  if (!rawRes.ok) {
    return NextResponse.json({ error: "Failed to download subtitle file." }, { status: 500 });
  }
  const raw = await rawRes.text();
  const transcript = subFormat === "vtt" ? parseVtt(raw) : parseSrt(raw);

  if (!transcript.length) {
    return NextResponse.json({ error: "Could not parse subtitles for this video." }, { status: 404 });
  }

  // Step 4: AI summary
  const { summary, keyPoints } = await aiSummarize(title, transcript);

  return NextResponse.json({ title, summary, keyPoints, transcript });
}
