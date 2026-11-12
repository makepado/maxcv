import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Plus,
  Sparkles,
  ArrowRight,
  FolderOpen,
  CloudUpload,
  Calendar,
  Layers,
  ChevronRight,
  Code,
  LayoutGrid,
  Palette,
  TrendingUp,
  LineChart,
  Server,
  Database,
  Compass,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { CVDocument, GoogleUserProfile } from '../types/cv';
import { RESUME_JOB_SAMPLES } from '../constants/resumeJobSamples';
import { CAREER_JOB_SAMPLES } from '../constants/careerJobSamples';
import { createBlankCareerDoc } from '../constants/careerSamples';

interface LoggedInHomeDashboardProps {
  currentUser: GoogleUserProfile;
  onEnterEditor: (docId?: string) => void;
  onOpenCreateModal: (type?: 'resume' | 'career') => void;
  onOpenDocDrawer: () => void;
}

const RESUME_SAMPLE_CARDS = [
  {
    id: 'sample-resume-developer',
    role: '개발자 (Frontend / Software)',
    badge: 'IT / Tech',
    summary: '프론트엔드 아키텍처 및 디자인 시스템, LCP 48% 단축 및 배포 주기 18분→4분 단축',
    icon: <Code className="w-5 h-5 text-sky-600" />,
    bg: 'bg-sky-50 border-sky-200/80',
    tags: ['React', 'TypeScript', 'Turborepo', '성능 최적화'],
  },
  {
    id: 'sample-resume-pm',
    role: '프로덕트 매니저 (PO / PM)',
    badge: 'Product',
    summary: '1-Click 간편결제 런칭, GMV 420억 견인, A/B 테스트 및 데이터 기반 퍼널 최적화',
    icon: <LayoutGrid className="w-5 h-5 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-200/80',
    tags: ['A/B 테스트', 'Amplitude', 'B2C 커머스', '스쿼드 리드'],
  },
  {
    id: 'sample-resume-designer',
    role: '프로덕트 디자이너 (UI/UX)',
    badge: 'Design',
    summary: '토큰 기반 크로스 플랫폼 디자인 시스템(Aura DS) 구축, 결제 완료율 8.7% 상승',
    icon: <Palette className="w-5 h-5 text-indigo-600" />,
    bg: 'bg-indigo-50 border-indigo-200/80',
    tags: ['Figma Tokens', 'UI/UX', '디자인 시스템', 'UT'],
  },
  {
    id: 'sample-resume-marketer',
    role: '그로스 마케터 (Growth)',
    badge: 'Marketing',
    summary: '월 예산 4억 멀티채널 집행, CAC 42% 절감, CRM 자동화 여정으로 30일 리텐션 31.2%',
    icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
    bg: 'bg-orange-50 border-orange-200/80',
    tags: ['CAC 절감', 'AppsFlyer', 'Braze', '퍼포먼스 마케팅'],
  },
  {
    id: 'sample-resume-business',
    role: '전략기획 및 사업개발 (BD)',
    badge: 'Business',
    summary: '대기업 12건 제휴 체결로 연 매출 180억 창출, B2B 카셰어링 구독 모델 런칭',
    icon: <LineChart className="w-5 h-5 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['B2B 사업개발', '손익 모델(P&L)', '제휴 계약', 'M&A CDD'],
  },
];

const CAREER_SAMPLE_CARDS = [
  {
    id: 'sample-career-backend',
    role: '백엔드 / 클라우드 엔지니어',
    badge: 'Backend',
    summary: '피크 TPS 35,000 분산 락/큐잉 시스템 구축, 정산 배치 88% 단축 스트리밍 파이프라인',
    icon: <Server className="w-5 h-5 text-slate-700" />,
    bg: 'bg-slate-50 border-slate-200/80',
    tags: ['Java/Spring', 'Kafka', 'Redis Redlock', '분산 트랜잭션'],
  },
  {
    id: 'sample-career-frontend',
    role: '프론트엔드 / 웹 엔지니어',
    badge: 'Frontend',
    summary: '마이크로 프론트엔드 독립 배포 전환(일 12회), Web Vitals 최적화(LCP 1.4s 달성)',
    icon: <Code className="w-5 h-5 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['Module Federation', 'Web Vitals', 'Design System', 'Vite'],
  },
  {
    id: 'sample-career-pm',
    role: '프로덕트 매니저 (PO / PM)',
    badge: 'Product',
    summary: '1-Click 간편결제 생체인증 여정 단축, ML 홈 피드 개인화(GMV 38% 성장)',
    icon: <Compass className="w-5 h-5 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-200/80',
    tags: ['문제 정의', '정량 성과', 'PRD', 'A/B 테스트'],
  },
  {
    id: 'sample-career-data',
    role: '데이터 엔지니어 / 분석가',
    badge: 'Data',
    summary: '일 1.2억 건 이벤트 수집, Apache Iceberg 레이크하우스 구축 및 쿼리 비용 52% 절감',
    icon: <Database className="w-5 h-5 text-indigo-600" />,
    bg: 'bg-indigo-50 border-indigo-200/80',
    tags: ['Apache Iceberg', 'Spark', 'Kafka/Flink', 'dbt'],
  },
  {
    id: 'sample-career-biz',
    role: '전략기획 및 사업개발 (BD)',
    badge: 'Business',
    summary: 'B2B 법인 카셰어링 120개사 유치, 차량 가동률 32%→68% 개선, 연 ARR 85억',
    icon: <Layers className="w-5 h-5 text-blue-700" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['신사업 0 to 1', 'P&L 모델링', '전략 제휴', 'ARR 성장'],
  },
];

export const LoggedInHomeDashboard: React.FC<LoggedInHomeDashboardProps> = ({
  currentUser,
  onEnterEditor,
  onOpenCreateModal,
  onOpenDocDrawer,
}) => {
  const documents = useCVStore((s) => s.documents);
  const activeDocId = useCVStore((s) => s.activeDocId);
  const createNewDocument = useCVStore((s) => s.createNewDocument);
  const duplicateDocument = useCVStore((s) => s.duplicateDocument);
  const deleteDocument = useCVStore((s) => s.deleteDocument);
  const selectDocument = useCVStore((s) => s.selectDocument);

  // 대분류 탭: 이력서 vs 경력기술서
  const [activeCategory, setActiveCategory] = useState<'resume' | 'career'>('resume');
  // 소분류 하위 모드: 'samples' vs 'blank'
  const [subMode, setSubMode] = useState<'samples' | 'blank'>('samples');

  const currentCards = activeCategory === 'resume' ? RESUME_SAMPLE_CARDS : CAREER_SAMPLE_CARDS;
  const currentSampleDocs = activeCategory === 'resume' ? RESUME_JOB_SAMPLES : CAREER_JOB_SAMPLES;

  // 최근 작업 중인 내 문서 (최대 4개)
  const myRecentDocs = documents.slice(0, 4);

  const handleCreateBlank = () => {
    if (activeCategory === 'resume') {
      createNewDocument(undefined, '새 이력서');
    } else {
      createNewDocument(createBlankCareerDoc(), '새 경력기술서');
    }
    onEnterEditor();
  };

  const handleSelectSample = (sampleId: string) => {
    const found = currentSampleDocs.find((d) => d.id === sampleId);
    if (found) {
      createNewDocument(found, found.name);
      onEnterEditor();
    }
  };

  const handleOpenDoc = (id: string) => {
    selectDocument(id);
    onEnterEditor(id);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* 상단 웰컴 배너 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{currentUser.email}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
              반갑습니다, {currentUser.name}님 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              원하는 문서 종류와 직군별 샘플을 선택하여 바로 수정을 시작하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={onOpenDocDrawer}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <FolderOpen className="w-4 h-4 text-zinc-600" />
              <span>보관함 ({documents.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterEditor(activeDocId)}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>현재 문서 편집하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 탭: 이력서 vs 경력기술서 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
            {/* 상위 대분류 탭 버튼 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('resume');
                  setSubMode('samples');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategory === 'resume'
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>이력서 (Resume)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('career');
                  setSubMode('samples');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategory === 'career'
                    ? 'bg-indigo-950 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200'
                }`}
              >
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>경력기술서 (Projects)</span>
              </button>
            </div>

            {/* 하위 소분류: 직군별 샘플 vs 빈 문서 선택 */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl self-start sm:self-auto border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setSubMode('samples')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  subMode === 'samples'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                <span>직군별 샘플 (5종)</span>
              </button>
              <button
                type="button"
                onClick={() => setSubMode('blank')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  subMode === 'blank'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-zinc-700" />
                <span>{activeCategory === 'resume' ? '빈 이력서' : '빈 경력기술서'}</span>
              </button>
            </div>
          </div>

          {/* 소분류 1: 빈 문서 생성 선택 시 */}
          {subMode === 'blank' ? (
            <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-white transition-all text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
                {activeCategory === 'resume' ? (
                  <FileText className="w-7 h-7 text-zinc-800" />
                ) : (
                  <Briefcase className="w-7 h-7 text-indigo-700" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-zinc-950">
                {activeCategory === 'resume' ? '새 빈 이력서 생성' : '새 빈 경력기술서 생성'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                {activeCategory === 'resume'
                  ? '표준 레이아웃(인적사항, 학력, 경력, 보유 기술)의 백지 템플릿으로 시작하여 자유롭게 기재합니다.'
                  : '프로젝트 단위(배경, 역할, 수행 내용, 정량 성과)가 체계적으로 잡힌 백지 템플릿으로 시작합니다.'}
              </p>
              <button
                type="button"
                onClick={handleCreateBlank}
                className="mt-3 px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>빈 문서 만들고 편집하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* 소분류 2: 직군별 대표 5개 샘플 카드 그리드 */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>
                  <strong>{activeCategory === 'resume' ? '이력서' : '경력기술서'}</strong> 대표 5개
                  직군별 샘플:
                </span>
                <span className="text-zinc-400">카드를 누르면 복사되어 바로 편집 창이 열립니다</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {currentCards.map((card, idx) => (
                  <div
                    key={card.id}
                    onClick={() => handleSelectSample(card.id)}
                    className="group p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-950 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${card.bg}`}
                          >
                            {card.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400">
                              직군 #{idx + 1}
                            </span>
                            <h4 className="text-sm font-extrabold text-zinc-950 group-hover:text-blue-600 transition-colors">
                              {card.role}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                          {card.badge}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                        {card.summary}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors">
                        이 샘플로 시작하기
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-zinc-100 group-hover:bg-zinc-950 text-zinc-700 group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 내 보관함 최근 문서 목록 */}
        <div className="pt-4 border-t border-zinc-200 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-zinc-700" />
              <h3 className="text-sm sm:text-base font-extrabold text-zinc-950">
                내 문서 보관함 ({documents.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenDocDrawer}
              className="text-xs font-bold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
            >
              <span>전체 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {myRecentDocs.map((doc) => {
              const isCareer = doc.docType === 'career';
              const isCurrent = doc.id === activeDocId;
              return (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 flex items-center justify-between gap-3 transition-all"
                >
                  <div
                    onClick={() => handleOpenDoc(doc.id)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isCareer
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {isCareer ? '경력기술서' : '이력서'}
                      </span>
                      <h5 className="font-extrabold text-xs sm:text-sm text-zinc-900 truncate">
                        {doc.name}
                      </h5>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white shrink-0">
                          선택됨
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 truncate">
                      {doc.personal.fullName} · {doc.personal.jobTitle} · 섹션 {doc.sections.length}
                      개
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => duplicateDocument(doc.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                      title="복제"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenDoc(doc.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>열기</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 px-6 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">MaxCV Studio</span>
            <span>·</span>
            <span>이력서 및 경력기술서 스튜디오</span>
          </div>
          <div>모든 데이터는 브라우저 및 안전한 클라우드에 자동 보관됩니다.</div>
        </div>
      </footer>
    </div>
  );
};
