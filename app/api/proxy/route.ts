import { NextRequest, NextResponse } from "next/server";


export const maxDuration = 300;

const ALLOWED_HOSTS = ["googlevideo.com", "youtube.com", "ytimg.com", "ggpht.com"];

function isAllowedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  try {
    // Extract the ip= param from the URL and spoof it in headers
    const parsedUrl = new URL(url);
    const boundIp = parsedUrl.searchParams.get("ip") || "";

    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.youtube.com/",
        "Origin": "https://www.youtube.com",
        ...(boundIp ? { "X-Forwarded-For": boundIp, "X-Real-IP": boundIp } : {}),
      },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch resource" }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    // Derive filename from content type
    const ext = contentType.includes("audio") ? "mp3" : contentType.includes("video") ? "mp4" : "jpg";
    const filename = ext === "jpg" ? "thumbnail.jpg" : ext === "mp3" ? "audio.mp3" : "video.mp4";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    // Stream directly — no buffering in memory
    return new NextResponse(upstream.body, { headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
