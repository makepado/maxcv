import { CVDocument, CVSection, SectionItem, SectionType } from '../types/cv';
import { DEFAULT_DESIGN_SETTINGS } from './defaultCv';

/**
 * 직군별 대표 경력기술서 샘플 5종:
 * 1. 백엔드/클라우드 엔지니어 (Backend / DevOps)
 * 2. 프론트엔드/웹 엔지니어 (Frontend / Web Platform)
 * 3. 프로덕트 매니저 (PO / Service PM)
 * 4. 데이터 엔지니어 / 분석가 (Data Engineer / Analyst)
 * 5. 전략기획 및 신사업 개발 (Business Development & Operations)
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

const CAREER_BASE_DESIGN = {
  ...DEFAULT_DESIGN_SETTINGS,
  layoutStructure: 'single' as const,
  showSectionIcons: false,
  headerTitleLayout: 'inline' as const,
  headerSeparator: 'pipe' as const,
  showHeaderIcons: false,
  entryGap: 16,
};

export const CAREER_JOB_SAMPLES: CVDocument[] = [
  // 1. 백엔드/클라우드 엔지니어
  {
    id: 'sample-career-backend',
    name: '강태양 — 백엔드 및 클라우드 엔지니어 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '강태양',
      jobTitle: '시니어 백엔드 및 분산시스템 엔지니어',
      email: 'taeyang.kang@maxcv.dev',
      phone: '010-7294-8192',
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
          id: 'cb-link-1',
          platform: 'github',
          label: 'github.com/taeyangkang-dev',
          url: 'https://github.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cb-sum', 'profile', '경력 요약', [
        item('cb-sum-1', {
          title: '총 경력 8년 · 대규모 분산 트랜잭션 및 고가용성 마이크로서비스 설계',
          description:
            '• 피크 타임 TPS 35,000 수준의 이커머스 결제/주문 시스템 아키텍처를 설계하고 운영했습니다.\n• 모놀리스 시스템의 MSA 분해 및 Kafka 기반 이벤트 주도 아키텍처(EDA) 전환을 주도했습니다.\n• AWS 클라우드 인프라 비용 35% 절감 및 P99 지연 시간(Latency) 120ms → 28ms 단축을 달성했습니다.',
        }),
      ]),
      section('cb-exp', 'experience', '경력 사항', [
        item('cb-exp-1', {
          title: '쿠팡/컬리 계열 리테일테크',
          subtitle: '주문결제코어팀 · 시니어 백엔드 엔지니어 / 테크 리드',
          startDate: '2021.05',
          isCurrent: true,
          location: '재직 중',
          description: '• 대규모 트래픽 주문 트랜잭션 코어 서비스 및 정산 파이프라인 아키텍처 총괄',
        }),
        item('cb-exp-2', {
          title: '페이먼츠 스타트업',
          subtitle: '플랫폼개발팀 · 백엔드 엔지니어',
          startDate: '2017.03',
          endDate: '2021.04',
          location: '4년 2개월',
          description: '• PG 연동 API 및 가맹점 정산 배치 시스템 개발 및 무중단 배포 체계 수립',
        }),
      ]),
      section('cb-proj', 'projects', '핵심 프로젝트 상세', [
        item('cb-proj-1', {
          title: '초대용량 타임세일 주문 트래픽 대비 분산 락 및 큐잉 시스템 구축',
          subtitle: '리테일테크 · 아키텍트 및 테크 리드 (기여도 70%)',
          startDate: '2023.03',
          endDate: '2023.11',
          description:
            '• 배경: 블랙프라이데이 타임세일 시 순간적인 동시 주문 폭주로 인한 DB 커넥션 고갈 및 재고 정합성 이슈 발생\n• 역할: 분산 아키텍처 설계, 동시성 제어 모델 수립, 부하 테스트(k6) 주도\n• 수행 내용: Redis Redlock 및 Kafka 지연 큐를 도입하여 재고 차감 트랜잭션을 비동기 격리하고, DB Write 부하를 80% 완충\n• 성과: 피크 TPS 35,000 무장애 처리(가용률 99.99%), 주문 실패율 0.001% 미만 달성',
          tags: ['Java 21', 'Spring Boot 3', 'Kafka', 'Redis', 'PostgreSQL', 'k6'],
        }),
        item('cb-proj-2', {
          title: '정산 배치 시스템 스트리밍 데이터 파이프라인 전환',
          subtitle: '리테일테크 · 파이프라인 설계 (기여도 85%)',
          startDate: '2022.06',
          endDate: '2022.12',
          description:
            '• 배경: 매일 야간에 6시간 이상 소요되던 단일 DB 기반 정산 배치가 데이터 증가로 아침 업무 시간까지 지연\n• 역할: 이벤트 기반 정산 아키텍처 설계 및 배치 로직 분산화\n• 수행 내용: Spring Batch 청크 분할 및 Kafka Connect + Debezium CDC 연동을 통한 실시간 정산 정합성 검증 도입\n• 성과: 정산 처리 시간 6시간 30분 → 45분으로 88% 단축, 정산 오차 0건 유지',
          tags: ['Spring Batch', 'Kafka Streams', 'Debezium CDC', 'MySQL'],
        }),
      ]),
      section('cb-skill', 'skills', '전문 기술 스택', [
        item('cb-sk-1', {
          title: 'Backend & Core',
          tags: ['Java', 'Kotlin', 'Spring Boot', 'JPA/Hibernate', 'Node.js', 'Go'],
        }),
        item('cb-sk-2', {
          title: 'Data & Infra',
          tags: ['Kafka', 'Redis', 'PostgreSQL', 'MySQL', 'Kubernetes', 'AWS (EKS, RDS, MSK)', 'Terraform'],
        }),
      ]),
    ],
    design: { ...CAREER_BASE_DESIGN, accentColor: '#1e293b' },
  },

  // 2. 프론트엔드/웹 엔지니어
  {
    id: 'sample-career-frontend',
    name: '김민준 — 프론트엔드 엔지니어 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '김민준',
      jobTitle: '시니어 프론트엔드 및 웹 플랫폼 엔지니어',
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
          id: 'cf-link-1',
          platform: 'github',
          label: 'github.com/minjunkim-dev',
          url: 'https://github.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cf-sum', 'profile', '경력 요약', [
        item('cf-sum-1', {
          title: '총 경력 7년 · 프론트엔드 아키텍처 및 디자인 시스템 TF 리드',
          description:
            '• MAU 680만 핀테크 자산관리 서비스의 웹 클라이언트 아키텍처와 웹뷰 최적화를 주도했습니다.\n• 멀티 패키지 디자인 시스템 구축으로 40개 프로덕트 팀의 신규 화면 개발 기간을 2주에서 4일로 단축했습니다.\n• 마이크로 프론트엔드 전환 및 번들 최적화로 LCP 48% 단축, 결제 전환율 14.2% 상승을 이끌었습니다.',
        }),
      ]),
      section('cf-exp', 'experience', '경력 사항', [
        item('cf-exp-1', {
          title: '네오핀테크',
          subtitle: '프론트엔드팀 · 시니어 엔지니어 / TF 리드',
          startDate: '2023.03',
          isCurrent: true,
          location: '재직 중',
          description: '• 자산관리 웹앱 아키텍처 고도화, 하이브리드 앱 브릿지 및 성능 최적화 리드',
        }),
        item('cf-exp-2', {
          title: '클라우드웍스 코리아',
          subtitle: '플랫폼개발팀 · 프론트엔드 엔지니어',
          startDate: '2019.01',
          endDate: '2023.02',
          location: '4년 2개월',
          description: '• B2B 협업 SaaS 캔버스 에디터 및 실시간 동시 편집 기능 개발',
        }),
      ]),
      section('cf-proj', 'projects', '프로젝트 상세', [
        item('cf-proj-1', {
          title: '자산관리 웹앱 Module Federation 기반 독립 배포 아키텍처 구축',
          subtitle: '네오핀테크 · 아키텍처 리드 (기여도 60%)',
          startDate: '2024.02',
          endDate: '2024.11',
          description:
            '• 배경: 단일 모놀리스 웹 저장소로 인해 7개 팀의 배포 일정이 얽히고 CI 빌드가 18분 이상 소요\n• 역할: 공통 셸 설계, 런타임 공유 의존성(Host-Remote) 관리 체계 수립\n• 수행 내용: Vite + Module Federation 도입, 독립 버전 태그 기반 Blue/Green 배포 자동화\n• 성과: 팀별 주간 배포 주기 1회 → 일 12회 이상, 빌드 시간 18분 → 4분으로 77% 단축',
          tags: ['React 19', 'TypeScript', 'Module Federation', 'Turborepo', 'Vite'],
        }),
        item('cf-proj-2', {
          title: '모바일 웹뷰 결제 플로우 성능 최적화 및 Web Vitals 개선',
          subtitle: '네오핀테크 · 성능 TF (기여도 80%)',
          startDate: '2023.06',
          endDate: '2023.12',
          description:
            '• 배경: 저사양 모바일 기기에서 결제 페이지 초기 로딩 시 화이트스크린 발생으로 이탈 증가\n• 역할: Web Vitals 병목 프로파일링 및 렌더링 최적화 전담\n• 수행 내용: 초기 JS 번들 분할(420KB → 86KB), 리소스 프리로드, 가상화 리스트 도입\n• 성과: LCP 3.2s → 1.4s (48% 개선), CLS 0.01 미만 유지, 결제 이탈률 18% 감소',
          tags: ['Performance', 'Web Vitals', 'Lighthouse CI', 'Code Splitting'],
        }),
      ]),
      section('cf-skill', 'skills', '보유 기술', [
        item('cf-sk-1', {
          title: 'Frontend Tech',
          tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'React Query'],
        }),
        item('cf-sk-2', {
          title: 'Tooling & CI',
          tags: ['Turborepo', 'Vite', 'Webpack', 'Playwright', 'GitHub Actions', 'Storybook'],
        }),
      ]),
    ],
    design: { ...CAREER_BASE_DESIGN, accentColor: '#2563eb' },
  },

  // 3. 프로덕트 매니저 (PO / Service PM)
  {
    id: 'sample-career-pm',
    name: '박서현 — 프로덕트 매니저 (PO) 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '박서현',
      jobTitle: '커머스 및 플랫폼 프로덕트 오너 (Lead PO)',
      email: 'seohyun.park@maxcv.dev',
      phone: '010-4821-3920',
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
          id: 'cpm-link-1',
          platform: 'linkedin',
          label: 'linkedin.com/in/seohyun-po',
          url: 'https://linkedin.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cpm-sum', 'profile', '경력 요약', [
        item('cpm-sum-1', {
          title: '총 경력 8년 · 이커머스 거래액(GMV) 420억 견인 및 퍼널 최적화',
          description:
            '• 14인 크로스펑셔널 스쿼드를 이끌며 사용자 발견-탐색-결제 전 주기를 데이터 중심으로 개편했습니다.\n• 1-Click 간편결제 및 개인화 큐레이션 도입으로 결제 전환율(CVR) 2.1%p 상승, 이탈률 18% 감소를 달성했습니다.\n• Amplitude, SQL 기반 가설 검증과 정성 UT를 결합하여 제품 로드맵을 신속하게 실행합니다.',
        }),
      ]),
      section('cpm-exp', 'experience', '경력 사항', [
        item('cpm-exp-1', {
          title: '리테일테크 유니콘',
          subtitle: '커머스 스쿼드 · 리드 프로덕트 오너',
          startDate: '2022.04',
          isCurrent: true,
          location: '재직 중',
          description: '• 결제 전환율 극대화 및 탐색 경험 최적화를 담당하는 제품 스쿼드 총괄',
        }),
        item('cpm-exp-2', {
          title: '클라우드웍스 코리아',
          subtitle: 'B2B 프로덕트팀 · 프로덕트 매니저',
          startDate: '2019.01',
          endDate: '2022.03',
          location: '3년 3개월',
          description: '• SaaS 엔터프라이즈 플랜 기획 및 고객 온보딩 퍼널 최적화',
        }),
      ]),
      section('cpm-proj', 'projects', '주요 프로젝트 상세', [
        item('cpm-proj-1', {
          title: '1-Click 간편결제 시스템 기획 및 런칭',
          subtitle: '리드 PO · 기획 및 A/B 테스트 총괄 (기여도 75%)',
          startDate: '2023.01',
          endDate: '2023.08',
          description:
            '• 배경: 모바일 결제 단계에서 복잡한 약관 동의 및 본인인증으로 장바구니 이탈률 42% 상회\n• 가설: 생체인증 1회 연동 기반 1-Click 주문을 도입하면 3단계 이상 결제 단계를 압축하여 전환율이 개선될 것이다.\n• 수행 내용: PG사 및 금융 보안 규제 검토, 10인 대상 UT 기반 UI 단순화, 4주간 트래픽 50% 분할 A/B 테스트 진행\n• 성과: 결제 완료 소요 시간 45초 → 9초 단축, 결제 이탈률 18% 감소, 출시 후 반기 결제액 420억 견인',
          tags: ['Fintech Payments', 'A/B Testing', 'Funnel Analysis', 'Amplitude'],
        }),
        item('cpm-proj-2', {
          title: '머신러닝 기반 홈 피드 개인화 큐레이션',
          subtitle: '리드 PO · 알고리즘 협업 및 성과 분석 (기여도 65%)',
          startDate: '2023.09',
          endDate: '2024.03',
          description:
            '• 배경: 정적 기획전 배너 중심 홈 화면으로 인해 신규 입점 상품 노출이 저조하고 체류 시간 정체\n• 수행 내용: 추천 모델러와 협업하여 사용자 최근 7일 클릭/장바구니 임베딩 기반 피드 랭킹 적용\n• 성과: 홈 경유 상품 상세 진입률(CTR) 24% 상승, 홈 경유 GMV 38% 성장',
          tags: ['Recommendation', 'Personalization', 'SQL', 'BigQuery'],
        }),
      ]),
      section('cpm-skill', 'skills', '역량 및 분석 도구', [
        item('cpm-sk-1', {
          title: 'Product Methodology',
          tags: ['Product Roadmapping', 'A/B Testing', 'User Interview', 'Agile/Scrum', 'PRD Writing'],
        }),
        item('cpm-sk-2', {
          title: 'Analytics & Collaboration',
          tags: ['Amplitude', 'SQL (BigQuery)', 'Mixpanel', 'Jira', 'Figma', 'Tableau'],
        }),
      ]),
    ],
    design: { ...CAREER_BASE_DESIGN, accentColor: '#0f766e' },
  },

  // 4. 데이터 엔지니어 / 분석가
  {
    id: 'sample-career-data',
    name: '윤도현 — 데이터 엔지니어 및 분석가 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '윤도현',
      jobTitle: '시니어 데이터 플랫폼 및 분석 엔지니어',
      email: 'dohyun.yoon@maxcv.dev',
      phone: '010-6391-2049',
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
          label: 'github.com/dohyun-data',
          url: 'https://github.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cda-sum', 'profile', '경력 요약', [
        item('cda-sum-1', {
          title: '총 경력 6년 · 일 1.2억 건 이벤트 수집 및 실시간 레이크하우스 구축',
          description:
            '• 분산 데이터 레이크하우스(Iceberg, Spark) 및 실시간 분석 파이프라인을 구축했습니다.\n• 쿼리 비용 52% 절감, 데이터 지연(SLA) 4시간 → 5분 이내 단축을 주도했습니다.\n• dbt 기반 모듈러 데이터 모델링과 데이터 거버넌스 체계를 사내 전사로 확산했습니다.',
        }),
      ]),
      section('cda-exp', 'experience', '경력 사항', [
        item('cda-exp-1', {
          title: '글로벌 엔터테인먼트 플랫폼',
          subtitle: '데이터인프라팀 · 시니어 데이터 엔지니어',
          startDate: '2022.01',
          isCurrent: true,
          location: '재직 중',
          description: '• 전사 로그 수집 엔진 및 레이크하우스 분석 인프라 총괄',
        }),
        item('cda-exp-2', {
          title: '모빌리티 서비스 테크',
          subtitle: '비즈니스분석팀 · 데이터 분석가 / 엔지니어',
          startDate: '2019.03',
          endDate: '2021.12',
          location: '2년 10개월',
          description: '• 배차 알고리즘 지표 로깅 및 실시간 대시보드 파이프라인 개발',
        }),
      ]),
      section('cda-proj', 'projects', '주요 파이프라인 구축 프로젝트', [
        item('cda-proj-1', {
          title: 'Apache Iceberg 기반 전사 데이터 레이크하우스 마이그레이션',
          subtitle: '데이터 엔지니어 · 아키텍처 설계 및 구축 (기여도 80%)',
          startDate: '2023.02',
          endDate: '2023.10',
          description:
            '• 배경: 기존 Hive 메타스토어 파티셔닝 한계로 일일 1억 건 이상 로그 파티션 스캔 비용 급증\n• 역할: 레이크하우스 기술 스택 선정, Iceberg 테이블 포맷 마이그레이션 및 Spark 잡 튜닝\n• 수행 내용: Z-Order 클러스터링 도입 및 소형 파일 병합 자동화, dbt를 통한 비즈니스 마트 계층화\n• 성과: 전사 Athena/Trino 쿼리 응답 속도 4.5배 개선, 클라우드 스토리지 및 쿼리 비용 월 $18,000 절감',
          tags: ['Apache Iceberg', 'Spark', 'dbt', 'AWS S3', 'Trino'],
        }),
        item('cda-proj-2', {
          title: '실시간 이상 징후 감지 및 스트리밍 메트릭 파이프라인',
          subtitle: '데이터 엔지니어 · 스트리밍 파이프라인 설계 (기여도 90%)',
          startDate: '2022.05',
          endDate: '2022.11',
          description:
            '• 배경: 악의적 트래픽 및 비정상 어뷰징 결제를 배치 분석(익일)으로 사후 감지하여 손실 발생\n• 수행 내용: Kafka + Flink 기반 슬라이딩 윈도우 집계 엔진 구축 및 슬랙 알림 웹훅 연동\n• 성과: 어뷰징 탐지 소요 시간 24시간 → 10초 이내로 단축, 월 3천만 원 상당의 부정 결제 방지',
          tags: ['Apache Flink', 'Kafka', 'Python', 'Prometheus'],
        }),
      ]),
      section('cda-skill', 'skills', '기술 스택 & 도구', [
        item('cda-sk-1', {
          title: 'Data Engine & Pipeline',
          tags: ['Python', 'SQL', 'Spark', 'Flink', 'Kafka', 'Airflow', 'dbt'],
        }),
        item('cda-sk-2', {
          title: 'Storage & Cloud',
          tags: ['Apache Iceberg', 'Snowflake', 'BigQuery', 'AWS S3', 'PostgreSQL', 'Docker'],
        }),
      ]),
    ],
    design: { ...CAREER_BASE_DESIGN, accentColor: '#4f46e5' },
  },

  // 5. 전략기획 및 신사업 개발 (Business Development & Operations)
  {
    id: 'sample-career-biz',
    name: '정유진 — 전략기획 및 사업개발(BD) 경력기술서',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    docType: 'career',
    personal: {
      fullName: '정유진',
      jobTitle: '시니어 사업개발 및 전략기획 매니저',
      email: 'yujin.jung@maxcv.dev',
      phone: '010-5192-3847',
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
          id: 'cbz-link-1',
          platform: 'linkedin',
          label: 'linkedin.com/in/yujin-bizstrategy',
          url: 'https://linkedin.com',
        },
      ],
      customFields: [],
    },
    sections: [
      section('cbz-sum', 'profile', '경력 요약', [
        item('cbz-sum-1', {
          title: '총 경력 8년 · 신규 비즈니스 모델 발굴 및 연 매출 180억 파트너십 창출',
          description:
            '• 시리즈 B~C 모빌리티/플랫폼 기업에서 신사업 기획, 제휴 계약 체결, 손익(P&L) 관리를 주도했습니다.\n• 대기업 및 완성차 12개 사와의 전략 제휴 계약을 성사시키며 B2B 법인 멤버십 연 ARR 85억 원을 달성했습니다.\n• 시장 규모 추산(TAM/SAM/SOM), 재무 시뮬레이션, 실행 로드맵 수립에 전문성을 갖추고 있습니다.',
        }),
      ]),
      section('cbz-exp', 'experience', '경력 사항', [
        item('cbz-exp-1', {
          title: '모빌리티 플랫폼 유니콘',
          subtitle: '사업전략실 · 시니어 사업개발 매니저',
          startDate: '2021.08',
          isCurrent: true,
          location: '재직 중',
          description: '• B2B 법인 카셰어링 및 모빌리티 멤버십 신사업 총괄, 핵심 제휴 계약 체결',
        }),
        item('cbz-exp-2', {
          title: '글로벌 전략컨설팅펌',
          subtitle: '전략기획본부 · 컨설턴트 (Associate)',
          startDate: '2017.03',
          endDate: '2021.07',
          location: '4년 5개월',
          description: '• 대기업 신사업 포트폴리오 재편, M&A 사업 실사(CDD) 프로젝트 수행',
        }),
      ]),
      section('cbz-proj', 'projects', '주요 사업 성과 상세', [
        item('cbz-proj-1', {
          title: 'B2B 법인 전용 모빌리티 구독 멤버십 신규 런칭',
          subtitle: '사업 총괄 매니저 · 기획부터 계약 체결까지 (기여도 85%)',
          startDate: '2022.03',
          endDate: '2023.05',
          description:
            '• 배경: B2C 공유차량의 평일 낮 가동률 저하(32%) 문제를 법인 업무용 수요로 해소하고자 신사업 기획\n• 역할: 요금제 및 손익(P&L) 모델 설계, 기업용 관리 콘솔 요건 정의, 초기 10개 대기업 영업 총괄\n• 수행 내용: 법인 세무 비용 처리 자동화 제휴, 법인 전용 예약 정책 수립, 고객사별 맞춤 커스텀 플랜 제안\n• 성과: 출시 1년 내 120개 기업 고객사 유치, 평일 낮 차량 가동률 32% → 68%로 대폭 개선, 연 ARR 85억 달성',
          tags: ['B2B Sales', 'Subscription Model', 'P&L Modeling', 'Partnership'],
        }),
        item('cbz-proj-2', {
          title: '완성차 제조사와의 커넥티드 카 데이터 제휴 및 공동 상품 출시',
          subtitle: '전략 제휴 매니저 · 계약 구조 설계 및 협상 (기여도 75%)',
          startDate: '2023.07',
          endDate: '2024.02',
          description:
            '• 배경: 차량 상태 및 주행 데이터 실시간 수집을 통한 유지보수 비용 절감 필요\n• 수행 내용: 제조사 법무/보안팀과 6개월간 데이터 보호 규제(개인정보보호법) 검토 및 독점 공급 계약 체결\n• 성과: 차량 고장 예방률 40% 개선으로 유지보수 비용 연 14억 원 절감, 양사 공동 브랜드 캠페인 진행',
          tags: ['Data Partnership', 'Contract Negotiation', 'Cost Reduction'],
        }),
      ]),
      section('cbz-skill', 'skills', '전문 역량 & 도구', [
        item('cbz-sk-1', {
          title: 'Strategy & BD',
          tags: ['Market Sizing', 'Financial Modeling', 'Deal Structuring', 'B2B Sales Strategy', 'Cross-functional Alignment'],
        }),
        item('cbz-sk-2', {
          title: 'Tools & Analytics',
          tags: ['Excel Financial Model', 'Tableau', 'PowerPoint Proposal', 'Salesforce CRM'],
        }),
      ]),
    ],
    design: { ...CAREER_BASE_DESIGN, accentColor: '#1e3a8a' },
  },
];
