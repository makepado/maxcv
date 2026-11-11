import React, { useEffect, useState } from 'react';
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
  UserCheck,
} from 'lucide-react';
import { useCVStore } from './store/useCVStore';
import { ContentEditorPanel } from './components/ContentEditorPanel';
import { FontStudioPanel } from './components/FontStudioPanel';
import { CustomizePanel } from './components/CustomizePanel';
import { ExportAndCloudPanel } from './components/ExportAndCloudPanel';
import { CVPreviewCanvas } from './components/CVPreviewCanvas';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { SAMPLE_CVS } from './constants/defaultCv';
import { GoogleUserProfile } from './types/cv';
import { downloadResumePdfFile, printVectorPdfClean } from './utils/pdfExport';

export function App() {
  const currentUser = useCVStore((s) => s.currentUser);
  const documents = useCVStore((s) => s.documents);
  const activeDocId = useCVStore((s) => s.activeDocId);
  const activeTab = useCVStore((s) => s.activeTab);
  const previewZoom = useCVStore((s) => s.previewZoom);

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
  const [quickSaved, setQuickSaved] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

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
          // 해당 구글 계정에 처음 로그인한 경우 현재 작성 중인 이력서를 해당 계정의 D1에 저장
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* 상단 글로벌 네비게이션 바 (인쇄 시 숨김) */}
      <header className="no-print sticky top-0 z-30 h-15 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
        {/* 브랜드 로고 & 현재 문서 이름 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-base flex items-center justify-center shadow-sm shadow-indigo-500/30">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  MaxCV
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  KR Font Edition
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Google 계정별 Cloudflare D1 클라우드 이력서
              </p>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          {/* 현재 이력서 제목 인라인 수정 & 이력서 목록 열기 */}
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              value={activeDoc.name}
              onChange={(e) => renameDocument(activeDoc.id, e.target.value)}
              className="text-sm font-bold text-slate-800 bg-slate-100/80 hover:bg-slate-100 focus:bg-white px-2.5 py-1.5 rounded-lg border border-transparent focus:border-indigo-500 outline-none truncate max-w-[160px] sm:max-w-[230px]"
              title="클릭하여 이력서 제목 변경"
            />
            <button
              type="button"
              onClick={() => setShowDocDrawer(!showDocDrawer)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 shrink-0"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">내 이력서 ({documents.length})</span>
            </button>
          </div>
        </div>

        {/* 중앙 메인 탭 전환 */}
        <nav className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {[
            { id: 'content', label: '1. 콘텐츠 편집', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'fonts', label: '2. 한국어 폰트 (20종)', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'customize', label: '3. 레이아웃·디자인', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'export', label: '4. PDF·D1 저장', icon: <Download className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* 우측: Google 계정 로그인 상태 버튼 + D1 저장 + PDF 다운로드 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Google 로그인 / 계정 배지 버튼 */}
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
              currentUser
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/80'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs'
            }`}
            title={
              currentUser
                ? `현재 로그인: ${currentUser.email} (클릭하여 계정 전환/로그아웃)`
                : 'Google 계정으로 로그인하여 계정별 이력서 저장'
            }
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
            <span className="truncate max-w-[130px]">
              {currentUser ? currentUser.name : 'Google 로그인'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleQuickSaveD1}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all"
            title={
              currentUser
                ? `${currentUser.email} 계정의 Cloudflare D1에 즉시 저장`
                : 'Google 로그인 후 D1에 저장'
            }
          >
            {quickSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">D1 저장됨</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">계정 저장</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={pdfDownloading}
            onClick={async () => {
              setPdfDownloading(true);
              try {
                await downloadResumePdfFile(activeDoc);
              } catch {
                printVectorPdfClean(activeDoc);
              } finally {
                setPdfDownloading(false);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            title="클릭 시 즉시 .pdf 파일로 다운로드합니다"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{pdfDownloading ? 'PDF 생성중...' : 'PDF 다운로드'}</span>
          </button>

          <button
            type="button"
            onClick={() => printVectorPdfClean(activeDoc)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold hidden sm:flex items-center justify-center"
            title="브라우저 벡터 PDF 인쇄창 열기"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 모바일/태블릿용 보조 탭 바 */}
      <div className="no-print xl:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {[
            { id: 'content', label: '콘텐츠', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'fonts', label: '한국어 폰트', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'customize', label: '디자인', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'export', label: 'PDF·D1', icon: <Download className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setMobileView('editor');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ${
                activeTab === tab.id && mobileView === 'editor'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMobileView(mobileView === 'editor' ? 'preview' : 'editor')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shrink-0 lg:hidden"
        >
          {mobileView === 'editor' ? '미리보기 보기' : '편집기로 돌아가기'}
        </button>
      </div>

      {/* Google 로그인 모달 */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          syncUserAccountResumes(user);
        }}
      />

      {/* 다중 이력서 관리 드로어 모달 (My Resumes) */}
      {showDocDrawer && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {currentUser
                    ? `${currentUser.name} (${currentUser.email}) 님의 이력서 보관함`
                    : '내 이력서 보관함 (로컬 워크스페이스)'}
                </h2>
                <p className="text-xs text-slate-500">
                  직무별·언어별로 여러 개의 이력서를 만들고 구글 계정 단위로 D1에 동기화하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocDrawer(false)}
                className="text-sm text-slate-400 hover:text-slate-700 font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {!currentUser && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                <span className="text-indigo-900 font-medium">
                  구글 계정으로 로그인하면 계정별로 이력서가 D1 데이터베이스에 자동 분류됩니다.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowDocDrawer(false);
                    setShowAuthModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold shrink-0 flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Google 로그인
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  createNewDocument();
                  setShowDocDrawer(false);
                }}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>빈 이력서 새로 만들기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  createNewDocument(SAMPLE_CVS[0]);
                  setShowDocDrawer(false);
                }}
                className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>IT·개발자 샘플 불러오기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  createNewDocument(SAMPLE_CVS[1]);
                  setShowDocDrawer(false);
                }}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>학술·명조 샘플 불러오기</span>
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {documents.map((item) => {
                const isCurrent = item.id === activeDoc.id;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => {
                        selectDocument(item.id);
                        setShowDocDrawer(false);
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                            현재 편집중
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.personal.fullName} · {item.personal.jobTitle} · 섹션{' '}
                        {item.sections.length}개
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-3">
                      <button
                        type="button"
                        onClick={() => duplicateDocument(item.id)}
                        className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-white"
                        title="이력서 복제"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteDocument(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="이력서 삭제"
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

      {/* 메인 좌우 분할 워크스페이스 */}
      <div className="print-workspace-wrapper flex-1 flex overflow-hidden">
        {/* 좌측 에디터 패널 (인쇄 시 완전히 숨김) */}
        <div
          className={`no-print w-full lg:w-[48%] xl:w-[45%] h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 border-r border-slate-200 bg-slate-50/70 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="max-w-2xl mx-auto">
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
          className={`print-container flex-1 h-[calc(100vh-60px)] overflow-auto bg-slate-200/80 relative flex flex-col items-center py-8 px-4 ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 상단 플로팅 줌 컨트롤러 */}
          <div className="no-print sticky top-0 z-20 mb-4 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-lg text-xs">
            <button
              type="button"
              onClick={() => setPreviewZoom(previewZoom - 0.08)}
              className="p-1 hover:text-indigo-300"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-semibold w-12 text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setPreviewZoom(previewZoom + 0.08)}
              className="p-1 hover:text-indigo-300"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewZoom(0.92)}
              className="p-1 hover:text-indigo-300 ml-1 border-l border-white/20 pl-2 flex items-center gap-1"
              title="기본 배율 복원"
            >
              <RotateCcw className="w-3 h-3" />
              <span>맞춤</span>
            </button>
          </div>

          <div
            className="print-container origin-top transition-transform duration-150"
            style={{
              transform: `scale(${previewZoom})`,
            }}
          >
            <CVPreviewCanvas doc={activeDoc} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
