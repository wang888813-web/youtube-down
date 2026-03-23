import { NextRequest, NextResponse } from "next/server";

const YTDL_BASE = process.env.YTDL_API_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, resolution, format, audioOnly } = body;
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  try {
    const res = await fetch(`${YTDL_BASE}/api/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, resolution, format, audioOnly }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to start download";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
