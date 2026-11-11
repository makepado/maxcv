interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Google-Email',
};

async function ensureTables(db: any) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        sub TEXT,
        name TEXT NOT NULL,
        picture TEXT,
        created_at TEXT NOT NULL,
        last_login_at TEXT NOT NULL
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS user_resumes (
        id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        data TEXT NOT NULL,
        is_public INTEGER DEFAULT 1,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (id, user_email)
      )`
    )
    .run();
}

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(
      JSON.stringify({
        ok: false,
        d1Connected: false,
        message: 'Cloudflare D1 (DB) 바인딩이 연결되지 않았습니다.',
        resumes: [],
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTables(db);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const userEmail = (
      url.searchParams.get('email') ||
      context.request.headers.get('X-Google-Email') ||
      ''
    )
      .trim()
      .toLowerCase();

    // 1. 특정 공유 이력서 ID 조회 (?id=...)
    if (id) {
      let row;
      if (userEmail) {
        row = await db
          .prepare('SELECT id, user_email, title, data, updated_at FROM user_resumes WHERE id = ? AND user_email = ?')
          .bind(id, userEmail)
          .first();
      }
      if (!row) {
        row = await db
          .prepare('SELECT id, user_email, title, data, updated_at FROM user_resumes WHERE id = ? ORDER BY updated_at DESC LIMIT 1')
          .bind(id)
          .first();
      }

      if (!row) {
        return new Response(
          JSON.stringify({ ok: false, d1Connected: true, error: '이력서를 찾을 수 없습니다.' }),
          { status: 404, headers: CORS_HEADERS }
        );
      }
      return new Response(
        JSON.stringify({
          ok: true,
          d1Connected: true,
          userEmail: row.user_email,
          resume: JSON.parse(row.data),
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 2. 구글 로그인 계정(userEmail) 기준 이력서 목록 조회
    if (!userEmail) {
      return new Response(
        JSON.stringify({
          ok: true,
          d1Connected: true,
          requiresAuth: true,
          message: '구글 로그인 후 계정별 이력서를 불러올 수 있습니다.',
          resumes: [],
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const { results } = await db
      .prepare(
        'SELECT id, user_email, title, data, updated_at FROM user_resumes WHERE user_email = ? ORDER BY updated_at DESC LIMIT 100'
      )
      .bind(userEmail)
      .all();

    const parsed = (results || [])
      .map((r: any) => {
        try {
          return JSON.parse(r.data);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return new Response(
      JSON.stringify({
        ok: true,
        d1Connected: true,
        userEmail,
        resumes: parsed,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        d1Connected: true,
        error: err?.message || 'D1 조회 중 오류가 발생했습니다.',
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(
      JSON.stringify({
        ok: false,
        d1Connected: false,
        error: 'D1 데이터베이스 바인딩(DB)이 없습니다.',
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTables(db);
    const body = (await context.request.json()) as any;
    const user = body?.user;
    const userEmail = (
      user?.email ||
      body?.userEmail ||
      context.request.headers.get('X-Google-Email') ||
      ''
    )
      .trim()
      .toLowerCase();

    if (!userEmail) {
      return new Response(
        JSON.stringify({
          ok: false,
          d1Connected: true,
          requiresAuth: true,
          error: '구글 로그인이 필요합니다. 로그인 후 계정에 저장해주세요.',
        }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const now = new Date().toISOString();

    // 구글 유저 정보(users 테이블) 갱신
    if (user?.email) {
      await db
        .prepare(
          `INSERT INTO users (email, sub, name, picture, created_at, last_login_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET
             name = excluded.name,
             picture = excluded.picture,
             last_login_at = excluded.last_login_at`
        )
        .bind(
          userEmail,
          user.sub || '',
          user.name || userEmail.split('@')[0],
          user.picture || '',
          now,
          now
        )
        .run();
    }

    const doc = body?.resume;
    if (!doc || !doc.id) {
      return new Response(
        JSON.stringify({ ok: false, error: '유효하지 않은 이력서 데이터입니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    doc.updatedAt = now;
    const title = doc.name || doc.personal?.fullName || 'Untitled CV';

    await db
      .prepare(
        `INSERT INTO user_resumes (id, user_email, title, data, is_public, updated_at)
         VALUES (?, ?, ?, ?, 1, ?)
         ON CONFLICT(id, user_email) DO UPDATE SET
           title = excluded.title,
           data = excluded.data,
           updated_at = excluded.updated_at`
      )
      .bind(doc.id, userEmail, title, JSON.stringify(doc), now)
      .run();

    return new Response(
      JSON.stringify({
        ok: true,
        d1Connected: true,
        userEmail,
        id: doc.id,
        updatedAt: now,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        d1Connected: true,
        error: err?.message || 'D1 저장 중 오류가 발생했습니다.',
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

export const onRequestDelete = async (context: { env: Env; request: Request }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(
      JSON.stringify({ ok: false, d1Connected: false }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTables(db);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const userEmail = (
      url.searchParams.get('email') ||
      context.request.headers.get('X-Google-Email') ||
      ''
    )
      .trim()
      .toLowerCase();

    if (!id || !userEmail) {
      return new Response(
        JSON.stringify({ ok: false, error: '삭제할 id와 구글 계정 이메일이 필요합니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await db
      .prepare('DELETE FROM user_resumes WHERE id = ? AND user_email = ?')
      .bind(id, userEmail)
      .run();

    return new Response(
      JSON.stringify({ ok: true, d1Connected: true, deletedId: id, userEmail }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
