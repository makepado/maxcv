export type FontCategory = 'sans' | 'serif' | 'display' | 'mono';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export interface KoreanFontOption {
  id: string;
  nameKo: string;
  nameEn: string;
  category: FontCategory;
  cssFamily: string;
  description: string;
  sampleText: string;
  weights: number[];
  recommendedFor: string;
}

export type SectionType =
  | 'profile'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'awards'
  | 'publications'
  | 'courses'
  | 'volunteering'
  | 'organizations'
  | 'interests'
  | 'references'
  | 'custom';

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'website' | 'blog' | 'velog' | 'notion' | 'twitter' | 'scholar' | 'other';
  label: string;
  url: string;
}

export interface CustomPersonalField {
  id: string;
  label: string;
  value: string;
}

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  nationality: string;
  militaryOrVisa: string;
  photoUrl: string;
  showPhoto: boolean;
  photoShape: 'circle' | 'rounded' | 'square';
  photoSize: number; // 64 to 130 px
  photoGrayscale: boolean;
  links: SocialLink[];
  customFields: CustomPersonalField[];
}

export interface SectionItem {
  id: string;
  visible: boolean;
  // 공통 주 필드
  title: string;        // 회사명, 학교명, 프로젝트명, 스킬 그룹명, 자격증명, 수상명, 논문 제목 등
  subtitle: string;     // 직무/역할, 전공/학위, 발급기관, 수여기관, 저자/학술지 등
  startDate: string;    // 시작일 또는 단일 날짜
  endDate: string;      // 종료일
  isCurrent: boolean;   // 현재 재직/재학 중 여부
  location: string;     // 근무지, 소재지, 학점(GPA) 등 보조 메타
  url: string;          // 관련 링크 (프로젝트, 논문, 자격증 URL)
  urlLabel: string;     // 링크 표시 텍스트
  description: string;  // 상세 설명 (불릿 포인트 또는 문단)
  tags: string[];       // 기술 스택 태그, 키워드 목록
  level: number;        // 숙련도 1 ~ 5 (스킬/어학용)
  levelText: string;    // 숙련도 텍스트 (예: Native, Business, JLPT N1, OPIC AL, 고급 등)
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  column: 'main' | 'sidebar';
  layoutMode?: 'list' | 'grid-2' | 'grid-3' | 'tags' | 'compact';
  items: SectionItem[];
}

export type LayoutStructure = 'single' | 'two-col-left' | 'two-col-right';
export type HeaderLayout = 'left' | 'center' | 'right' | 'split';
export type HeadingStyle = 'underline-full' | 'underline-accent' | 'left-bar' | 'shaded-box' | 'caps-minimal' | 'icon-border';
export type SkillDisplayStyle = 'bars' | 'dots' | 'badge' | 'text-only' | 'compact-inline';
export type DatePositionStyle = 'right' | 'below-title' | 'inline';
export type DateFormatStyle = 'dot' | 'korean' | 'slash' | 'english';

export interface DesignSettings {
  templatePresetId: string;
  // 타이포그래피 & 한국어 폰트 디테일 설정
  headingFontId: string;
  bodyFontId: string;
  monoFontId: string;
  fontSizeScale: number;       // 0.8 ~ 1.25 (기본 1.0 = 10pt 기준)
  lineHeight: number;          // 1.25 ~ 1.85 (기본 1.5)
  letterSpacing: number;       // -0.04 ~ 0.06 em (한글 자간 미세조절)
  headingWeight: 500 | 600 | 700 | 800;
  bodyWeight: 300 | 400 | 500;
  wordBreakKeepAll: boolean;   // 한글 단어 끊김 방지 (word-break: keep-all)

  // 레이아웃 및 여백
  layoutStructure: LayoutStructure;
  sidebarRatio: number;        // 26 ~ 44 (%)
  pageMarginTopBottom: number; // 10 ~ 28 (mm)
  pageMarginLeftRight: number; // 10 ~ 28 (mm)
  sectionGap: number;          // 10 ~ 32 (px)
  entryGap: number;            // 6 ~ 22 (px)
  paperSize: 'A4' | 'LETTER';

  // 헤더 및 섹션 스타일
  headerLayout: HeaderLayout;
  headerBgStyle: 'none' | 'tinted' | 'solid-accent' | 'bottom-border';
  showHeaderIcons: boolean;
  headerSeparator: 'none' | 'pipe' | 'dot' | 'slash' | 'bullet';
  headingStyle: HeadingStyle;
  showSectionIcons: boolean;
  skillDisplayStyle: SkillDisplayStyle;
  datePosition: DatePositionStyle;
  dateFormat: DateFormatStyle;
  linkShowFullUrl: boolean;
  showPageBreakGuides: boolean;

  // 색상 테마
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  mutedTextColor: string;
  sidebarBgColor: string;
  sidebarTextColor: string;
}

export interface CVDocument {
  id: string;
  name: string;
  updatedAt: string;
  language: 'ko' | 'en';
  personal: PersonalDetails;
  sections: CVSection[];
  design: DesignSettings;
}
