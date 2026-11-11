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
  UserCheck,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { CVDocument } from '../types/cv';
import { downloadResumePdfFile, printVectorPdfClean } from '../utils/pdfExport';

interface ExportAndCloudPanelProps {
  onOpenAuthModal?: () => void;
}

export const ExportAndCloudPanel: React.FC<ExportAndCloudPanelProps> = ({ onOpenAuthModal }) => {
  const currentUser = useCVStore((s) => s.currentUser);
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
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

  const fetchCloudResumes = async () => {
    if (!currentUser?.email) {
      setCloudDocs([]);
      return;
    }
    setCloudStatus('loading');
    try {
      const res = await fetch(
        `/api/resumes?email=${encodeURIComponent(currentUser.email)}`,
        {
          headers: { 'X-Google-Email': currentUser.email },
        }
      );
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
  }, [currentUser?.email]);

  const handleSaveCurrentToD1 = async () => {
    if (!currentUser?.email) {
      setStatusMsg('⚠️ 구글 로그인 후 해당 계정으로 D1 데이터베이스에 저장할 수 있습니다.');
      onOpenAuthModal?.();
      return;
    }
    setStatusMsg(`Cloudflare D1 (${currentUser.email}) 계정에 저장 중...`);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Google-Email': currentUser.email,
        },
        body: JSON.stringify({
          user: currentUser,
          resume: doc,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setStatusMsg(`✅ 구글 계정(${currentUser.email})으로 '${doc.name}' D1 저장 완료!`);
        fetchCloudResumes();
      } else {
        setStatusMsg(`⚠️ ${data?.error || 'D1 바인딩을 확인해주세요.'}`);
      }
    } catch (e: any) {
      setStatusMsg(`⚠️ 네트워크 오류 또는 로컬 개발 환경입니다: ${e?.message || ''}`);
    }
  };

  const handleSyncAllToD1 = async () => {
    if (!currentUser?.email) {
      setStatusMsg('⚠️ 먼저 구글 로그인을 진행해주세요.');
      onOpenAuthModal?.();
      return;
    }
    setStatusMsg(`모든 이력서를 ${currentUser.email} 계정의 Cloudflare D1에 동기화 중...`);
    try {
      for (const item of documents) {
        await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Google-Email': currentUser.email,
          },
          body: JSON.stringify({
            user: currentUser,
            resume: item,
          }),
        });
      }
      setStatusMsg(
        `✅ 총 ${documents.length}개의 이력서를 ${currentUser.email} 계정(hongjaed1db)에 동기화했습니다!`
      );
      fetchCloudResumes();
    } catch {
      setStatusMsg('⚠️ 동기화 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFromD1 = async (id: string) => {
    if (!currentUser?.email) return;
    try {
      await fetch(
        `/api/resumes?id=${encodeURIComponent(id)}&email=${encodeURIComponent(currentUser.email)}`,
        {
          method: 'DELETE',
          headers: { 'X-Google-Email': currentUser.email },
        }
      );
      fetchCloudResumes();
      setStatusMsg('🗑️ 내 구글 계정의 D1 보관함에서 선택한 이력서를 삭제했습니다.');
    } catch {
      // ignore
    }
  };

  const handleDirectDownloadPdf = async () => {
    setPdfGenerating(true);
    setStatusMsg('📄 고해상도 A4 PDF 파일을 생성하여 다운로드하고 있습니다...');
    try {
      await downloadResumePdfFile(doc);
      setStatusMsg('✅ PDF 파일 다운로드가 완료되었습니다!');
    } catch {
      printVectorPdfClean(doc);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleVectorPrintPdf = () => {
    printVectorPdfClean(doc);
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
      if (currentUser?.email) {
        await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Google-Email': currentUser.email,
          },
          body: JSON.stringify({ user: currentUser, resume: doc }),
        }).catch(() => {});
      }

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
      {/* 1. 즉시 PDF 파일 다운로드 & 클린 벡터 인쇄 */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Direct PDF Download & Vector Print
            </span>
            <h3 className="text-lg font-bold mt-2">고화질 A4 PDF 즉시 다운로드</h3>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              <strong>[PDF 파일 즉시 다운로드]</strong>를 누르면 인쇄창 없이 곧바로 <code>.pdf</code> 파일로 저장됩니다.
              텍스트 드래그가 필요한 경우 <strong>[벡터 인쇄 (PDF 저장)]</strong>을 선택하세요.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            type="button"
            disabled={pdfGenerating}
            onClick={handleDirectDownloadPdf}
            className="flex-1 min-w-[190px] py-3 px-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-60 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{pdfGenerating ? 'PDF 파일 생성 중...' : 'PDF 파일 즉시 다운로드 (.pdf)'}</span>
          </button>

          <button
            type="button"
            onClick={handleVectorPrintPdf}
            className="py-3 px-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-950 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>벡터 인쇄 (PDF 저장)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="py-3 px-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-950 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{shareCopied ? '공유 링크 복사됨!' : '공유 링크 복사'}</span>
          </button>
        </div>
      </div>

      {/* 2. 구글 로그인 계정 기준 Cloudflare D1 클라우드 DB 동기화 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Google 계정별 Cloudflare D1 데이터베이스 (`hongjaed1db`)
              </h3>
              <p className="text-[11px] text-slate-500">
                로그인한 구글 이메일(`user_email`)을 기준으로 계정별 이력서를 분리하여 저장·관리합니다.
              </p>
            </div>
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              currentUser && cloudStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {currentUser ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {currentUser.email} 연동중
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                구글 로그인 필요
              </>
            )}
          </span>
        </div>

        {/* 미로그인 시 구글 로그인 안내 배너 */}
        {!currentUser ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900 block mb-0.5">
                현재 비로그인(로컬 브라우저 저장) 상태입니다.
              </strong>
              Google 계정으로 로그인하면 내 계정에 귀속된 이력서만 안전하게 D1 DB에 저장하고 어디서든 불러올 수 있습니다.
            </div>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Google 로그인하기</span>
            </button>
          </div>
        ) : (
          <>
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
                <span>현재 이력서 내 계정에 저장</span>
              </button>

              <button
                type="button"
                onClick={handleSyncAllToD1}
                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <CloudDownload className="w-4 h-4" />
                <span>내 모든 이력서 D1 동기화</span>
              </button>

              <button
                type="button"
                onClick={fetchCloudResumes}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>내 계정 D1 목록 새로고침</span>
              </button>
            </div>

            {/* 내 구글 계정에 저장된 D1 이력서 리스트 */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-600">
                `{currentUser.email}` 계정에 저장된 D1 이력서 ({cloudDocs.length}개)
              </div>

              {cloudDocs.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  아직 `{currentUser.email}` 계정에 저장된 D1 이력서가 없습니다. [현재 이력서 내 계정에 저장] 버튼을 눌러보세요.
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
          </>
        )}
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
