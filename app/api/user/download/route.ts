import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getDB() {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as any).DB || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, video_url, video_title, thumbnail_url, quality, format, file_size } = await request.json();
  if (!google_id || !video_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first() as any;
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const usage = await db.prepare(
    "SELECT * FROM usage_stats WHERE user_id = ? AND date = ?"
  ).bind(user.id, today).first() as any;

  const currentCount = usage?.download_count || 0;
  const limit = user.plan === "pro" ? Infinity : 5;

  if (currentCount >= limit) {
    return NextResponse.json({ error: "Daily limit reached", limit, count: currentCount }, { status: 429 });
  }

  await db.prepare(`
    INSERT INTO download_history (user_id, video_url, video_title, thumbnail_url, quality, format, file_size)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(user.id, video_url, video_title || null, thumbnail_url || null, quality || null, format || null, file_size || null).run();

  await db.prepare(`
    INSERT INTO usage_stats (user_id, date, download_count)
    VALUES (?, ?, 1)
    ON CONFLICT(user_id, date) DO UPDATE SET download_count = download_count + 1
  `).bind(user.id, today).run();

  return NextResponse.json({ success: true, count: currentCount + 1, limit });
}
