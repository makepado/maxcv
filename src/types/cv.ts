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
  hideTitle?: boolean;  // 개별 헤드라인 숨김 여부
  hideDescription?: boolean; // 개별 상세내용 숨김 여부
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  column: 'main' | 'sidebar';
  layoutMode?: 'list' | 'grid-2' | 'grid-3' | 'tags' | 'compact';
  items: SectionItem[];
  hideTitle?: boolean;           // 섹션 제목 숨김 여부
  hideItemTitle?: boolean;       // 섹션 내 모든 헤드라인 일괄 숨김 여부
  hideItemDescription?: boolean; // 섹션 내 모든 상세내용 일괄 숨김 여부
}

export type LayoutStructure = 'single' | 'two-col-left' | 'two-col-right';
export type HeaderLayout = 'left' | 'center' | 'right' | 'split';
export type HeadingStyle = 'underline-full' | 'underline-accent' | 'left-bar' | 'shaded-box' | 'caps-minimal' | 'icon-border';
export type SkillDisplayStyle = 'bars' | 'dots' | 'badge' | 'text-only' | 'compact-inline';
export type DatePositionStyle = 'right' | 'below-title' | 'inline';
export type DateFormatStyle = 'dot' | 'korean' | 'slash' | 'english';
export type BulletStyle = 'bullet' | 'dash' | 'number' | 'square' | 'none';

export interface DesignSettings {
  templatePresetId: string;
  // 타이포그래피 & 한국어 폰트 디테일 설정
  headingFontId: string;
  bodyFontId: string;
  monoFontId: string;
  fontSizeScale: number;       // 0.8 ~ 1.25 (전체 기준)
  lineHeight: number;          // 전체 기본 행간
  letterSpacing: number;       // 전체 기본 자간 (em)
  headingWeight: 500 | 600 | 700 | 800;
  bodyWeight: 300 | 400 | 500;
  wordBreakKeepAll: boolean;   // 한글 단어 끊김 방지 (word-break: keep-all)

  // 프로필 헤더 개별 타이포그래피 (px, lineHeight, letterSpacing in em)
  nameFontSizePx?: number;        // 기본 28px
  nameLineHeight?: number;        // 기본 1.2
  nameLetterSpacing?: number;     // 기본 -0.02 em
  jobTitleFontSizePx?: number;    // 기본 16px
  jobTitleLineHeight?: number;    // 기본 1.3
  jobTitleLetterSpacing?: number; // 기본 -0.01 em
  contactFontSizePx?: number;     // 기본 12px
  contactLineHeight?: number;     // 기본 1.4
  contactLetterSpacing?: number;  // 기본 0 em

  // 섹션별 개별 타이포그래피 (px, lineHeight, letterSpacing in em)
  sectionHeaderFontSizePx?: number;    // 기본 16px (섹션 제목: 경력, 학력 등)
  sectionHeaderLineHeight?: number;    // 기본 1.3
  sectionHeaderLetterSpacing?: number; // 기본 -0.01 em
  itemTitleFontSizePx?: number;        // 기본 14px (항목 헤드라인: 회사명, 학교명, 프로젝트명 등)
  itemTitleLineHeight?: number;        // 기본 1.3
  itemTitleLetterSpacing?: number;     // 기본 -0.01 em
  itemDescFontSizePx?: number;         // 기본 12.5px (상세 내용 및 불릿)
  itemDescLineHeight?: number;         // 기본 1.55
  itemDescLetterSpacing?: number;      // 기본 0 em
  tagFontSizePx?: number;              // 기본 11px (태그/키워드)
  tagLineHeight?: number;              // 기본 1.2
  tagLetterSpacing?: number;           // 기본 0 em

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
  headerTitleLayout: 'stack' | 'inline'; // 'stack': 이름 아래 직무, 'inline': 이름 옆에 직무
  nameAlign?: 'left' | 'center' | 'right';
  jobTitleAlign?: 'left' | 'center' | 'right';
  contactAlign?: 'left' | 'center' | 'right';
  headerBgStyle: 'none' | 'tinted' | 'solid-accent' | 'bottom-border';
  showHeaderIcons: boolean;
  headerSeparator: 'none' | 'pipe' | 'dot' | 'slash' | 'bullet';
  headingStyle: HeadingStyle;
  showSectionIcons: boolean;
  skillDisplayStyle: SkillDisplayStyle;
  bulletStyle?: BulletStyle;
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

export type DocType = 'resume' | 'career';

export interface CVDocument {
  id: string;
  name: string;
  updatedAt: string;
  language: 'ko' | 'en';
  docType?: DocType; // 'resume': 이력서, 'career': 경력기술서 (미지정 시 이력서)
  personal: PersonalDetails;
  sections: CVSection[];
  design: DesignSettings;
}
