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

function generateReferralCode(userId: number, email: string): string {
  const base = email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const suffix = (userId * 7919 + 12345).toString(36).toUpperCase().slice(-4);
  return `${base}${suffix}`;
}

// GET /api/referral?google_id=xxx — 获取推荐数据
export async function GET(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const google_id = request.nextUrl.searchParams.get("google_id");
  if (!google_id) return NextResponse.json({ error: "Missing google_id" }, { status: 400 });

  const user = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(google_id).first() as any;
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 确保有推荐码
  if (!user.referral_code) {
    const code = generateReferralCode(user.id, user.email);
    await db.prepare("UPDATE users SET referral_code = ? WHERE id = ?").bind(code, user.id).run();
    user.referral_code = code;
  }

  // 获取推荐列表
  const referrals = await db.prepare(`
    SELECT r.id, r.status, r.reward_days, r.rewarded_at, r.created_at,
           u.name AS referee_name, u.email AS referee_email, u.picture AS referee_picture,
           s.plan AS sub_plan, s.billing_cycle, s.expires_at AS sub_expires
    FROM referrals r
    JOIN users u ON u.id = r.referee_id
    LEFT JOIN subscriptions s ON s.user_id = r.referee_id AND s.status = 'active'
    WHERE r.referrer_id = ?
    ORDER BY r.created_at DESC
  `).bind(user.id).all();

  // 统计
  const total = referrals.results.length;
  const converted = referrals.results.filter((r: any) => r.status === "converted").length;
  const totalRewardDays = referrals.results.reduce((sum: number, r: any) => sum + (r.reward_days || 0), 0);

  return NextResponse.json({
    referral_code: user.referral_code,
    referral_url: `https://yttoolsbox.com?ref=${user.referral_code}`,
    stats: { total, converted, totalRewardDays },
    referrals: referrals.results,
  });
}

// POST /api/referral — 注册时绑定推荐关系
export async function POST(request: NextRequest) {
  const db = await getDB();
  if (!db) return NextResponse.json({ error: "DB not available" }, { status: 503 });

  const { referee_google_id, referral_code } = await request.json();
  if (!referee_google_id || !referral_code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const referee = await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(referee_google_id).first() as any;
  if (!referee) return NextResponse.json({ error: "Referee not found" }, { status: 404 });

  // 已有推荐人则跳过
  if (referee.referred_by) return NextResponse.json({ message: "Already referred" });

  const referrer = await db.prepare("SELECT * FROM users WHERE referral_code = ?").bind(referral_code.toUpperCase()).first() as any;
  if (!referrer) return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
  if (referrer.id === referee.id) return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });

  const now = Math.floor(Date.now() / 1000);

  // 绑定推荐关系
  await db.prepare("UPDATE users SET referred_by = ? WHERE id = ?").bind(referrer.id, referee.id).run();

  // 创建推荐记录
  await db.prepare(`
    INSERT OR IGNORE INTO referrals (referrer_id, referee_id, status, reward_days)
    VALUES (?, ?, 'registered', 1)
  `).bind(referrer.id, referee.id).run();

  // 推荐人获得 1 天 Pro 奖励
  const currentExpiry = referrer.plan_expires_at || now;
  const newExpiry = Math.max(currentExpiry, now) + 86400; // +1天
  await db.prepare(`
    UPDATE users SET
      plan = 'pro',
      plan_expires_at = ?,
      updated_at = ?
    WHERE id = ?
  `).bind(newExpiry, now, referrer.id).run();

  // 标记奖励已发放
  await db.prepare(`
    UPDATE referrals SET rewarded_at = ? WHERE referrer_id = ? AND referee_id = ?
  `).bind(now, referrer.id, referee.id).run();

  return NextResponse.json({ success: true, reward: "1 day Pro added to referrer" });
}
