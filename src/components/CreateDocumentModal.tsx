import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Plus,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Code,
  LayoutGrid,
  Palette,
  TrendingUp,
  LineChart,
  Server,
  Layers,
  Database,
  Compass,
} from 'lucide-react';
import { CVDocument } from '../types/cv';
import { RESUME_JOB_SAMPLES } from '../constants/resumeJobSamples';
import { CAREER_JOB_SAMPLES } from '../constants/careerJobSamples';
import { createBlankCareerDoc } from '../constants/careerSamples';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: CVDocument | undefined, nameOverride?: string) => void;
  initialType?: 'resume' | 'career';
}

const RESUME_METAS = [
  {
    id: 'sample-resume-developer',
    role: '개발자',
    badge: 'IT / Tech',
    summary: '프론트엔드 아키텍처 및 디자인 시스템, LCP 48% 개선 및 배포 주기 단축',
    icon: <Code className="w-4 h-4 text-sky-600" />,
    bg: 'bg-sky-50 border-sky-200/80',
    tags: ['React', 'TypeScript', 'Turborepo', '성능 최적화'],
  },
  {
    id: 'sample-resume-pm',
    role: '프로덕트 매니저',
    badge: 'Product',
    summary: '1-Click 간편결제 런칭, GMV 420억 견인, A/B 테스트 기반 퍼널 최적화',
    icon: <LayoutGrid className="w-4 h-4 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-200/80',
    tags: ['A/B 테스트', 'Amplitude', 'B2C 커머스', '스쿼드 리드'],
  },
  {
    id: 'sample-resume-designer',
    role: '프로덕트 디자이너',
    badge: 'Design',
    summary: '토큰 기반 크로스 플랫폼 디자인 시스템(Aura DS) 구축, 결제 완료율 8.7% 개선',
    icon: <Palette className="w-4 h-4 text-indigo-600" />,
    bg: 'bg-indigo-50 border-indigo-200/80',
    tags: ['Figma Tokens', 'UI/UX', '디자인 시스템', 'UT'],
  },
  {
    id: 'sample-resume-marketer',
    role: '그로스 마케터',
    badge: 'Marketing',
    summary: '월 예산 4억 멀티채널 집행, CAC 42% 절감, CRM 자동화로 30일 리텐션 31.2%',
    icon: <TrendingUp className="w-4 h-4 text-orange-600" />,
    bg: 'bg-orange-50 border-orange-200/80',
    tags: ['CAC 절감', 'AppsFlyer', 'Braze', '퍼포먼스 마케팅'],
  },
  {
    id: 'sample-resume-business',
    role: '사업개발',
    badge: 'Business',
    summary: '대기업 12건 제휴 체결로 연 매출 180억 창출, B2B 카셰어링 구독 모델 런칭',
    icon: <LineChart className="w-4 h-4 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['B2B 사업개발', '손익 모델(P&L)', '제휴 계약', 'M&A CDD'],
  },
];

const CAREER_METAS = [
  {
    id: 'sample-career-backend',
    role: '백엔드 및 클라우드 엔지니어',
    badge: 'Backend',
    summary: '피크 TPS 35,000 분산 락/큐잉 시스템 구축, 정산 배치 88% 단축 파이프라인',
    icon: <Server className="w-4 h-4 text-slate-700" />,
    bg: 'bg-slate-50 border-slate-200/80',
    tags: ['Java/Spring', 'Kafka', 'Redis Redlock', '분산 트랜잭션'],
  },
  {
    id: 'sample-career-frontend',
    role: '프론트엔드 및 웹 엔지니어',
    badge: 'Frontend',
    summary: '마이크로 프론트엔드 독립 배포 전환(일 12회), Web Vitals 최적화(LCP 1.4s)',
    icon: <Code className="w-4 h-4 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['Module Federation', 'Web Vitals', 'Design System', 'Vite'],
  },
  {
    id: 'sample-career-pm',
    role: '프로덕트 매니저',
    badge: 'Product',
    summary: '1-Click 간편결제 생체인증 여정 단축, ML 홈 피드 개인화(GMV 38% 성장)',
    icon: <Compass className="w-4 h-4 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-200/80',
    tags: ['문제 정의', '정량 성과', 'PRD', 'A/B 테스트'],
  },
  {
    id: 'sample-career-data',
    role: '데이터 엔지니어 및 분석가',
    badge: 'Data',
    summary: '일 1.2억 건 이벤트 수집, Apache Iceberg 레이크하우스 구축 및 쿼리 비용 52% 절감',
    icon: <Database className="w-4 h-4 text-indigo-600" />,
    bg: 'bg-indigo-50 border-indigo-200/80',
    tags: ['Apache Iceberg', 'Spark', 'Kafka/Flink', 'dbt'],
  },
  {
    id: 'sample-career-biz',
    role: '사업개발',
    badge: 'Business',
    summary: 'B2B 법인 카셰어링 120개사 유치, 차량 가동률 32%→68% 개선, 연 ARR 85억',
    icon: <Layers className="w-4 h-4 text-blue-700" />,
    bg: 'bg-blue-50 border-blue-200/80',
    tags: ['신사업 0 to 1', 'P&L 모델링', '전략 제휴', 'ARR 성장'],
  },
];

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
  initialType = 'resume',
}) => {
  const [docType, setDocType] = useState<'resume' | 'career'>(initialType);
  const [mode, setMode] = useState<'sample' | 'blank'>('sample');

  if (!isOpen) return null;

  const currentMetas = docType === 'resume' ? RESUME_METAS : CAREER_METAS;
  const currentSamples = docType === 'resume' ? RESUME_JOB_SAMPLES : CAREER_JOB_SAMPLES;

  const handleSelectBlank = () => {
    if (docType === 'resume') {
      onSelectDocument(undefined, '새 이력서');
    } else {
      onSelectDocument(createBlankCareerDoc(), '새 경력기술서');
    }
    onClose();
  };

  const handleSelectSample = (sampleId: string) => {
    const found = currentSamples.find((s) => s.id === sampleId);
    if (found) {
      onSelectDocument(found, found.name);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col max-h-[92dvh]">
        {/* 모달 헤더 */}
        <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
              DOCUMENT SELECTOR
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-zinc-950 mt-0.5">
              새 문서 만들기
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 1: 이력서 vs 경력기술서 대분류 (괄호 제거 및 간결한 구성) */}
        <div className="p-3 sm:px-6 sm:pt-4 sm:pb-3 bg-zinc-50/70 border-b border-zinc-200/70 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-zinc-200/70 p-1 rounded-xl sm:rounded-2xl">
            <button
              type="button"
              onClick={() => setDocType('resume')}
              className={`py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                docType === 'resume'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>이력서</span>
            </button>
            <button
              type="button"
              onClick={() => setDocType('career')}
              className={`py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                docType === 'career'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>경력기술서</span>
            </button>
          </div>
        </div>

        {/* 본문 콘텐츠 스크롤 영역: 새 빈 문서 시작 카드 + 대표 5종 샘플 리스트 */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-3">
          <div className="space-y-2.5">
            {/* 첫 번째 카드: 새 빈 문서 시작 */}
            <div
              onClick={handleSelectBlank}
              className="group p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-900 text-white">
                      새로 만들기
                    </span>
                    <h4 className="text-sm font-extrabold text-zinc-900 group-hover:text-zinc-950 truncate">
                      {docType === 'resume' ? '새 이력서 (빈 문서)' : '새 경력기술서 (빈 문서)'}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1 leading-relaxed">
                    {docType === 'resume'
                      ? '기본 틀만 갖춘 깔끔한 백지 상태에서 바로 작성을 시작합니다.'
                      : '프로젝트 단위 가이드 항목이 포함된 백지 상태로 바로 시작합니다.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end sm:justify-center shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all">
                  <span>빈 문서 열기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-zinc-400 px-1 pt-2">
              또는 대표 5개 직군별 추천 샘플로 시작:
            </div>

            {/* 대표 5개 샘플 카드 */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentMetas.map((meta, idx) => (
                <div
                  key={meta.id}
                  onClick={() => handleSelectSample(meta.id)}
                  className="group p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200/90 hover:border-zinc-950 bg-white hover:bg-zinc-50/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${meta.bg}`}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/70">
                          샘플 #{idx + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-zinc-900 group-hover:text-zinc-950 truncate">
                          {meta.role}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1 leading-relaxed">
                        {meta.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meta.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-center shrink-0">
                    <span className="px-3 py-1.5 rounded-lg bg-zinc-100 group-hover:bg-zinc-950 text-zinc-700 group-hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all">
                      <span>선택하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="p-3 sm:p-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-500">
            문서는 생성 후 상단 보관함에서 언제든 복제·삭제할 수 있습니다.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
