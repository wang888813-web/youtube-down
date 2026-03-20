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

// 套餐限额
const PLAN_LIMITS = {
  free:      { monthly_downloads: 30,  monthly_ai: 10,  max_quality: "720p",  remove_ads: false },
  pro:       { monthly_downloads: 500, monthly_ai: 200, max_quality: "4K",    remove_ads: true  },
  unlimited: { monthly_downloads: -1,  monthly_ai: -1,  max_quality: "4K",    remove_ads: true  },
};

function generateReferralCode(userId: number, email: string): string {
  const base = email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const suffix = (userId * 7919 + 12345).toString(36).toUpperCase().slice(-4);
  return `${base}${suffix}`;
}

export async function GET(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const google_id = request.nextUrl.searchParams.get("google_id");
  if (!google_id) return NextResponse.json({ error: "Missing google_id" }, { status: 400 });

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first() as any;
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 检查套餐是否过期
  const now = Math.floor(Date.now() / 1000);
  if (user.plan !== "free" && user.plan_expires_at && user.plan_expires_at < now) {
    await db.prepare("UPDATE users SET plan = 'free', plan_expires_at = NULL WHERE id = ?").bind(user.id).run();
    user.plan = "free";
    user.plan_expires_at = null;
  }

  // 检查月度重置
  const thisMonth = new Date().toISOString().slice(0, 7);
  if (user.monthly_reset_date !== thisMonth) {
    await db.prepare(`
      UPDATE users SET monthly_download_count = 0, monthly_ai_count = 0, monthly_reset_date = ? WHERE id = ?
    `).bind(thisMonth, user.id).run();
    user.monthly_download_count = 0;
    user.monthly_ai_count = 0;
    user.monthly_reset_date = thisMonth;
  }

  // 确保有推荐码
  if (!user.referral_code) {
    const code = generateReferralCode(user.id, user.email);
    await db.prepare("UPDATE users SET referral_code = ? WHERE id = ?").bind(code, user.id).run();
    user.referral_code = code;
  }

  const today = new Date().toISOString().slice(0, 10);
  const usage = await db.prepare(
    "SELECT * FROM usage_stats WHERE user_id = ? AND date = ?"
  ).bind(user.id, today).first();

  const history = await db.prepare(
    "SELECT * FROM download_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
  ).bind(user.id).all();

  const plan = (user.plan as keyof typeof PLAN_LIMITS) || "free";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return NextResponse.json({
    user,
    today_usage: usage || { download_count: 0, ai_count: 0 },
    history: history.results,
    limits,
  });
}

export async function POST(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { google_id, email, name, picture, ref } = await request.json();
  if (!google_id || !email || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const thisMonth = new Date().toISOString().slice(0, 7);

  // 检查是否新用户
  const existing = await db.prepare("SELECT id FROM users WHERE google_id = ?").bind(google_id).first() as any;
  const isNew = !existing;

  await db.prepare(`
    INSERT INTO users (google_id, email, name, picture, updated_at, monthly_reset_date)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      picture = excluded.picture,
      updated_at = excluded.updated_at
  `).bind(google_id, email, name, picture || null, now, thisMonth).run();

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first() as any;

  // 确保推荐码
  if (!user.referral_code) {
    const code = generateReferralCode(user.id, user.email);
    await db.prepare("UPDATE users SET referral_code = ? WHERE id = ?").bind(code, user.id).run();
    user.referral_code = code;
  }

  // 新用户 + 有推荐码 → 绑定推荐关系
  if (isNew && ref && !user.referred_by) {
    const referrer = await db.prepare("SELECT * FROM users WHERE referral_code = ?").bind((ref as string).toUpperCase()).first() as any;
    if (referrer && referrer.id !== user.id) {
      await db.prepare("UPDATE users SET referred_by = ? WHERE id = ?").bind(referrer.id, user.id).run();
      await db.prepare(`
        INSERT OR IGNORE INTO referrals (referrer_id, referee_id, status, reward_days)
        VALUES (?, ?, 'registered', 1)
      `).bind(referrer.id, user.id).run();

      // 推荐人 +1 天 Pro
      const currentExpiry = referrer.plan_expires_at || now;
      const newExpiry = Math.max(currentExpiry, now) + 86400;
      await db.prepare(`
        UPDATE users SET plan = 'pro', plan_expires_at = ?, updated_at = ? WHERE id = ?
      `).bind(newExpiry, now, referrer.id).run();
      await db.prepare(`
        UPDATE referrals SET rewarded_at = ? WHERE referrer_id = ? AND referee_id = ?
      `).bind(now, referrer.id, user.id).run();
    }
  }

  return NextResponse.json({ user, isNew });
}
