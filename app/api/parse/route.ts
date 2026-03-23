import { NextRequest, NextResponse } from "next/server";

const YTDL_BASE = process.env.YTDL_API_URL || "http://localhost:3000";

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
  thumbnail: string;
  duration: number;
  uploader: string;
  availableResolutions: { value: string; label: string }[];
  maxResolution: string;
  // legacy fields for downloader page compatibility
  preview_url?: string;
  formats?: VideoFormat[];
  audio_url?: string | null;
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  try {
    const res = await fetch(`${YTDL_BASE}/api/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });

    // Normalize to also expose preview_url/formats/audio_url for downloader page
    const normalized = {
      ...data,
      preview_url: data.thumbnail,
      formats: (data.availableResolutions || []).map((r: { value: string; label: string }) => ({
        quality: parseInt(r.value),
        quality_note: r.label,
        video_url: "",  // filled in at download time
        video_ext: "mp4",
        video_size: 0,
        audio_url: null,
        audio_ext: null,
        audio_size: null,
        separate: 1,
      })),
      audio_url: null,
    };

    return NextResponse.json(normalized);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to parse video";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
