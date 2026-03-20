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

export async function GET(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const google_id = request.nextUrl.searchParams.get("google_id");
  if (!google_id) return NextResponse.json({ error: "Missing google_id" }, { status: 400 });

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const usage = await db.prepare(
    "SELECT * FROM usage_stats WHERE user_id = ? AND date = ?"
  ).bind(user.id, today).first();

  const history = await db.prepare(
    "SELECT * FROM download_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
  ).bind(user.id).all();

  return NextResponse.json({
    user,
    today_usage: usage || { download_count: 0, ai_count: 0 },
    history: history.results,
  });
}

export async function POST(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, email, name, picture } = await request.json();
  if (!google_id || !email || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);

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
