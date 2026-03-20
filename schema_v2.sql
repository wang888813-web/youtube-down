-- 推荐记录表
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  reward_days INTEGER DEFAULT 0,
  rewarded_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(referrer_id, referee_id)
);

-- 订阅记录表
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active',
  started_at INTEGER DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL,
  cancelled_at INTEGER,
  payment_ref TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- 用户表扩展字段（逐条 ALTER）
ALTER TABLE users ADD COLUMN referral_code TEXT;
ALTER TABLE users ADD COLUMN referred_by INTEGER;
ALTER TABLE users ADD COLUMN monthly_download_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monthly_ai_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monthly_reset_date TEXT;

-- 索引
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
