-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  plan TEXT DEFAULT 'free',        -- free | pro
  plan_expires_at INTEGER,         -- Unix timestamp, NULL=永久
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- 下载历史表
CREATE TABLE IF NOT EXISTS download_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  video_title TEXT,
  thumbnail_url TEXT,
  quality TEXT,                    -- 1080p / 720p / mp3 等
  format TEXT,                     -- mp4 / mp3 / m4a
  file_size INTEGER,               -- bytes
  created_at INTEGER DEFAULT (unixepoch())
);

-- 使用量统计表（按天）
CREATE TABLE IF NOT EXISTS usage_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,              -- YYYY-MM-DD
  download_count INTEGER DEFAULT 0,
  ai_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_download_history_user_id ON download_history(user_id);
CREATE INDEX IF NOT EXISTS idx_download_history_created_at ON download_history(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON usage_stats(user_id, date);
