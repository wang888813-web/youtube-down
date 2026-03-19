import { NextRequest, NextResponse } from "next/server";

export interface VideoFormat {
  quality: number;
  quality_note: string;
  video_url: string;
  video_ext: string;
  video_size: number;
  audio_url: string | null;
  audio_ext: string | null;
  audio_size: number | null;
  separate: number; // 1=分离, 0=合并
}

export interface ParseResult {
  title: string;
  preview_url: string;
  formats: VideoFormat[];
  audio_url: string | null; // 纯音频流
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const apiKey = process.env.MEOWLOAD_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  const res = await fetch("https://api.meowload.net/openapi/extract/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "accept-language": "zh",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || "Failed to parse video" }, { status: res.status });
  }

  const data = await res.json();
  const media = data.medias?.find((m: { media_type: string }) => m.media_type === "video") || data.medias?.[0];
  const audioMedia = data.medias?.find((m: { media_type: string }) => m.media_type === "audio");

  if (!media) return NextResponse.json({ error: "No media found" }, { status: 404 });

  // Filter to mp4 formats only (720p, 1080p priority), sorted by quality desc
  const formats: VideoFormat[] = (media.formats || [])
    .filter((f: VideoFormat) => f.video_ext === "mp4" || f.quality <= 1080)
    .sort((a: VideoFormat, b: VideoFormat) => b.quality - a.quality);

  return NextResponse.json({
    title: data.text || "YouTube Video",
    preview_url: media.preview_url || "",
    formats,
    audio_url: audioMedia?.resource_url || null,
  } as ParseResult);
}
