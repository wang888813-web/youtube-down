import { NextRequest, NextResponse } from "next/server";

// GET /api/user?google_id=xxx — 获取或创建用户
export async function GET(request: NextRequest) {
  const db = (process.env as any).DB;
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const google_id = request.nextUrl.searchParams.get("google_id");
  if (!google_id) return NextResponse.json({ error: "Missing google_id" }, { status: 400 });

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 今日使用量
  const today = new Date().toISOString().slice(0, 10);
  const usage = await db.prepare(
    "SELECT * FROM usage_stats WHERE user_id = ? AND date = ?"
  ).bind(user.id, today).first();

  // 下载历史（最近20条）
  const history = await db.prepare(
    "SELECT * FROM download_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
  ).bind(user.id).all();

  return NextResponse.json({
    user,
    today_usage: usage || { download_count: 0, ai_count: 0 },
    history: history.results,
  });
}

// POST /api/user — 注册或更新用户
export async function POST(request: NextRequest) {
  const db = (process.env as any).DB;
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, email, name, picture } = await request.json();
  if (!google_id || !email || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);

  // Upsert 用户
  await db.prepare(`
    INSERT INTO users (google_id, email, name, picture, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      picture = excluded.picture,
      updated_at = excluded.updated_at
  `).bind(google_id, email, name, picture || null, now).run();

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first();
  return NextResponse.json({ user });
}
