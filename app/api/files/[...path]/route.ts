import { NextRequest, NextResponse } from "next/server";

const YTDL_BASE = process.env.YTDL_API_URL || "http://localhost:3000";

export const maxDuration = 300;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");

  try {
    const range = req.headers.get("range");
    const headers: Record<string, string> = {};
    if (range) headers["Range"] = range;

    const upstream = await fetch(`${YTDL_BASE}/files/${filePath}`, { headers });
    if (!upstream.ok) {
      return NextResponse.json({ error: "File not found or expired" }, { status: upstream.status });
    }

    const resHeaders: Record<string, string> = {};
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    const contentDisposition = upstream.headers.get("content-disposition");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges");

    if (contentType) resHeaders["Content-Type"] = contentType;
    if (contentLength) resHeaders["Content-Length"] = contentLength;
    if (contentDisposition) resHeaders["Content-Disposition"] = contentDisposition;
    if (contentRange) resHeaders["Content-Range"] = contentRange;
    if (acceptRanges) resHeaders["Accept-Ranges"] = acceptRanges;

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
