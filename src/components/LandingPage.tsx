import React from 'react';
import {
  ArrowRight,
  Type,
  Layers,
  Database,
  Download,
  Sparkles,
  Check,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

interface LandingPageProps {
  onOpenGoogleLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenGoogleLogin }) => {
  const fontShowcase = [
    {
      category: 'SANS-SERIF · 본문 고딕',
      name: '프리텐다드 · 원티드 산스 · 수트(SUIT) · 스포카 한 산스',
      sample: '데이터와 사용자 경험으로 비즈니스 임팩트를 증명합니다.',
      family: "'Pretendard', sans-serif",
    },
    {
      category: 'SERIF · 에디토리얼 & 학술 명조',
      name: '마루부리 · 리디바탕 · 코펍월드바탕 · 본명조 · 함렛',
      sample: '깊이 있는 연구와 정교한 문장으로 커리어의 격을 높입니다.',
      family: "'MaruBuri', 'Noto Serif KR', serif",
    },
    {
      category: 'DISPLAY & MONO · 타이틀 & 엔지니어링',
      name: '페이퍼로지 · 지마켓 산스 · D2Coding · JetBrains Mono',
      sample: 'Zero-downtime Architecture · LCP 48% 단축 (SLA 99.99%)',
      family: "'Paperlogy', 'Pretendard', sans-serif",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* 미니멀 상단 네비게이션 */}
      <header className="sticky top-0 z-30 bg-[#fafafa]/85 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white font-black text-sm flex items-center justify-center tracking-tighter">
              M
            </div>
            <span className="font-extrabold text-lg tracking-tight text-zinc-950">MaxCV</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 ml-1">
              2.0 Studio
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#typography"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors hidden sm:inline"
            >
              타이포그래피
            </a>
            <a
              href="#architecture"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors hidden sm:inline"
            >
              핵심 기능
            </a>
            <button
              type="button"
              onClick={onOpenGoogleLogin}
              className="px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Google로 시작하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-2xs text-xs font-medium text-zinc-600 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>한국어 웹폰트 20종 · 정밀 A4 조판 · Google 계정별 클라우드 동기화</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]"
            style={{ wordBreak: 'keep-all' }}
          >
            가장 정교한 한국어 타이포그래피로
            <br />
            완성하는 프로페셔널 이력서.
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed font-normal"
            style={{ wordBreak: 'keep-all' }}
          >
            프리텐다드부터 마루부리, 리디바탕, 코펍월드바탕까지.
            자간·행간·여백을 0.01 단위로 제어하고, Google 계정 단위로 안전하게 보관하며
            고화질 A4 PDF로 즉시 내보내세요.
          </p>

          {/* 메인 CTA 버튼 영역 */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onOpenGoogleLogin}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm shadow-xl shadow-zinc-950/10 flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              </div>
              <span>Google 계정으로 계속하기</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-700" />
              별도 설치 없는 웹 스튜디오
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-700" />
              구글 계정별 D1 데이터베이스 격리 보관
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-700" />
              즉시 A4 PDF 파일 다운로드
            </span>
          </div>
        </section>

        {/* 미니멀 인터페이스 프리뷰 목업 */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-2xl shadow-zinc-900/5 overflow-hidden">
            {/* 브라우저 상단 바 */}
            <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              </div>
              <div className="text-[11px] font-mono text-zinc-400">maxcv.pages.dev — Workspace</div>
              <div className="text-[11px] font-semibold text-zinc-500">A4 210 × 297 mm</div>
            </div>

            {/* 프리뷰 내부 2단 미니멀 쇼케이스 */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80">
              {/* 좌측 컨트롤 요약 */}
              <div className="md:col-span-5 p-6 sm:p-8 bg-zinc-50/40 space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    TYPOGRAPHY & LAYOUT ENGINE
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 mt-1">
                    직무와 인상에 맞춘 세밀한 조판 제어
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {fontShowcase.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs"
                    >
                      <div className="text-[10px] font-bold text-zinc-400 tracking-wider">
                        {item.category}
                      </div>
                      <div className="text-xs font-semibold text-zinc-600 mt-0.5">{item.name}</div>
                      <div
                        className="mt-2 pt-2 border-t border-zinc-100 text-xs text-zinc-900"
                        style={{ fontFamily: item.family }}
                      >
                        “{item.sample}”
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 우측 A4 시트 미니멀 프리뷰 */}
              <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="pb-5 border-b-2 border-zinc-900 flex items-baseline justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                        김민준 (Minjun Kim)
                      </h2>
                      <p className="text-xs font-semibold text-zinc-500 mt-1">
                        Senior Product Engineer · Frontend Architect
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-zinc-400 font-mono">
                      minjun.kim@maxcv.dev
                      <br />
                      Seoul, Republic of Korea
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        PROFESSIONAL EXPERIENCE
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-zinc-900">
                          네오핀테크 (NeoFintech Corp.)
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">2023.03 – 현재</span>
                      </div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">
                        Senior Frontend Engineer · Design System Lead
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-zinc-600 leading-relaxed">
                        <li>• MAU 680만 명 규모 웹 애플리케이션 아키텍처 모더나이제이션 리드</li>
                        <li>• 한글 다국어 타이포그래피 토큰 및 고해상도 문서 렌더링 파이프라인 구축</li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        SELECTED PUBLICATIONS & PROJECTS
                      </div>
                      <div
                        className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-800 leading-relaxed"
                        style={{ fontFamily: "'MaruBuri', serif" }}
                      >
                        <strong className="block text-zinc-950 mb-0.5">
                          학술 명조 조판 모드 (마루부리 · 코펍월드바탕)
                        </strong>
                        단 한 번의 클릭으로 IT·비즈니스 고딕 스타일에서 학술 논문 및 임원용 정통 명조 스타일로 전환할 수 있습니다.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    로그인 즉시 모든 템플릿과 폰트를 사용할 수 있습니다.
                  </span>
                  <button
                    type="button"
                    onClick={onOpenGoogleLogin}
                    className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>내 이력서 만들기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 유니콘 스타트업 감성의 Bento Grid 아키텍처 섹션 */}
        <section id="architecture" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              BUILT FOR PERFECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-2 tracking-tight">
              이력서 작성의 모든 디테일을 하나로.
            </h2>
          </div>

          <div id="typography" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">20종 한국어 무료 웹폰트</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                프리텐다드, 원티드 산스, 수트, 스포카 한 산스 등 현대 고딕부터 마루부리, 리디바탕, 코펍월드바탕, 본명조 등 정통 명조체까지 완벽 지원합니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">밀리미터 단위 레이아웃 조판</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                1단 표준형과 2단 좌·우 사이드바 구조, 컬럼 비율, 상하좌우 여백(mm), 섹션 간격, 한글 어절 끊김 방지를 실시간으로 조절합니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">15개 전문 커리어 섹션</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                경력, 학력, 프로젝트, 보유 기술, 어학, 자격증, 수상, 논문·출판, 대외활동, 추천인, 커스텀 섹션까지 모든 이력서 구성을 담았습니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3 md:col-span-2">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">
                Google 계정 기준 Cloudflare D1 클라우드 동기화
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                로그인한 Google 이메일 계정별로 이력서 데이터가 Cloudflare D1 SQLite 데이터베이스에 독립적으로 분리 저장됩니다. 여러 대의 기기에서 접속해도 내 계정의 이력서 보관함을 그대로 이어서 편집할 수 있습니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">즉시 PDF 다운로드 & 백업</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                원클릭 `.pdf` 파일 즉시 다운로드, 클린 벡터 PDF 인쇄, `.maxcv.json` 데이터 백업 및 공유 링크 생성을 제공합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 미니멀 푸터 */}
      <footer className="border-t border-zinc-200/80 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">MaxCV</span>
            <span>·</span>
            <span>Korean Typography Resume Studio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Powered by Cloudflare Pages & D1 SQLite</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
