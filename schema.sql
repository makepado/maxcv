-- MaxCV Cloudflare D1 (hongjaed1db) 구글 계정 기반 멀티유저 스키마
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  sub TEXT,
  name TEXT NOT NULL,
  picture TEXT,
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_resumes (
  id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  data TEXT NOT NULL,
  is_public INTEGER DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_user_resumes_email_updated ON user_resumes(user_email, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_resumes_id ON user_resumes(id);
