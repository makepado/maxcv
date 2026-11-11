import { CVDocument, CVSection, SectionItem, SectionType } from '../types/cv';
import { DEFAULT_DESIGN_SETTINGS } from './defaultCv';

/**
 * 경력기술서(Career Description) 템플릿 및 샘플
 * - 이력서가 "무엇을 했는가"의 요약이라면, 경력기술서는 프로젝트 단위로
 *   "어떤 문제를, 어떤 역할로, 어떻게 해결했고, 어떤 성과를 냈는가"를 상세히 기술한다.
 */

function item(id: string, patch: Partial<SectionItem>): SectionItem {
  return {
    id,
    visible: true,
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    url: '',
    urlLabel: '',
    description: '',
    tags: [],
    level: 5,
    levelText: '',
    ...patch,
  };
}

function section(
  id: string,
  type: SectionType,
  title: string,
  items: SectionItem[]
): CVSection {
  return { id, type, title, visible: true, column: 'main', items };
}

const CAREER_DESIGN = {
  ...DEFAULT_DESIGN_SETTINGS,
  layoutStructure: 'single' as const,
  showSectionIcons: false,
  headerTitleLayout: 'inline' as const,
  headerSeparator: 'pipe' as const,
  showHeaderIcons: false,
  entryGap: 16,
};

/** 빈 경력기술서 템플릿 */
export function createBlankCareerDoc(): CVDocument {
  const ts = Date.now();
  return {
    id: `career-${ts}`,
    name: '새 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '홍길동',
      jobTitle: '경력기술서',
      email: 'hello@example.com',
      phone: '010-0000-0000',
      location: '',
      birthDate: '',
      nationality: '',
      militaryOrVisa: '',
      photoUrl: '',
      showPhoto: false,
      photoShape: 'rounded',
      photoSize: 88,
      photoGrayscale: false,
      links: [],
      customFields: [],
    },
    sections: [
      section(`sec-${ts}-1`, 'profile', '경력 요약', [
        item(`item-${ts}-1`, {
          title: '총 경력 N년',
          description:
            '• 핵심 직무와 전문 분야를 한 줄로 요약하세요.\n• 대표 성과를 수치와 함께 작성하세요.',
        }),
      ]),
      section(`sec-${ts}-2`, 'experience', '경력 사항', [
        item(`item-${ts}-2`, {
          title: '회사명',
          subtitle: '부서 · 직급',
          startDate: '2022.01',
          isCurrent: true,
          description: '• 회사 및 조직 소개, 담당 역할을 간단히 작성하세요.',
        }),
      ]),
      section(`sec-${ts}-3`, 'projects', '프로젝트 상세', [
        item(`item-${ts}-3`, {
          title: '프로젝트명',
          subtitle: '소속 회사 · 역할 (기여도 %)',
          startDate: '2024.01',
          endDate: '2024.06',
          description:
            '• 배경: 프로젝트를 시작하게 된 문제 상황\n• 역할: 본인이 맡은 업무 범위\n• 수행 내용: 문제 해결 방법과 의사결정 과정\n• 성과: 정량적 결과 (예: 처리 시간 40% 단축)',
          tags: ['사용 기술', '도구'],
        }),
      ]),
    ],
    design: { ...CAREER_DESIGN },
  };
}

export const SAMPLE_CAREERS: CVDocument[] = [
  {
    id: 'sample-career-dev',
    name: '김민준 — 개발자 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '김민준',
      jobTitle: '프론트엔드 엔지니어 경력기술서',
      email: 'minjun.kim@maxcv.dev',
      phone: '010-9876-5432',
      location: '',
      birthDate: '',
      nationality: '',
      militaryOrVisa: '',
      photoUrl: '',
      showPhoto: false,
      photoShape: 'rounded',
      photoSize: 88,
      photoGrayscale: false,
      links: [
        {
          id: 'cd-link-1',
          platform: 'github',
          label: 'github.com/minjunkim-dev',
          url: 'https://github.com/minjunkim-dev',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cd-sum', 'profile', '경력 요약', [
        item('cd-sum-1', {
          title: '총 경력 7년 · 프론트엔드 아키텍처 및 디자인 시스템',
          description:
            '• 핀테크·SaaS 도메인에서 대규모 트래픽 웹 서비스의 설계와 성능 최적화를 주도했습니다.\n• 디자인 시스템 구축으로 40개 프로덕트 팀의 UI 개발 생산성을 높였습니다.\n• 결제 전환율 14.2% 상승, LCP 48% 단축 등 비즈니스 지표 개선 경험이 있습니다.',
        }),
      ]),
      section('cd-exp', 'experience', '경력 사항', [
        item('cd-exp-1', {
          title: '네오핀테크',
          subtitle: '프론트엔드팀 · 시니어 엔지니어',
          startDate: '2023.03',
          isCurrent: true,
          location: '재직 중',
          description: '• MAU 680만 자산관리 서비스 · 프론트엔드 아키텍처 및 디자인 시스템 TF 리드',
        }),
        item('cd-exp-2', {
          title: '클라우드웍스 코리아',
          subtitle: '플랫폼개발팀 · 프론트엔드 엔지니어',
          startDate: '2019.01',
          endDate: '2023.02',
          location: '4년 2개월',
          description: '• B2B 협업 SaaS 웹 클라이언트 개발 및 실시간 편집 기능 담당',
        }),
      ]),
      section('cd-proj', 'projects', '프로젝트 상세', [
        item('cd-proj-1', {
          title: '자산관리 웹앱 마이크로 프론트엔드 전환',
          subtitle: '네오핀테크 · 아키텍처 설계 및 리드 (기여도 60%)',
          startDate: '2024.02',
          endDate: '2024.11',
          description:
            '• 배경: 단일 저장소 구조로 인해 7개 팀의 배포가 상호 의존하며 주 1회로 제한됨\n• 역할: 전환 전략 수립, 공통 셸 애플리케이션 설계, 팀별 마이그레이션 가이드 작성\n• 수행 내용: Module Federation 기반 독립 배포 구조 설계, 공통 상태·인증 모듈 분리, 점진적 전환 로드맵 운영\n• 성과: 배포 주기 주 1회 → 일 12회, 빌드 시간 18분 → 4분 단축',
          tags: ['React', 'TypeScript', 'Module Federation', 'Turborepo'],
        }),
        item('cd-proj-2', {
          title: '결제 플로우 성능 최적화',
          subtitle: '네오핀테크 · 성능 개선 담당 (기여도 80%)',
          startDate: '2023.06',
          endDate: '2023.12',
          description:
            '• 배경: 모바일 결제 페이지 이탈률이 업계 평균 대비 2배 높음\n• 역할: 성능 병목 분석 및 개선 작업 전담\n• 수행 내용: 번들 분할, 이미지 최적화, 서버 컴포넌트 도입, RUM 기반 지표 대시보드 구축\n• 성과: LCP 48% 단축, CLS 0.01 미만 달성, 결제 전환율 14.2% 상승',
          tags: ['Next.js', 'Web Vitals', 'Lighthouse CI'],
        }),
        item('cd-proj-3', {
          title: '사내 디자인 시스템 구축',
          subtitle: '클라우드웍스 코리아 · 컴포넌트 설계 (기여도 50%)',
          startDate: '2021.03',
          endDate: '2022.08',
          description:
            '• 배경: 제품별로 UI가 파편화되어 신규 화면 개발에 평균 2주 소요\n• 역할: 토큰 체계 설계 및 핵심 컴포넌트 30종 개발\n• 수행 내용: Figma 토큰 자동 동기화 파이프라인, 접근성(WCAG 2.1 AA) 기준 수립, Storybook 문서화\n• 성과: 신규 화면 개발 기간 2주 → 4일, 40개 팀 도입',
          tags: ['React', 'Storybook', 'Figma Tokens'],
        }),
      ]),
      section('cd-skill', 'skills', '보유 기술', [
        item('cd-skill-1', {
          title: '프론트엔드',
          tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
          levelText: '',
        }),
        item('cd-skill-2', {
          title: '인프라 · 도구',
          tags: ['Cloudflare', 'GitHub Actions', 'Vite', 'Turborepo'],
          levelText: '',
        }),
      ]),
    ],
    design: { ...CAREER_DESIGN },
  },
  {
    id: 'sample-career-research',
    name: '이서연 — 연구원 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '이서연',
      jobTitle: '자연어처리 연구원 경력기술서',
      email: 'seoyeon.lee@ai.snu.ac.kr',
      phone: '010-2345-6789',
      location: '',
      birthDate: '',
      nationality: '',
      militaryOrVisa: '',
      photoUrl: '',
      showPhoto: false,
      photoShape: 'square',
      photoSize: 84,
      photoGrayscale: false,
      links: [
        {
          id: 'cr-link-1',
          platform: 'scholar',
          label: 'Google Scholar',
          url: 'https://scholar.google.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cr-sum', 'profile', '연구 경력 요약', [
        item('cr-sum-1', {
          title: '연구 경력 6년 · 한국어 대규모 언어모델 및 사실성 평가',
          description:
            '• 한국어 LLM 사전학습·정렬과 장문 요약 사실성 평가를 중심으로 연구해 왔습니다.\n• 국제 학회(ACL·EMNLP) 주저자 논문 4편, 공개 데이터셋 2종을 발표했습니다.\n• 산학 과제 3건의 실무 책임을 맡아 연구 결과를 서비스로 이전했습니다.',
        }),
      ]),
      section('cr-exp', 'experience', '소속 및 경력', [
        item('cr-exp-1', {
          title: '서울대학교 인공지능연구원',
          subtitle: '언어지능연구실 · 박사후연구원',
          startDate: '2024.03',
          isCurrent: true,
          description: '• 한국어 LLM 정렬 및 평가 연구, 산학 과제 실무 책임',
        }),
        item('cr-exp-2', {
          title: '서울대학교 컴퓨터공학부',
          subtitle: '박사과정 연구원',
          startDate: '2019.03',
          endDate: '2024.02',
          description: '• 학위 논문: 한국어 장문 요약의 사실 일관성 평가 방법론',
        }),
      ]),
      section('cr-proj', 'projects', '연구 과제 상세', [
        item('cr-proj-1', {
          title: '한국어 LLM 사실성 정렬 연구',
          subtitle: '산학협력 과제 · 실무 책임 연구원',
          startDate: '2024.03',
          isCurrent: true,
          description:
            '• 배경: 한국어 생성 모델의 환각(hallucination) 문제로 금융·법률 도메인 적용이 제한됨\n• 역할: 연구 설계, 데이터 구축 총괄, 실험 및 논문 작성\n• 수행 내용: 도메인 특화 선호 데이터 3.2만 건 구축, DPO 기반 사실성 정렬 기법 제안\n• 성과: 사실성 지표 21%p 향상, EMNLP 2025 주저자 논문 게재, 기업 서비스 적용',
          tags: ['LLM', 'DPO', 'PyTorch', 'EMNLP 2025'],
        }),
        item('cr-proj-2', {
          title: '한국어 장문 요약 사실성 벤치마크 구축',
          subtitle: '정부 R&D 과제 · 참여 연구원',
          startDate: '2021.06',
          endDate: '2023.12',
          description:
            '• 배경: 한국어 요약 모델의 사실성을 평가할 공개 벤치마크 부재\n• 역할: 주석 가이드라인 설계, 품질 관리, 평가 지표 개발\n• 수행 내용: 금융·법률·의료 3개 도메인 요약 1.5만 쌍 구축 및 오픈소스 리더보드 운영\n• 성과: ACL 2023 논문 게재, 국내외 40개 기관 활용',
          tags: ['Dataset', 'Evaluation', 'ACL 2023'],
        }),
      ]),
      section('cr-pub', 'publications', '주요 논문', [
        item('cr-pub-1', {
          title: 'Factual Alignment for Korean LLMs via Domain Preference Optimization',
          subtitle: 'Lee S., et al.',
          startDate: '2025',
          location: 'EMNLP 2025',
        }),
        item('cr-pub-2', {
          title: 'KoFactSum: A Benchmark for Faithful Korean Long-form Summarization',
          subtitle: 'Lee S., et al.',
          startDate: '2023',
          location: 'ACL 2023',
        }),
      ]),
    ],
    design: {
      ...CAREER_DESIGN,
      headingFontId: 'maruburi',
      bodyFontId: 'kopub-batang',
      accentColor: '#1e293b',
    },
  },
];
