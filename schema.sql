-- MaxCV Cloudflare D1 (hongjae1db) 스키마 정의
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);
