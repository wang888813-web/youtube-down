import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const format = req.nextUrl.searchParams.get("format") || "mp4";
  const quality = req.nextUrl.searchParams.get("quality") || "720p";

  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  // TODO: In production, proxy to a backend service running yt-dlp
  // e.g.:
  // const res = await fetch(`${process.env.API_URL}/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`)
  // return new NextResponse(res.body, { headers: { 'Content-Type': format === 'mp3' ? 'audio/mpeg' : 'video/mp4', 'Content-Disposition': `attachment; filename="download.${format}"` } })

  return NextResponse.json(
    { error: "Download service not configured. Set API_URL in environment variables to connect to yt-dlp backend." },
    { status: 501 }
  );
}
