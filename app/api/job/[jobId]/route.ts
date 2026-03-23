import { NextRequest, NextResponse } from "next/server";

const YTDL_BASE = process.env.YTDL_API_URL || "http://localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  try {
    const res = await fetch(`${YTDL_BASE}/api/job/${jobId}`);
    const data = await res.json();

    // Attach absolute downloadUrl so client can download directly from VPS
    if (data.status === "done" && data.file) {
      data.downloadUrl = `${YTDL_BASE}${data.file}`;
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to get job status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
