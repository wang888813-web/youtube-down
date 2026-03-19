import { NextResponse } from "next/server";

export const runtime = "edge";

// Deprecated: downloads now use /api/proxy directly.
export async function GET() {
  return NextResponse.json({ error: "This endpoint is deprecated. Use /api/proxy instead." }, { status: 410 });
}
