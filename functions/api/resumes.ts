interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function ensureTable(db: any) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
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
        message: 'Cloudflare D1 (DB) 바인딩이 아직 연결되지 않았습니다.',
        resumes: [],
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTable(db);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (id) {
      const row = await db
        .prepare('SELECT id, title, data, updated_at FROM resumes WHERE id = ?')
        .bind(id)
        .first();
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
          resume: JSON.parse(row.data),
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const { results } = await db
      .prepare('SELECT id, title, data, updated_at FROM resumes ORDER BY updated_at DESC LIMIT 50')
      .all();

    const parsed = (results || []).map((r: any) => {
      try {
        return JSON.parse(r.data);
      } catch {
        return null;
      }
    }).filter(Boolean);

    return new Response(
      JSON.stringify({
        ok: true,
        d1Connected: true,
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
    await ensureTable(db);
    const body = (await context.request.json()) as any;
    const doc = body?.resume || body;
    if (!doc || !doc.id) {
      return new Response(
        JSON.stringify({ ok: false, error: '유효하지 않은 이력서 데이터입니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const updatedAt = new Date().toISOString();
    doc.updatedAt = updatedAt;
    const title = doc.name || doc.personal?.fullName || 'Untitled CV';

    await db
      .prepare(
        `INSERT INTO resumes (id, title, data, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           data = excluded.data,
           updated_at = excluded.updated_at`
      )
      .bind(doc.id, title, JSON.stringify(doc), updatedAt)
      .run();

    return new Response(
      JSON.stringify({
        ok: true,
        d1Connected: true,
        id: doc.id,
        updatedAt,
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
    await ensureTable(db);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: '삭제할 id 파라미터가 필요합니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await db.prepare('DELETE FROM resumes WHERE id = ?').bind(id).run();
    return new Response(
      JSON.stringify({ ok: true, d1Connected: true, deletedId: id }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
