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

  const res = await fetch("https://api.yttoolsbox.com/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
