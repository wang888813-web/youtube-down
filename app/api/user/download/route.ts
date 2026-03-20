import { NextRequest, NextResponse } from "next/server";

// POST /api/user/download — 记录下载历史 + 更新使用量
export async function POST(request: NextRequest) {
  const db = (process.env as any).DB;
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, video_url, video_title, thumbnail_url, quality, format, file_size } = await request.json();
  if (!google_id || !video_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 检查免费用户每日限额（5次）
  const today = new Date().toISOString().slice(0, 10);
  const usage = await db.prepare(
    "SELECT * FROM usage_stats WHERE user_id = ? AND date = ?"
  ).bind(user.id, today).first() as any;

  const currentCount = usage?.download_count || 0;
  const limit = user.plan === "pro" ? Infinity : 5;

  if (currentCount >= limit) {
    return NextResponse.json({ error: "Daily limit reached", limit, count: currentCount }, { status: 429 });
  }

  // 记录下载历史
  await db.prepare(`
    INSERT INTO download_history (user_id, video_url, video_title, thumbnail_url, quality, format, file_size)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(user.id, video_url, video_title || null, thumbnail_url || null, quality || null, format || null, file_size || null).run();

  // 更新使用量
  await db.prepare(`
    INSERT INTO usage_stats (user_id, date, download_count)
    VALUES (?, ?, 1)
    ON CONFLICT(user_id, date) DO UPDATE SET download_count = download_count + 1
  `).bind(user.id, today).run();

  return NextResponse.json({ success: true, count: currentCount + 1, limit });
}
