import React, { useState } from 'react';
import {
  Printer,
  Download,
  Upload,
  Share2,
  FileCode2,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { CVDocument } from '../types/cv';
import { downloadResumePdfFile, printVectorPdfClean } from '../utils/pdfExport';

interface ExportAndCloudPanelProps {
  onOpenAuthModal?: () => void;
}

export const ExportAndCloudPanel: React.FC<ExportAndCloudPanelProps> = () => {
  const currentUser = useCVStore((s) => s.currentUser);
  const doc = useCVStore((s) => s.getActiveDocument());
  const importDocumentJson = useCVStore((s) => s.importDocumentJson);

  const [statusMsg, setStatusMsg] = useState<string>('');
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

  const handleDirectDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      await downloadResumePdfFile(doc);
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
          setStatusMsg(`'${parsed.name}' 파일을 불러왔습니다.`);
        } else {
          setStatusMsg('유효한 JSON 파일 형식이 아닙니다.');
        }
      } catch {
        setStatusMsg('JSON 파일을 읽는 데 실패했습니다.');
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
        useCVStore.getState().commitDraftToLibrary();
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
      {/* 1. PDF 인쇄 및 공유 */}
      <div className="bg-zinc-950 text-white rounded-2xl p-5 shadow-md space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full">
            PDF Export
          </span>
          <h3 className="text-lg font-bold mt-2">PDF 인쇄 및 공유</h3>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
            링크와 텍스트가 살아있는 PDF로 깔끔하게 인쇄하고, 웹 링크로 바로 공유해 보세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleVectorPrintPdf}
            className="flex-1 min-w-[170px] py-3 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>벡터 인쇄 (PDF 저장)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{shareCopied ? '링크 복사됨' : '공유 링크'}</span>
          </button>
        </div>
      </div>

      {/* 2. 파일 백업 및 복원 칸 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-zinc-900">파일 백업 및 복원</h3>

        {statusMsg && (
          <div className="p-2.5 rounded-xl bg-zinc-100 text-xs font-medium text-zinc-800">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-zinc-800" />
            <span>JSON 다운로드</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-zinc-800" />
            <span>JSON 불러오기</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleExportHtmlSnapshot}
            className="py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center justify-center gap-1.5"
          >
            <FileCode2 className="w-4 h-4 text-zinc-800" />
            <span>HTML 파일 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};
