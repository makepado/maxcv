import { CVDocument, SectionItem } from '../types/cv';
import { DEFAULT_DESIGN_SETTINGS, SAMPLE_CVS } from './defaultCv';

/**
 * 직군별 대표 이력서 샘플 5종:
 * 1. 개발자 (Frontend / Software Engineer)
 * 2. 프로덕트 매니저 (PO / PM)
 * 3. 프로덕트 디자이너 (UI/UX)
 * 4. 마케터 / 그로스 (Growth Marketer)
 * 5. 비즈니스 / 전략 기획 (Business Development & Strategy)
 */

function makeItem(id: string, patch: Partial<SectionItem>): SectionItem {
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

export const RESUME_JOB_SAMPLES: CVDocument[] = [
  // 1. 개발자 (기존 검증된 sample-tech-lead 기반)
  {
    ...SAMPLE_CVS[0],
    id: 'sample-resume-developer',
    name: '김민준 — 시니어 프론트엔드 엔지니어',
  },

  // 2. 프로덕트 매니저 (PO / PM)
  {
    id: 'sample-resume-pm',
    name: '박서현 — 프로덕트 매니저 (PO)',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    personal: {
      fullName: '박서현',
      jobTitle: 'Product Owner / Senior PM',
      email: 'seohyun.park@maxcv.dev',
      phone: '010-4821-3920',
      location: '서울 서초구',
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
          id: 'pm-link-1',
          platform: 'linkedin',
          label: 'linkedin.com/in/seohyun-po',
          url: 'https://linkedin.com',
        },
        {
          id: 'pm-link-2',
          platform: 'blog',
          label: 'brunch.co.kr/@product-lens',
          url: 'https://brunch.co.kr',
        },
      ],
      customFields: [],
    },
    sections: [
      {
        id: 'pm-sec-profile',
        type: 'profile',
        title: '핵심 역량',
        visible: true,
        column: 'main',
        items: [
          makeItem('pm-prof-1', {
            title: '데이터 기반 가설 검증과 빠른 실행으로 비즈니스 임팩트를 만듭니다',
            description:
              '• 8년 차 B2C/B2B 프로덕트 오너로 커머스, 구독형 SaaS 제품의 0 to 1 빌딩 및 스케일업을 리드했습니다.\n• 정량 지표(A/B 테스트, 코호트 분석)와 정성 사용자 인터뷰를 결합하여 사용자 문제를 정의하고 해결합니다.\n• 엔지니어링, 디자인, 사업 팀 간의 얼라인먼트를 주도하여 스프린트 주기 단축과 분기 핵심 목표(OKR) 100% 달성을 견인했습니다.',
          }),
        ],
      },
      {
        id: 'pm-sec-exp',
        type: 'experience',
        title: '경력 사항',
        visible: true,
        column: 'main',
        items: [
          makeItem('pm-exp-1', {
            title: '리테일테크 유니콘',
            subtitle: '커머스 스쿼드 · 리드 프로덕트 오너 (Lead PO)',
            startDate: '2022.04',
            isCurrent: true,
            location: '서울',
            description:
              '• 결제 전환율 및 탐색 경험 최적화를 담당하는 14인 크로스펑셔널 스쿼드 리드\n• 검색/추천 알고리즘 개편 A/B 테스트 주도: 클릭률(CTR) 24% 상승, 구매 전환율(CVR) 2.1%p 개선\n• 장바구니 간편결제 1-Click 체크아웃 런칭으로 결제 이탈률 18% 감소 및 연간 결제액 420억 견인\n• 데이터 분석 파이프라인(Amplitude, BigQuery) 기반 일간 대시보드 구축 및 가설 검증 문화 정착',
            tags: ['B2C 커머스', 'A/B 테스트', '전환율 최적화', '스쿼드 리드'],
          }),
          makeItem('pm-exp-2', {
            title: '클라우드웍스 코리아',
            subtitle: 'B2B 프로덕트팀 · 프로덕트 매니저',
            startDate: '2019.01',
            endDate: '2022.03',
            isCurrent: false,
            location: '서울',
            description:
              '• 협업 툴 SaaS 엔터프라이즈 플랜 기획 및 고객 온보딩 퍼널 최적화\n• 기업용 권한 관리 및 SSO 보안 기능 출시로 엔터프라이즈 유료 전환율 31% 상승\n• 매월 15개 엔터프라이즈 고객사 인터뷰 진행을 통해 핵심 기능 우선순위 매트릭스 도출',
            tags: ['B2B SaaS', '엔터프라이즈', '고객 온보딩'],
          }),
        ],
      },
      {
        id: 'pm-sec-proj',
        type: 'projects',
        title: '주요 프로젝트',
        visible: true,
        column: 'main',
        items: [
          makeItem('pm-proj-1', {
            title: '개인화 큐레이션 홈 피드 전면 개편',
            subtitle: '리드 PO · 기획 및 성과 분석',
            startDate: '2023.05',
            endDate: '2023.11',
            description:
              '• 문제 정의: 홈 화면 체류 시간이 감소하고 프로모션 배너 클릭 집중 현상 발생\n• 해결 방안: 사용자 행동 태그 기반 머신러닝 피드 도입 및 4개 그룹 분할 A/B 테스트 진행\n• 성과: 메인 피드 인당 노출 상품 수 3.2배 증가, 홈 경유 거래액(GMV) 38% 성장 기록',
            tags: ['개인화 추천', 'A/B Test', 'Amplitude'],
          }),
        ],
      },
      {
        id: 'pm-sec-skills',
        type: 'skills',
        title: '보유 역량 및 도구',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('pm-sk-1', {
            title: '프로덕트 역량',
            tags: ['Product Strategy', 'Roadmapping', 'Agile/Scrum', 'User Interview', 'A/B Testing'],
          }),
          makeItem('pm-sk-2', {
            title: '데이터 및 툴',
            tags: ['SQL', 'Amplitude', 'Mixpanel', 'BigQuery', 'Jira', 'Figma', 'Tableau'],
          }),
        ],
      },
      {
        id: 'pm-sec-edu',
        type: 'education',
        title: '학력 사항',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('pm-edu-1', {
            title: '연세대학교',
            subtitle: '경영학 학사 (경영정보학 복수전공)',
            startDate: '2014.03',
            endDate: '2019.02',
            location: '서울',
            description: '• 졸업 평점: 3.92 / 4.5',
          }),
        ],
      },
    ],
    design: {
      ...DEFAULT_DESIGN_SETTINGS,
      layoutStructure: 'two-col-right',
      sidebarRatio: 30,
      accentColor: '#0f766e',
      headingStyle: 'underline-accent',
    },
  },

  // 3. 프로덕트 디자이너 (UI/UX)
  {
    id: 'sample-resume-designer',
    name: '이지우 — 프로덕트 디자이너 (UI/UX)',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    personal: {
      fullName: '이지우',
      jobTitle: 'Senior Product Designer',
      email: 'jiwoo.lee@maxcv.dev',
      phone: '010-3948-2819',
      location: '서울 강남구',
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
          id: 'des-link-1',
          platform: 'website',
          label: 'jiwoo-design.work',
          url: 'https://jiwoo-design.work',
        },
        {
          id: 'des-link-2',
          platform: 'other',
          label: 'behance.net/jiwoolee',
          url: 'https://behance.net',
        },
      ],
      customFields: [],
    },
    sections: [
      {
        id: 'des-sec-profile',
        type: 'profile',
        title: '소개',
        visible: true,
        column: 'main',
        items: [
          makeItem('des-prof-1', {
            title: '복잡한 비즈니스 로직을 명쾌하고 감각적인 인터페이스로 풀어냅니다',
            description:
              '• 6년 차 프로덕트 디자이너로 토큰 기반 글로벌 디자인 시스템 구축과 모바일 핀테크 UX를 설계했습니다.\n• 사용자의 숨겨진 니즈를 UT(User Testing)와 데이터로 검증하며, 디자인 가치와 비즈니스 수치를 함께 증명합니다.\n• 엔지니어와의 긴밀한 협업을 위해 스토리북(Storybook) 및 디자인-코드 싱크 자동화 파이프라인을 운영합니다.',
          }),
        ],
      },
      {
        id: 'des-sec-exp',
        type: 'experience',
        title: '경력 사항',
        visible: true,
        column: 'main',
        items: [
          makeItem('des-exp-1', {
            title: '토스페이먼츠 계열 핀테크',
            subtitle: '프로덕트 디자인팀 · 시니어 프로덕트 디자이너',
            startDate: '2022.01',
            isCurrent: true,
            location: '서울',
            description:
              '• 가맹점 정산 관리 콘솔 및 모바일 결제 SDK 인터페이스 전면 리디자인\n• 결제 승인 인터페이스 단계 간소화(3단계 → 1단계)로 결제 완료율 8.7% 상승 달성\n• 50여 개 디자인 컴포넌트와 토큰으로 구성된 사내 디자인 시스템(DS) 파운데이션 재설계',
            tags: ['Design System', 'Fintech UX', 'Figma Tokens'],
          }),
          makeItem('des-exp-2', {
            title: '하이퍼커넥트 계열',
            subtitle: '인터랙션 디자인팀 · UI/UX 디자이너',
            startDate: '2019.06',
            endDate: '2021.12',
            isCurrent: false,
            location: '서울',
            description:
              '• 글로벌 소셜 라이브 앱 신규 인터랙션 피처 디자인 및 온보딩 퍼널 개선\n• 마이크로 인터랙션(Lottie) 도입으로 피드 참여율(Engagement) 22% 견인',
            tags: ['Micro Interaction', 'Lottie', 'Mobile App'],
          }),
        ],
      },
      {
        id: 'des-sec-proj',
        type: 'projects',
        title: '주요 디자인 프로젝트',
        visible: true,
        column: 'main',
        items: [
          makeItem('des-proj-1', {
            title: '크로스 플랫폼 디자인 시스템(Aura DS) 구축',
            subtitle: '리드 디자이너 · 웹/iOS/Android 공통 토큰 체계 수립',
            startDate: '2023.03',
            endDate: '2023.10',
            description:
              '• 디자인과 프론트엔드 코드 간 스타일 드리프트 해결을 위해 Figma Variables 기반 시맨틱 토큰 120종 구축\n• 신규 피처 개발 시 UI 제작 공수 45% 단축, 디자이너-개발자 간 QA 커뮤니케이션 비용 60% 절감',
            tags: ['Figma Tokens', 'Semantic Color', 'Accessibility (WCAG 2.1)'],
          }),
        ],
      },
      {
        id: 'des-sec-skills',
        type: 'skills',
        title: '전문 분야 & 툴',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('des-sk-1', {
            title: 'Design Skills',
            tags: ['UI/UX', 'Design System', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing'],
          }),
          makeItem('des-sk-2', {
            title: 'Tools',
            tags: ['Figma', 'ProtoPie', 'After Effects', 'Lottie', 'Maze', 'Notion'],
          }),
        ],
      },
      {
        id: 'des-sec-edu',
        type: 'education',
        title: '학력',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('des-edu-1', {
            title: '홍익대학교',
            subtitle: '시각디자인전공 학사',
            startDate: '2015.03',
            endDate: '2019.02',
            isCurrent: false,
            location: '서울',
          }),
        ],
      },
    ],
    design: {
      ...DEFAULT_DESIGN_SETTINGS,
      layoutStructure: 'two-col-left',
      sidebarRatio: 32,
      accentColor: '#4f46e5',
      headingFontId: 'suit',
      bodyFontId: 'suit',
      headingStyle: 'left-bar',
    },
  },

  // 4. 마케터 / 그로스 (Growth Marketer)
  {
    id: 'sample-resume-marketer',
    name: '최현우 — 그로스 마케터 (Growth Marketer)',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    personal: {
      fullName: '최현우',
      jobTitle: 'Lead Growth Marketer',
      email: 'hyunwoo.choi@maxcv.dev',
      phone: '010-8291-7482',
      location: '서울 마포구',
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
          id: 'mkt-link-1',
          platform: 'linkedin',
          label: 'linkedin.com/in/growth-hyunwoo',
          url: 'https://linkedin.com',
        },
      ],
      customFields: [],
    },
    sections: [
      {
        id: 'mkt-sec-profile',
        type: 'profile',
        title: '전문성 요약',
        visible: true,
        column: 'main',
        items: [
          makeItem('mkt-prof-1', {
            title: '데이터 기반 퍼널 최적화와 CAC 절감으로 지속 가능한 성장을 만듭니다',
            description:
              '• 7년 차 퍼포먼스 & 그로스 마케터로 월 예산 3억 원 이상의 퍼포먼스 광고 및 오가닉 인바운드 루프를 운영했습니다.\n• 인스톨-가입-첫 결제-리텐션 전 주기 퍼널을 추적하고 전환율 병목을 해소하여 CAC 42% 절감, ROAS 380%를 달성했습니다.\n• CRM 자동화 시나리오(Braze) 설계로 30일 리텐션을 18.5%에서 31.2%로 견인했습니다.',
          }),
        ],
      },
      {
        id: 'mkt-sec-exp',
        type: 'experience',
        title: '경력 사항',
        visible: true,
        column: 'main',
        items: [
          makeItem('mkt-exp-1', {
            title: '직방/다방 계열 프롭테크',
            subtitle: '그로스마케팅팀 · 그로스 마케팅 리드',
            startDate: '2022.02',
            isCurrent: true,
            location: '서울',
            description:
              '• 월 집행 예산 4억 원 규모 멀티채널(Meta, Google, Naver, TikTok) 퍼포먼스 캠페인 총괄\n• 앱 인스톨 전환 캠페인 및 온보딩 CRM 시나리오 개편: 첫 매물 문의 전환율 28% 개선\n• MMP(AppsFlyer) 어트리뷰션 정합성 검증 및 SKAN 4.0 대응 파이프라인 구축',
            tags: ['Growth Hacking', 'Performance Marketing', 'AppsFlyer', 'Braze'],
          }),
          makeItem('mkt-exp-2', {
            title: '패션 커머스 스타트업',
            subtitle: '퍼포먼스 마케팅팀 · 마케터',
            startDate: '2018.09',
            endDate: '2022.01',
            isCurrent: false,
            location: '서울',
            description:
              '• Meta DPA(다이내믹 광고) 및 구글 PMax 캠페인 세팅 및 소재 A/B 테스트 매주 20건 이상 진행\n• 분기 ROAS 240% → 380% 달성, 신규 구매자 획득 비용(CAC) 35% 절감',
            tags: ['ROAS 최적화', 'Meta Ads', 'Google Ads'],
          }),
        ],
      },
      {
        id: 'mkt-sec-proj',
        type: 'projects',
        title: '주요 성과 프로젝트',
        visible: true,
        column: 'main',
        items: [
          makeItem('mkt-proj-1', {
            title: '휴면 유저 재활성화 CRM 자동화 여정 구축',
            subtitle: 'Braze 기반 이벤트 트리거 푸시 & 인앱 메시지 설계',
            startDate: '2023.04',
            endDate: '2023.09',
            isCurrent: false,
            description:
              '• 최근 30일 미접속 유저의 이전 검색 패턴에 따른 맞춤 할인 쿠폰 자동 발송 파이프라인 수립\n• 재방문율 14.8%p 증가 및 휴면 유저 거래액(GMV) 월 1.8억 원 순증 창출',
            tags: ['CRM Marketing', 'Braze', 'Retention Optimization'],
          }),
        ],
      },
      {
        id: 'mkt-sec-skills',
        type: 'skills',
        title: '도구 & 마케팅 스택',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('mkt-sk-1', {
            title: 'Analytics & MMP',
            tags: ['GA4', 'AppsFlyer', 'Airbridge', 'Amplitude', 'SQL', 'GTM'],
          }),
          makeItem('mkt-sk-2', {
            title: 'Ads & CRM',
            tags: ['Meta Ads Manager', 'Google Ads', 'Naver GFA', 'Braze', 'Stibee'],
          }),
        ],
      },
      {
        id: 'mkt-sec-edu',
        type: 'education',
        title: '학력',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('mkt-edu-1', {
            title: '중앙대학교',
            subtitle: '광고홍보학과 학사',
            startDate: '2014.03',
            endDate: '2019.02',
            isCurrent: false,
            location: '서울',
          }),
        ],
      },
    ],
    design: {
      ...DEFAULT_DESIGN_SETTINGS,
      layoutStructure: 'two-col-right',
      sidebarRatio: 30,
      accentColor: '#ea580c',
      headingStyle: 'underline-accent',
    },
  },

  // 5. 비즈니스 / 전략 기획 (Business Development & Strategy)
  {
    id: 'sample-resume-business',
    name: '정유진 — 전략기획 및 사업개발 (BD)',
    updatedAt: new Date().toISOString(),
    language: 'ko',
    personal: {
      fullName: '정유진',
      jobTitle: 'Business Development & Strategy Manager',
      email: 'yujin.jung@maxcv.dev',
      phone: '010-5192-3847',
      location: '서울 영등포구',
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
          id: 'biz-link-1',
          platform: 'linkedin',
          label: 'linkedin.com/in/yujin-bizstrategy',
          url: 'https://linkedin.com',
        },
      ],
      customFields: [],
    },
    sections: [
      {
        id: 'biz-sec-profile',
        type: 'profile',
        title: 'Professional Summary',
        visible: true,
        column: 'main',
        items: [
          makeItem('biz-prof-1', {
            title: '신규 비즈니스 모델 발굴과 전략적 제휴로 기업의 퀀텀 점프를 이끕니다',
            description:
              '• 8년 차 전략 기획 및 사업개발(BD) 매니저로 시리즈 B~C 스타트업의 신사업 기획, 제휴 계약, 파이낸셜 모델링을 주도했습니다.\n• 대기업·금융사와의 12건 이상의 전략적 파트너십을 체결하여 연간 신규 매출 180억 원을 창출했습니다.\n• 정량적 시장 분석(TAM/SAM/SOM)과 경쟁사 벤치마킹을 기반으로 경영진의 핵심 의사결정을 지원합니다.',
          }),
        ],
      },
      {
        id: 'biz-sec-exp',
        type: 'experience',
        title: '경력 사항',
        visible: true,
        column: 'main',
        items: [
          makeItem('biz-exp-1', {
            title: '모빌리티 플랫폼 유니콘',
            subtitle: '사업전략실 · 시니어 사업개발 매니저',
            startDate: '2021.08',
            isCurrent: true,
            location: '서울',
            description:
              '• 기업 전용 B2B 법인 멤버십 서비스 기획 및 런칭: 대기업 40여 개사 계약 체결 (연 ARR 85억 원 달성)\n• 국내 1위 완성차 제조사와의 커넥티드 카 데이터 제휴 계약 체결 및 공동 프로모션 주도\n• 신규 수익 모델(광고 솔루션 및 부가서비스) 발굴로 영업이익률 4.2%p 개선 기여',
            tags: ['B2B 사업개발', '전략적 제휴', '신사업 기획', 'ARR 성장'],
          }),
          makeItem('biz-exp-2', {
            title: '글로벌 전략컨설팅펌',
            subtitle: '전략기획본부 · 컨설턴트 (Associate)',
            startDate: '2017.03',
            endDate: '2021.07',
            isCurrent: false,
            location: '서울',
            description:
              '• 국내 5대 그룹사 대상 디지털 전환(DX) 전략 수립 및 신사업 포트폴리오 재편 프로젝트 수행\n• M&A 타겟 기업 실사(CDD) 및 파이낸셜 시뮬레이션 모델 10건 이상 도출',
            tags: ['Management Consulting', 'CDD', 'Financial Modeling'],
          }),
        ],
      },
      {
        id: 'biz-sec-proj',
        type: 'projects',
        title: '주요 사업개발 성과',
        visible: true,
        column: 'main',
        items: [
          makeItem('biz-proj-1', {
            title: 'B2B 법인 카셰어링 구독 서비스 0 to 1 빌딩',
            subtitle: '사업 PM · 손익 모델 수립 및 핵심 파트너십 총괄',
            startDate: '2022.03',
            endDate: '2022.12',
            isCurrent: false,
            description:
              '• 고객 세그먼트 분석을 통해 기존 렌터카 대비 비용 절감 논리 구축 및 표준 계약 프로세스 수립\n• 출시 1년 만에 계약 고객사 120개 돌파, 서비스 단위 손익분기점(BEP) 조기 달성',
            tags: ['Subscription Model', 'BEP 달성', 'Sales Strategy'],
          }),
        ],
      },
      {
        id: 'biz-sec-skills',
        type: 'skills',
        title: '핵심 역량',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('biz-sk-1', {
            title: 'Strategy & BD',
            tags: ['Market Sizing', 'Financial Modeling', 'Deal Structuring', 'B2B Sales Strategy', 'Cross-functional Alignment'],
          }),
          makeItem('biz-sk-2', {
            title: 'Tools & Lang',
            tags: ['Excel Financial Model', 'PPT Proposal', 'Tableau', 'English (Fluent)'],
          }),
        ],
      },
      {
        id: 'biz-sec-edu',
        type: 'education',
        title: '학력',
        visible: true,
        column: 'sidebar',
        items: [
          makeItem('biz-edu-1', {
            title: '고려대학교',
            subtitle: '경제학과 학사',
            startDate: '2012.03',
            endDate: '2017.02',
            isCurrent: false,
            location: '서울',
          }),
        ],
      },
    ],
    design: {
      ...DEFAULT_DESIGN_SETTINGS,
      templatePresetId: 'classic-serif',
      headingFontId: 'maruburi',
      bodyFontId: 'kopub-batang',
      layoutStructure: 'single',
      accentColor: '#1e3a8a',
      headingStyle: 'underline-full',
    },
  },
];
