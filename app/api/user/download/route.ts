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

const PLAN_LIMITS: Record<string, number> = {
  free: 30,
  pro: 500,
  unlimited: -1,
};

export async function POST(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, video_url, video_title, thumbnail_url, quality, format, file_size } = await request.json();
  if (!google_id || !video_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first() as any;
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 检查套餐是否过期
  const now = Math.floor(Date.now() / 1000);
  let plan = user.plan || "free";
  if (plan !== "free" && user.plan_expires_at && user.plan_expires_at < now) {
    await db.prepare("UPDATE users SET plan = 'free', plan_expires_at = NULL WHERE id = ?").bind(user.id).run();
    plan = "free";
  }

  // 检查月度重置
  const thisMonth = new Date().toISOString().slice(0, 7);
  let monthlyCount = user.monthly_download_count || 0;
  if (user.monthly_reset_date !== thisMonth) {
    monthlyCount = 0;
    await db.prepare(`
      UPDATE users SET monthly_download_count = 0, monthly_ai_count = 0, monthly_reset_date = ? WHERE id = ?
    `).bind(thisMonth, user.id).run();
  }

  const limit = PLAN_LIMITS[plan] ?? 30;
  if (limit !== -1 && monthlyCount >= limit) {
    return NextResponse.json({
      error: "Monthly limit reached",
      limit,
      count: monthlyCount,
      plan,
    }, { status: 429 });
  }

  // 记录下载历史
  await db.prepare(`
    INSERT INTO download_history (user_id, video_url, video_title, thumbnail_url, quality, format, file_size)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(user.id, video_url, video_title || null, thumbnail_url || null, quality || null, format || null, file_size || null).run();

  // 更新月度计数
  await db.prepare(`
    UPDATE users SET monthly_download_count = monthly_download_count + 1, updated_at = ? WHERE id = ?
  `).bind(now, user.id).run();

  // 也更新每日统计
  const today = new Date().toISOString().slice(0, 10);
  await db.prepare(`
    INSERT INTO usage_stats (user_id, date, download_count)
    VALUES (?, ?, 1)
    ON CONFLICT(user_id, date) DO UPDATE SET download_count = download_count + 1
  `).bind(user.id, today).run();

  return NextResponse.json({
    success: true,
    count: monthlyCount + 1,
    limit: limit === -1 ? null : limit,
  });
}
