import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch resource" }, { status: res.status });

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentLength = res.headers.get("content-length");
    const buffer = await res.arrayBuffer();

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="download"`,
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new NextResponse(buffer, { headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
