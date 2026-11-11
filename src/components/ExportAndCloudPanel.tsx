import React, { useEffect, useState } from 'react';
import {
  Printer,
  Download,
  Upload,
  Database,
  CloudUpload,
  CloudDownload,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { CVDocument } from '../types/cv';

export const ExportAndCloudPanel: React.FC = () => {
  const doc = useCVStore((s) => s.getActiveDocument());
  const documents = useCVStore((s) => s.documents);
  const importDocumentJson = useCVStore((s) => s.importDocumentJson);
  const selectDocument = useCVStore((s) => s.selectDocument);

  const [cloudStatus, setCloudStatus] = useState<'idle' | 'loading' | 'connected' | 'local-only'>(
    'idle'
  );
  const [cloudDocs, setCloudDocs] = useState<CVDocument[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const fetchCloudResumes = async () => {
    setCloudStatus('loading');
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      if (data && data.d1Connected) {
        setCloudStatus('connected');
        setCloudDocs(data.resumes || []);
      } else {
        setCloudStatus('local-only');
      }
    } catch {
      setCloudStatus('local-only');
    }
  };

  useEffect(() => {
    fetchCloudResumes();
  }, []);

  const handleSaveCurrentToD1 = async () => {
    setStatusMsg('Cloudflare D1 (hongjae1db)에 저장 중...');
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: doc }),
      });
      const data = await res.json();
      if (data?.ok) {
        setStatusMsg(`✅ D1 데이터베이스에 '${doc.name}' 저장 완료!`);
        fetchCloudResumes();
      } else {
        setStatusMsg(`⚠️ ${data?.error || 'D1 바인딩을 확인해주세요.'}`);
      }
    } catch (e: any) {
      setStatusMsg(`⚠️ 네트워크 또는 로컬 개발 환경입니다: ${e?.message || ''}`);
    }
  };

  const handleSyncAllToD1 = async () => {
    setStatusMsg('모든 로컬 이력서를 Cloudflare D1에 동기화 중...');
    try {
      for (const item of documents) {
        await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume: item }),
        });
      }
      setStatusMsg(`✅ 총 ${documents.length}개의 이력서를 D1(hongjae1db)에 동기화했습니다!`);
      fetchCloudResumes();
    } catch {
      setStatusMsg('⚠️ 동기화 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFromD1 = async (id: string) => {
    try {
      await fetch(`/api/resumes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      fetchCloudResumes();
      setStatusMsg('🗑️ D1에서 선택한 이력서를 삭제했습니다.');
    } catch {
      // ignore
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (doc.name || 'maxcv-resume').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
    a.href = url;
    a.download = `${safeName}.maxcv.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CVDocument;
        if (parsed && parsed.personal && Array.isArray(parsed.sections)) {
          importDocumentJson(parsed);
          setStatusMsg(`✅ '${parsed.name}' JSON 파일을 성공적으로 불러왔습니다!`);
        } else {
          setStatusMsg('⚠️ 올바른 MaxCV JSON 파일 형식이 아닙니다.');
        }
      } catch {
        setStatusMsg('⚠️ JSON 파싱에 실패했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportHtmlSnapshot = () => {
    const sheetEl = document.getElementById('maxcv-printable-sheet');
    if (!sheetEl) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${doc.personal.fullName || doc.name} - MaxCV</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<link rel="stylesheet" href="https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css" />
</head>
<body class="bg-slate-100 py-10">
${sheetEl.outerHTML}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.personal.fullName || 'resume').replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyShareLink = async () => {
    try {
      // D1에 먼저 저장 시도 후 ?cv=ID 형태의 공유 링크 생성
      await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: doc }),
      }).catch(() => {});

      const shareUrl = `${window.location.origin}/?cv=${encodeURIComponent(doc.id)}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* 1. 고해상도 벡터 PDF 인쇄 및 내보내기 */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Vector PDF Export
            </span>
            <h3 className="text-lg font-bold mt-2">고화질 A4 벡터 PDF로 내보내기</h3>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              텍스트 드래그·복사 및 포트폴리오 링크 클릭이 완벽히 작동하는 진짜 벡터 PDF로 출력합니다.
              인쇄 대화상자에서 <strong>[대상: PDF로 저장]</strong> 및 <strong>[배경 그래픽 켜기]</strong>를 선택하세요.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex-1 min-w-[180px] py-3 px-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>PDF 다운로드 / 인쇄하기</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="py-3 px-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-950 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{shareCopied ? '공유 링크 복사됨!' : 'D1 클라우드 공유 링크 복사'}</span>
          </button>
        </div>
      </div>

      {/* 2. Cloudflare D1 (hongjae1db) 클라우드 DB 동기화 섹션 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Cloudflare D1 SQLite 데이터베이스 연동 (hongjae1db)
              </h3>
              <p className="text-[11px] text-slate-500">
                브라우저 저장소뿐만 아니라 Cloudflare D1 서버리스 SQLite DB에 영구 보관합니다.
              </p>
            </div>
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              cloudStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {cloudStatus === 'connected' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                D1 연결됨
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                로컬 + D1 준비됨
              </>
            )}
          </span>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-900">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleSaveCurrentToD1}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <CloudUpload className="w-4 h-4" />
            <span>현재 이력서 D1에 저장</span>
          </button>

          <button
            type="button"
            onClick={handleSyncAllToD1}
            className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <CloudDownload className="w-4 h-4" />
            <span>전체 이력서 D1 일괄 동기화</span>
          </button>

          <button
            type="button"
            onClick={fetchCloudResumes}
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>D1 저장 목록 새로고침</span>
          </button>
        </div>

        {/* D1에 저장된 원격 이력서 리스트 */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-600">
            Cloudflare D1 (`hongjae1db`)에 저장된 이력서 ({cloudDocs.length}개)
          </div>

          {cloudDocs.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              아직 D1에서 조회된 이력서가 없거나 로컬 프리뷰 상태입니다. 상단 [현재 이력서 D1에 저장]을 눌러보세요.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cloudDocs.map((cDoc) => (
                <div
                  key={cDoc.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 truncate">{cDoc.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {cDoc.personal?.fullName} · 최근 저장:{' '}
                      {new Date(cDoc.updatedAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => {
                        const exists = documents.some((d) => d.id === cDoc.id);
                        if (exists) {
                          selectDocument(cDoc.id);
                        } else {
                          importDocumentJson(cDoc);
                        }
                        setStatusMsg(`✅ D1에서 '${cDoc.name}' 이력서를 불러왔습니다.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                    >
                      불러오기
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFromD1(cDoc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="D1에서 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. JSON 백업 / 복원 & HTML 스냅샷 다운로드 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          파일 백업 및 복원 (.maxcv.json / 독립형 HTML)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>JSON 데이터 다운로드</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>JSON 파일 불러오기</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleExportHtmlSnapshot}
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
          >
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            <span>단독 HTML 파일 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};
