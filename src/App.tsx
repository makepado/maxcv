import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Type,
  Sliders,
  Download,
  Plus,
  Copy,
  Trash2,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FolderOpen,
  CloudUpload,
  Sparkles,
  Check,
  LogOut,
  Eye,
  PenLine,
  Menu,
  X,
  Home,
  Briefcase,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useCVStore } from './store/useCVStore';
import { ContentEditorPanel } from './components/ContentEditorPanel';
import { FontStudioPanel } from './components/FontStudioPanel';
import { CustomizePanel } from './components/CustomizePanel';
import { ExportAndCloudPanel } from './components/ExportAndCloudPanel';
import { CVPreviewCanvas } from './components/CVPreviewCanvas';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { LandingPage } from './components/LandingPage';
import { LoggedInHomeDashboard } from './components/LoggedInHomeDashboard';
import { CreateDocumentModal } from './components/CreateDocumentModal';
import { SAMPLE_CVS } from './constants/defaultCv';
import { createBlankCareerDoc, SAMPLE_CAREERS } from './constants/careerSamples';
import { GoogleUserProfile } from './types/cv';
import { printVectorPdfClean } from './utils/pdfExport';

export function App() {
  const currentUser = useCVStore((s) => s.currentUser);
  const documents = useCVStore((s) => s.documents);
  const activeDocId = useCVStore((s) => s.activeDocId);
  const activeTab = useCVStore((s) => s.activeTab);
  const previewZoom = useCVStore((s) => s.previewZoom);
  const canUndo = useCVStore((s) => s.canUndo);
  const canRedo = useCVStore((s) => s.canRedo);
  const undo = useCVStore((s) => s.undo);
  const redo = useCVStore((s) => s.redo);

  const setCurrentUser = useCVStore((s) => s.setCurrentUser);
  const setActiveTab = useCVStore((s) => s.setActiveTab);
  const setPreviewZoom = useCVStore((s) => s.setPreviewZoom);
  const selectDocument = useCVStore((s) => s.selectDocument);
  const setDocuments = useCVStore((s) => s.setDocuments);
  const createNewDocument = useCVStore((s) => s.createNewDocument);
  const duplicateDocument = useCVStore((s) => s.duplicateDocument);
  const deleteDocument = useCVStore((s) => s.deleteDocument);
  const renameDocument = useCVStore((s) => s.renameDocument);
  const importDocumentJson = useCVStore((s) => s.importDocumentJson);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  const [showDocDrawer, setShowDocDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [quickSaved, setQuickSaved] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  // 로그인 후 대시보드 홈 vs 문서 에디터 화면 전환
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('editor');
  // 새 문서 선택 모달
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState<'resume' | 'career'>('resume');

  // 모바일/태블릿 화면 폭 감지 및 A4 용지 자동 배율(Auto-Fit) 계산
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [previewAreaWidth, setPreviewAreaWidth] = useState<number>(0);
  const [mobileCustomZoom, setMobileCustomZoom] = useState<number | null>(null);
  const [sheetNaturalHeight, setSheetNaturalHeight] = useState<number>(1123);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const isLetter = activeDoc.design.paperSize === 'LETTER';
  // 96 DPI 기준: 210mm ≈ 793.7px, 215.9mm ≈ 816px
  const sheetBaseWidthPx = isLetter ? 816 : 794;
  const sheetMinHeightPx = isLetter ? 1056 : 1123;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 키보드 단축키 (Ctrl+Z / Cmd+Z = 뒤로가기, Ctrl+Y / Cmd+Shift+Z = 다시실행)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (!isCmdOrCtrl) return;

      const target = e.target as HTMLElement | null;
      // 인풋 텍스트 필드 안에서 입력 중인 기본 브라우저 실행은 방해하지 않음
      const isInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          // Redo
          if (!isInput && canRedo) {
            e.preventDefault();
            redo();
          }
        } else {
          // Undo
          if (!isInput && canUndo) {
            e.preventDefault();
            undo();
          }
        }
      } else if (e.key.toLowerCase() === 'y') {
        // Redo on Windows
        if (!isInput && canRedo) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // 모바일 화면 크기 변경 시 수동 줌 초기화하여 화면 맞춤 유지
  useEffect(() => {
    if (windowWidth >= 1024) {
      setMobileCustomZoom(null);
      setShowMobileMenu(false);
    }
  }, [windowWidth]);

  // 미리보기 컨테이너 폭 및 실제 A4 시트 높이 감지
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (previewContainerRef.current) {
        const cw = previewContainerRef.current.clientWidth;
        if (cw > 0) setPreviewAreaWidth(cw);
      }
      const sheetEl = document.getElementById('maxcv-printable-sheet');
      if (sheetEl) {
        const h = sheetEl.scrollHeight || sheetEl.offsetHeight;
        if (h > 100) {
          setSheetNaturalHeight(Math.max(sheetMinHeightPx, h));
        }
      }
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    const sheetEl = document.getElementById('maxcv-printable-sheet');
    if (sheetEl) {
      observer.observe(sheetEl);
    }
    return () => observer.disconnect();
  }, [activeDoc, mobileView, sheetMinHeightPx]);

  const isMobileViewport = windowWidth < 1024;
  const baseAvailableWidth =
    previewAreaWidth > 0 ? previewAreaWidth : windowWidth;
  // 모바일 좌우 여백(24px)을 제외한 영역에 A4 시트가 정확히 들어오도록 배율 산출
  const availableMobileWidth = Math.max(260, baseAvailableWidth - 24);
  const autoFitMobileZoom = Number(
    Math.min(0.95, Math.max(0.32, availableMobileWidth / sheetBaseWidthPx)).toFixed(3)
  );
  const effectiveZoom = isMobileViewport
    ? mobileCustomZoom ?? autoFitMobileZoom
    : previewZoom;

  const handleZoomChange = (delta: number) => {
    if (isMobileViewport) {
      const next = Math.min(1.4, Math.max(0.3, Number((effectiveZoom + delta).toFixed(2))));
      setMobileCustomZoom(next);
    } else {
      setPreviewZoom(previewZoom + delta);
    }
  };

  const handleZoomReset = () => {
    if (isMobileViewport) {
      setMobileCustomZoom(null);
    } else {
      setPreviewZoom(0.92);
    }
  };

  // 구글 계정 로그인 시 해당 계정(user_email)의 D1 이력서 목록 자동 로드 또는 초기 동기화
  const syncUserAccountResumes = async (user: GoogleUserProfile) => {
    try {
      const res = await fetch(`/api/resumes?email=${encodeURIComponent(user.email)}`, {
        headers: { 'X-Google-Email': user.email },
      });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.resumes)) {
        if (data.resumes.length > 0) {
          setDocuments(data.resumes);
        } else {
          await fetch('/api/resumes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Google-Email': user.email,
            },
            body: JSON.stringify({
              user,
              resume: activeDoc,
            }),
          });
        }
      }
    } catch {
      // ignore offline
    }
  };

  // URL ?cv=ID 파라미터가 있으면 Cloudflare D1에서 자동 로드 시도
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCvId = params.get('cv');
    if (sharedCvId) {
      fetch(`/api/resumes?id=${encodeURIComponent(sharedCvId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.ok && data?.resume) {
            const exists = documents.some((d) => d.id === data.resume.id);
            if (exists) {
              selectDocument(data.resume.id);
            } else {
              importDocumentJson(data.resume);
            }
          }
        })
        .catch(() => {});
    } else if (currentUser?.email) {
      syncUserAccountResumes(currentUser);
    }
  }, []);

  const handleQuickSaveD1 = async () => {
    if (!currentUser?.email) {
      setShowAuthModal(true);
      return;
    }
    try {
      await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Google-Email': currentUser.email,
        },
        body: JSON.stringify({
          user: currentUser,
          resume: activeDoc,
        }),
      });
      setQuickSaved(true);
      setTimeout(() => setQuickSaved(false), 2500);
    } catch {
      setQuickSaved(true);
      setTimeout(() => setQuickSaved(false), 2500);
    }
  };

  // 비로그인 상태일 때는 유니콘 스타트업 감성의 미니멀 랜딩 페이지를 초기 화면으로 표시
  if (!currentUser) {
    return (
      <>
        <LandingPage
          onOpenGoogleLogin={() => setShowAuthModal(true)}
          onDirectLoginSuccess={(user) => {
            syncUserAccountResumes(user);
          }}
        />
        <GoogleAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            syncUserAccountResumes(user);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#fafafa] text-zinc-900">
      {/* 상단 글로벌 네비게이션 바 (인쇄 시 숨김) */}
      <header className="no-print sticky top-0 z-30 h-14 bg-white/95 backdrop-blur border-b border-zinc-200/90 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* 좌측: 홈 버튼 + 로고 + 현재 문서 제목 */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          {/* 홈화면(대시보드)으로 이동하는 홈 버튼 */}
          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              setShowMobileMenu(false);
            }}
            className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              currentView === 'home'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="홈 화면 (이력서/경력기술서 샘플 및 보관함 대시보드)"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('editor');
              setActiveTab('content');
              setMobileView('editor');
              setShowMobileMenu(false);
            }}
            className="flex items-center gap-2 shrink-0 group text-left cursor-pointer"
            title="에디터로 이동"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-950 group-hover:bg-zinc-800 text-white font-black text-sm flex items-center justify-center transition-colors">
              M
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-zinc-950 group-hover:text-zinc-700 transition-colors">
                MaxCV
              </span>
              <span className="hidden md:inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                Studio
              </span>
            </div>
          </button>

          <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block shrink-0" />

          {/* 현재 문서 제목 인라인 수정 & 데스크톱 새 문서 / 보관함 버튼 */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span
              className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                activeDoc.docType === 'career'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              {activeDoc.docType === 'career' ? '경력기술서' : '이력서'}
            </span>
            <input
              type="text"
              value={activeDoc.name}
              onChange={(e) => renameDocument(activeDoc.id, e.target.value)}
              className="text-xs sm:text-sm font-bold text-zinc-900 bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white px-2.5 py-1.5 rounded-lg border border-transparent focus:border-zinc-900 outline-none truncate w-0 flex-1 max-w-[170px] sm:max-w-[210px]"
              title="클릭하여 문서 제목 변경"
            />
            <button
              type="button"
              onClick={() => {
                setCreateModalType(activeDoc.docType === 'career' ? 'career' : 'resume');
                setShowCreateModal(true);
              }}
              className="hidden lg:flex px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              title="새 문서 (샘플 5종 / 빈 문서)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 문서</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDocDrawer(!showDocDrawer)}
              className="hidden lg:flex px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 items-center gap-1 shrink-0 cursor-pointer"
              title="문서 보관함 열기"
            >
              <FolderOpen className="w-3.5 h-3.5 text-zinc-700" />
              <span>보관함 ({documents.length})</span>
            </button>
          </div>
        </div>

        {/* 중앙 메인 탭 전환 (데스크톱 xl 이상) & 실행취소/다시실행 스택 버튼 */}
        <div className="hidden lg:flex items-center gap-2">
          {/* 실행취소 / 다시실행 스택 뒤로가기 버튼 */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/80">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-all ${
                canUndo
                  ? 'text-zinc-800 hover:bg-white hover:shadow-2xs cursor-pointer'
                  : 'text-zinc-300 cursor-not-allowed'
              }`}
              title="실행 취소 / 뒤로가기 (Ctrl+Z / ⌘Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-all ${
                canRedo
                  ? 'text-zinc-800 hover:bg-white hover:shadow-2xs cursor-pointer'
                  : 'text-zinc-300 cursor-not-allowed'
              }`}
              title="다시 실행 (Ctrl+Y / ⌘⇧Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <nav className="hidden xl:flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
            {[
              { id: 'content', label: '콘텐츠', icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'fonts', label: '한국어 폰트', icon: <Type className="w-3.5 h-3.5" /> },
              { id: 'customize', label: '디자인', icon: <Sliders className="w-3.5 h-3.5" /> },
              { id: 'export', label: '저장', icon: <Download className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 우측 (데스크톱 lg 이상): 계정 + 클라우드 저장 + 인쇄 + 로그아웃 */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-all"
            title={`현재 로그인 계정: ${currentUser.email}`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span className="truncate max-w-[120px]">{currentUser.name}</span>
          </button>

          <button
            type="button"
            onClick={handleQuickSaveD1}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center gap-1.5 transition-all"
            title={`${currentUser.email} 계정 클라우드에 현재 상태를 저장합니다`}
          >
            {quickSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">저장됨</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 text-zinc-700" />
                <span>클라우드 저장</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => printVectorPdfClean(activeDoc)}
            className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center transition-all shadow-xs"
            title="인쇄 / PDF로 저장하기"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentUser(null)}
            className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-500 text-xs font-bold flex items-center justify-center transition-colors"
            title="로그아웃 (랜딩페이지로 이동)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* 우측 (모바일/태블릿 lg 미만): 실행취소/뒤로가기 아이콘 + 미리보기 전환 버튼 + 햄버거 메뉴 버튼 */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-md transition-all ${
                canUndo ? 'text-zinc-800 hover:bg-white cursor-pointer' : 'text-zinc-300 cursor-not-allowed'
              }`}
              title="실행 취소 / 뒤로가기"
              aria-label="실행 취소"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-md transition-all ${
                canRedo ? 'text-zinc-800 hover:bg-white cursor-pointer' : 'text-zinc-300 cursor-not-allowed'
              }`}
              title="다시 실행"
              aria-label="다시 실행"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileView(mobileView === 'editor' ? 'preview' : 'editor');
              setShowMobileMenu(false);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            {mobileView === 'editor' ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">미리보기</span>
              </>
            ) : (
              <>
                <PenLine className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">편집하기</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 flex items-center justify-center"
            aria-label="메뉴 열기"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 드롭다운 시트 (lg 미만) */}
      {showMobileMenu && (
        <div
          className="no-print lg:hidden fixed inset-0 top-14 z-40 bg-zinc-950/30 backdrop-blur-2xs"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="bg-white border-b border-zinc-200 shadow-xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 로그인 계정 요약 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-zinc-500 truncate">{currentUser.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowAuthModal(true);
                }}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-[11px] font-semibold text-zinc-700 shrink-0"
              >
                계정 전환
              </button>
            </div>

            {/* 주요 메뉴 액션 그리드 */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('home');
                  setShowMobileMenu(false);
                }}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-zinc-900" />
                <span>홈 대시보드</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  setCreateModalType(activeDoc.docType === 'career' ? 'career' : 'resume');
                  setShowCreateModal(true);
                }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>새 문서 만들기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowDocDrawer(true);
                }}
                className="p-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-4 h-4 text-zinc-700" />
                <span>보관함 ({documents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleQuickSaveD1();
                }}
                className="p-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center justify-center gap-2"
              >
                {quickSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">저장됨</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4 text-zinc-700" />
                    <span>클라우드 저장</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  printVectorPdfClean(activeDoc);
                }}
                className="p-3 rounded-xl bg-zinc-950 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>PDF 인쇄 / 저장</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentUser(null);
                }}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-600 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모바일/태블릿용 에디터 4분할 탭 바 (미리보기 모드일 때는 숨겨서 화면을 미니멀하게 유지) */}
      <div
        className={`no-print xl:hidden bg-white border-b border-zinc-200 px-3 py-1.5 ${
          mobileView === 'preview' ? 'hidden lg:block' : 'block'
        }`}
      >
        <div className="grid grid-cols-4 gap-1 max-w-2xl mx-auto">
          {[
            { id: 'content', label: '콘텐츠', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'fonts', label: '폰트', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'customize', label: '디자인', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'export', label: '저장', icon: <Download className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileView('editor');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isTabActive
                    ? 'bg-zinc-950 text-white shadow-2xs'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Google 로그인 모달 */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          syncUserAccountResumes(user);
        }}
      />

      {/* 다중 이력서·경력기술서 관리 드로어 모달 (모바일 바텀시트 & 데스크톱 센터 모달 대응) */}
      {showDocDrawer && (
        <div
          className="no-print fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-xs flex items-end sm:items-start justify-center sm:pt-16 p-0 sm:px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDocDrawer(false);
          }}
        >
          <div className="bg-white rounded-t-3xl sm:rounded-2xl border border-zinc-200 shadow-2xl max-w-2xl w-full p-4 sm:p-5 space-y-4 max-h-[88dvh] flex flex-col">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-100 shrink-0">
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                  {currentUser.name} 님의 문서 보관함
                </h2>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {currentUser.email} · 이력서와 경력기술서를 각각 관리할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocDrawer(false)}
                className="text-sm text-zinc-400 hover:text-zinc-700 font-bold px-2 py-1 shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalType('resume');
                    setShowCreateModal(true);
                  }}
                  className="p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>새 이력서 만들기 (직군별 샘플 5종 / 빈 문서)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateModalType('career');
                    setShowCreateModal(true);
                  }}
                  className="p-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Briefcase className="w-4 h-4 text-indigo-300" />
                  <span>새 경력기술서 만들기 (직군별 샘플 5종 / 빈 문서)</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
              {documents.map((item) => {
                const isCurrent = item.id === activeDoc.id;
                const isCareer = item.docType === 'career';
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 hover:bg-zinc-50/60'
                    }`}
                  >
                    <div
                      onClick={() => {
                        selectDocument(item.id);
                        setShowDocDrawer(false);
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            isCareer
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-zinc-200/80 text-zinc-700'
                          }`}
                        >
                          {isCareer ? '경력기술서' : '이력서'}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white shrink-0">
                            편집중
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 truncate">
                        {item.personal.fullName} · {item.personal.jobTitle} · 섹션{' '}
                        {item.sections.length}개
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => duplicateDocument(item.id)}
                        className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-white"
                        title="문서 복제"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteDocument(item.id)}
                          className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="문서 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 뷰 모드에 따른 화면 렌더링: 홈 대시보드 vs 이력서/경력기술서 에디터 */}
      {currentView === 'home' ? (
        <LoggedInHomeDashboard
          currentUser={currentUser}
          onEnterEditor={(docId) => {
            if (docId) selectDocument(docId);
            setCurrentView('editor');
          }}
          onOpenCreateModal={(type) => {
            if (type) setCreateModalType(type);
            setShowCreateModal(true);
          }}
          onOpenDocDrawer={() => setShowDocDrawer(true)}
        />
      ) : (
        /* 메인 좌우 분할 워크스페이스 */
        <div className="print-workspace-wrapper flex-1 flex overflow-hidden w-full">
          {/* 좌측 에디터 패널 */}
          <div
            className={`editor-panel-container no-print w-full lg:w-[48%] xl:w-[45%] h-[calc(100dvh-105px)] xl:h-[calc(100dvh-56px)] overflow-y-auto overflow-x-hidden p-3 sm:p-6 pb-12 border-r border-zinc-200 bg-[#fafafa] ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="max-w-2xl mx-auto w-full">
              {activeTab === 'content' && <ContentEditorPanel />}
              {activeTab === 'fonts' && <FontStudioPanel />}
              {activeTab === 'customize' && <CustomizePanel />}
              {activeTab === 'export' && (
                <ExportAndCloudPanel onOpenAuthModal={() => setShowAuthModal(true)} />
              )}
            </div>
          </div>

          {/* 우측 실시간 A4 캔버스 미리보기 영역 */}
          <div
            ref={previewContainerRef}
            className={`print-container flex-1 w-full h-[calc(100dvh-56px)] lg:h-[calc(100dvh-105px)] xl:h-[calc(100dvh-56px)] overflow-auto bg-zinc-200/70 relative flex flex-col items-center py-3 sm:py-6 px-3 sm:px-4 pb-12 ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* 상단 줌 & 인쇄 바 (이력서 용지를 가리지 않도록 깔끔하게 상단 배치) */}
            <div className="no-print mb-3 flex items-center justify-between gap-2 bg-zinc-950/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-md text-xs shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleZoomChange(-0.08)}
                  className="p-1 hover:text-zinc-300"
                  title="축소"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-semibold w-11 text-center">
                  {Math.round(effectiveZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => handleZoomChange(0.08)}
                  className="p-1 hover:text-zinc-300"
                  title="확대"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  className="p-1 hover:text-zinc-300 ml-1 border-l border-white/20 pl-2 flex items-center gap-1"
                  title="화면 폭에 맞춤"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>맞춤</span>
                </button>
              </div>
            </div>

            {/* 스케일된 A4 시트의 실제 레이아웃 크기를 잡아주는 래퍼 (모바일 좌우 잘림 및 하단 빈 여백 완벽 제거) */}
            <div
              className="print-container relative mx-auto shrink-0"
              style={{
                width: `${Math.round(sheetBaseWidthPx * effectiveZoom)}px`,
                height: `${Math.round(sheetNaturalHeight * effectiveZoom)}px`,
              }}
            >
              <div
                className="print-container origin-top-left transition-transform duration-150"
                style={{
                  width: `${sheetBaseWidthPx}px`,
                  transform: `scale(${effectiveZoom})`,
                }}
              >
                <CVPreviewCanvas doc={activeDoc} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새 문서 선택 모달 (직군별 샘플 5종 / 빈 문서) */}
      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialType={createModalType}
        onSelectDocument={(doc, nameOverride) => {
          createNewDocument(doc, nameOverride);
          setCurrentView('editor');
          setShowDocDrawer(false);
        }}
      />
    </div>
  );
}

export default App;


