import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Flag,
  ShieldCheck,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Languages,
  Award,
  FileCheck2,
  BookMarked,
  HeartHandshake,
  Building2,
  Sparkles,
  Users,
  UserCheck,
  Layers,
} from 'lucide-react';
import {
  CVDocument,
  CVSection,
  DesignSettings,
  SectionItem,
  SectionType,
  SocialLink,
} from '../types/cv';
import { getFontById } from '../constants/fonts';

interface CVPreviewCanvasProps {
  doc: CVDocument;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatSingleDate(raw: string, format: DesignSettings['dateFormat']): string {
  if (!raw || !raw.trim()) return '';
  const cleaned = raw.trim();
  const match = cleaned.match(/^(\d{4})[.\-/년\s]*(\d{1,2})?/);
  if (!match) return cleaned;
  const year = match[1];
  const monthNum = match[2] ? parseInt(match[2], 10) : null;
  if (!monthNum || monthNum < 1 || monthNum > 12) return year;
  const paddedMonth = String(monthNum).padStart(2, '0');

  switch (format) {
    case 'dot':
      return `${year}.${paddedMonth}`;
    case 'slash':
      return `${year}/${paddedMonth}`;
    case 'korean':
      return `${year}년 ${monthNum}월`;
    case 'english':
      return `${MONTHS_EN[monthNum - 1]} ${year}`;
    default:
      return `${year}.${paddedMonth}`;
  }
}

function formatDateRange(
  startDate: string,
  endDate: string,
  isCurrent: boolean,
  format: DesignSettings['dateFormat'],
  lang: 'ko' | 'en'
): string {
  const start = formatSingleDate(startDate, format);
  const currentLabel = lang === 'en' || format === 'english' ? 'Present' : '현재';
  const end = isCurrent ? currentLabel : formatSingleDate(endDate, format);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
}

function getSectionIcon(type: SectionType) {
  switch (type) {
    case 'profile':
      return <UserCheck className="w-4 h-4 shrink-0" />;
    case 'experience':
      return <Briefcase className="w-4 h-4 shrink-0" />;
    case 'education':
      return <GraduationCap className="w-4 h-4 shrink-0" />;
    case 'projects':
      return <FolderGit2 className="w-4 h-4 shrink-0" />;
    case 'skills':
      return <Cpu className="w-4 h-4 shrink-0" />;
    case 'languages':
      return <Languages className="w-4 h-4 shrink-0" />;
    case 'certificates':
      return <FileCheck2 className="w-4 h-4 shrink-0" />;
    case 'awards':
      return <Award className="w-4 h-4 shrink-0" />;
    case 'publications':
      return <BookMarked className="w-4 h-4 shrink-0" />;
    case 'courses':
      return <BookOpen className="w-4 h-4 shrink-0" />;
    case 'volunteering':
      return <HeartHandshake className="w-4 h-4 shrink-0" />;
    case 'organizations':
      return <Building2 className="w-4 h-4 shrink-0" />;
    case 'interests':
      return <Sparkles className="w-4 h-4 shrink-0" />;
    case 'references':
      return <Users className="w-4 h-4 shrink-0" />;
    default:
      return <Layers className="w-4 h-4 shrink-0" />;
  }
}

function getSocialIcon(platform: SocialLink['platform']) {
  switch (platform) {
    case 'github':
      return <Github className="w-3.5 h-3.5 shrink-0" />;
    case 'linkedin':
      return <Linkedin className="w-3.5 h-3.5 shrink-0" />;
    case 'scholar':
    case 'blog':
    case 'velog':
    case 'notion':
      return <BookOpen className="w-3.5 h-3.5 shrink-0" />;
    default:
      return <Globe className="w-3.5 h-3.5 shrink-0" />;
  }
}

function renderFormattedDescription(text: string) {
  if (!text || !text.trim()) return null;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className="space-y-1 mt-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet =
          trimmed.startsWith('•') ||
          trimmed.startsWith('-') ||
          trimmed.startsWith('*');
        const cleanText = isBullet ? trimmed.replace(/^[•\-*]\s*/, '') : trimmed;

        if (isBullet) {
          return (
            <div key={i} className="flex items-start gap-1.5">
              <span className="select-none opacity-75 mt-[1px]">•</span>
              <span className="flex-1">{cleanText}</span>
            </div>
          );
        }
        return <p key={i}>{cleanText}</p>;
      })}
    </div>
  );
}

export const CVPreviewCanvas: React.FC<CVPreviewCanvasProps> = ({ doc }) => {
  const { personal, sections, design } = doc;
  const headingFont = getFontById(design.headingFontId);
  const bodyFont = getFontById(design.bodyFontId);

  const baseFontSizePt = 10 * design.fontSizeScale;
  const visibleSections = sections.filter((s) => s.visible);

  const mainSections =
    design.layoutStructure === 'single'
      ? visibleSections
      : visibleSections.filter((s) => s.column === 'main');

  const sidebarSections =
    design.layoutStructure === 'single'
      ? []
      : visibleSections.filter((s) => s.column === 'sidebar');

  const renderSectionHeading = (section: CVSection, inSidebar = false) => {
    const accent = inSidebar ? design.accentColor : design.accentColor;
    const textCol = inSidebar ? design.sidebarTextColor : design.textColor;

    const baseHeadingStyle: React.CSSProperties = {
      fontFamily: headingFont.cssFamily,
      fontWeight: design.headingWeight,
      letterSpacing: `${design.letterSpacing}em`,
      fontSize: `${baseFontSizePt * 1.18}pt`,
    };

    if (design.headingStyle === 'underline-full') {
      return (
        <div
          className="cv-section-header flex items-center gap-2 pb-1.5 mb-2.5 border-b-2"
          style={{
            ...baseHeadingStyle,
            color: accent,
            borderColor: accent,
          }}
        >
          {design.showSectionIcons && (
            <span className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none">
              {getSectionIcon(section.type)}
            </span>
          )}
          <span className="tracking-tight leading-none">{section.title}</span>
        </div>
      );
    }

    if (design.headingStyle === 'underline-accent') {
      return (
        <div className="cv-section-header mb-2.5">
          <div
            className="flex items-center gap-2 pb-1.5"
            style={{ ...baseHeadingStyle, color: textCol }}
          >
            {design.showSectionIcons && (
              <span
                className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none"
                style={{ color: accent }}
              >
                {getSectionIcon(section.type)}
              </span>
            )}
            <span className="leading-none">{section.title}</span>
          </div>
          <div className="flex items-center w-full">
            <div className="h-[2.5px] w-10 rounded-full" style={{ backgroundColor: accent }} />
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>
        </div>
      );
    }

    if (design.headingStyle === 'left-bar') {
      return (
        <div
          className="cv-section-header flex items-center gap-2 pl-2.5 py-0.5 mb-2.5 border-l-4"
          style={{
            ...baseHeadingStyle,
            color: textCol,
            borderColor: accent,
          }}
        >
          {design.showSectionIcons && (
            <span
              className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none"
              style={{ color: accent }}
            >
              {getSectionIcon(section.type)}
            </span>
          )}
          <span className="leading-none">{section.title}</span>
        </div>
      );
    }

    if (design.headingStyle === 'shaded-box') {
      return (
        <div
          className="cv-section-header flex items-center gap-2 px-2.5 py-1.5 mb-2.5 rounded"
          style={{
            ...baseHeadingStyle,
            backgroundColor: `${accent}14`,
            color: accent,
          }}
        >
          {design.showSectionIcons && (
            <span className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none">
              {getSectionIcon(section.type)}
            </span>
          )}
          <span className="leading-none">{section.title}</span>
        </div>
      );
    }

    // caps-minimal or icon-border
    return (
      <div
        className="cv-section-header flex items-center gap-2 pb-1.5 mb-2.5 border-b border-slate-300 uppercase tracking-wider"
        style={{
          ...baseHeadingStyle,
          fontSize: `${baseFontSizePt * 1.05}pt`,
          color: accent,
        }}
      >
        {design.showSectionIcons && (
          <span className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none">
            {getSectionIcon(section.type)}
          </span>
        )}
        <span className="leading-none">{section.title}</span>
      </div>
    );
  };

  const renderSkillItem = (item: SectionItem, inSidebar: boolean) => {
    const style = design.skillDisplayStyle;
    const accent = design.accentColor;

    return (
      <div key={item.id} className="cv-entry-item">
        <div className="flex items-baseline justify-between gap-2">
          {item.title && (
            <span
              style={{
                fontFamily: headingFont.cssFamily,
                fontWeight: design.headingWeight,
                fontSize: `${baseFontSizePt * 0.98}pt`,
              }}
            >
              {item.title}
            </span>
          )}
          {item.levelText && style !== 'compact-inline' && (
            <span
              className="text-xs opacity-75 shrink-0"
              style={{ fontSize: `${baseFontSizePt * 0.85}pt` }}
            >
              {item.levelText}
            </span>
          )}
        </div>

        {item.subtitle && (
          <div
            className="opacity-80 mt-0.5"
            style={{ fontSize: `${baseFontSizePt * 0.9}pt` }}
          >
            {item.subtitle}
          </div>
        )}

        {/* 숙련도 바 (bars) */}
        {style === 'bars' && item.level > 0 && (
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5 mb-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.level / 5) * 100}%`,
                backgroundColor: accent,
              }}
            />
          </div>
        )}

        {/* 숙련도 도트 (dots) */}
        {style === 'dots' && item.level > 0 && (
          <div className="flex items-center gap-1 mt-1 mb-1">
            {[1, 2, 3, 4, 5].map((lv) => (
              <span
                key={lv}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: lv <= item.level ? accent : '#cbd5e1',
                }}
              />
            ))}
          </div>
        )}

        {/* 태그 목록 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.tags.map((tag, idx) =>
              style === 'text-only' || style === 'compact-inline' ? (
                <span key={idx} className="opacity-90">
                  {tag}
                  {idx < item.tags.length - 1 ? ' · ' : ''}
                </span>
              ) : (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded font-medium"
                  style={{
                    fontSize: `${baseFontSizePt * 0.84}pt`,
                    backgroundColor: inSidebar ? '#ffffff' : `${accent}12`,
                    color: inSidebar ? design.textColor : accent,
                    border: `1px solid ${accent}28`,
                  }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderStandardItem = (section: CVSection, item: SectionItem, inSidebar: boolean) => {
    if (section.type === 'skills' || section.type === 'languages' || section.type === 'interests') {
      return renderSkillItem(item, inSidebar);
    }

    const dateRange = formatDateRange(
      item.startDate,
      item.endDate,
      item.isCurrent,
      design.dateFormat,
      doc.language
    );

    const accent = design.accentColor;

    return (
      <div key={item.id} className="cv-entry-item">
        {/* 상단 타이틀 + 날짜 라인 */}
        <div
          className={`flex ${
            design.datePosition === 'right' && !inSidebar
              ? 'items-baseline justify-between gap-3'
              : 'flex-col'
          }`}
        >
          <div className="flex flex-wrap items-baseline gap-x-2">
            {item.title && (
              <h4
                style={{
                  fontFamily: headingFont.cssFamily,
                  fontWeight: design.headingWeight,
                  fontSize: `${baseFontSizePt * 1.05}pt`,
                }}
              >
                {item.title}
              </h4>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 hover:underline"
                style={{
                  color: accent,
                  fontSize: `${baseFontSizePt * 0.86}pt`,
                }}
              >
                <ExternalLink className="w-3 h-3" />
                <span>{design.linkShowFullUrl ? item.url : item.urlLabel || '링크'}</span>
              </a>
            )}
          </div>

          {(dateRange || item.location) && (
            <div
              className="shrink-0 opacity-75 font-medium"
              style={{ fontSize: `${baseFontSizePt * 0.88}pt` }}
            >
              {dateRange}
              {dateRange && item.location ? ' | ' : ''}
              {item.location}
            </div>
          )}
        </div>

        {/* 부제목 (직책, 전공, 기관 등) */}
        {item.subtitle && (
          <div
            className="font-medium mt-0.5"
            style={{
              color: design.mutedTextColor,
              fontSize: `${baseFontSizePt * 0.95}pt`,
            }}
          >
            {item.subtitle}
          </div>
        )}

        {/* 본문 설명 */}
        <div
          className="cv-rich-text opacity-95"
          style={{ fontSize: `${baseFontSizePt * 0.94}pt` }}
        >
          {renderFormattedDescription(item.description)}
        </div>

        {/* 기술 태그 칩 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded font-medium"
                style={{
                  fontSize: `${baseFontSizePt * 0.8}pt`,
                  backgroundColor: `${accent}12`,
                  color: accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionBlock = (section: CVSection, inSidebar = false) => {
    const visibleItems = section.items.filter((i) => i.visible);
    if (visibleItems.length === 0) return null;

    return (
      <section key={section.id} style={{ marginBottom: `${design.sectionGap}px` }}>
        {renderSectionHeading(section, inSidebar)}
        <div
          className=" flex flex-col"
          style={{ gap: `${design.entryGap}px` }}
        >
          {visibleItems.map((item) => renderStandardItem(section, item, inSidebar))}
        </div>
      </section>
    );
  };

  // 상단 개인정보 헤더 렌더링
  const renderPersonalHeader = () => {
    const isSolid = design.headerBgStyle === 'solid-accent';
    const isTinted = design.headerBgStyle === 'tinted';
    const isBottomBorder = design.headerBgStyle === 'bottom-border';

    const headerTextCol = isSolid ? '#ffffff' : design.textColor;
    const headerSubCol = isSolid ? 'rgba(255,255,255,0.88)' : design.mutedTextColor;
    const iconColor = isSolid ? '#ffffff' : design.accentColor;

    const alignClass =
      design.headerLayout === 'center'
        ? 'text-center items-center'
        : design.headerLayout === 'right'
        ? 'text-right items-end'
        : 'text-left items-start';

    const metaList = [
      personal.email && { icon: <Mail className="w-3.5 h-3.5 shrink-0" />, text: personal.email, href: `mailto:${personal.email}` },
      personal.phone && { icon: <Phone className="w-3.5 h-3.5 shrink-0" />, text: personal.phone, href: `tel:${personal.phone}` },
      personal.location && { icon: <MapPin className="w-3.5 h-3.5 shrink-0" />, text: personal.location },
      personal.birthDate && { icon: <Calendar className="w-3.5 h-3.5 shrink-0" />, text: personal.birthDate },
      personal.nationality && { icon: <Flag className="w-3.5 h-3.5 shrink-0" />, text: personal.nationality },
      personal.militaryOrVisa && { icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />, text: personal.militaryOrVisa },
    ].filter(Boolean) as { icon: React.ReactNode; text: string; href?: string }[];

    return (
      <header
        className={`transition-all ${
          isBottomBorder ? 'pb-4 border-b-2' : isSolid || isTinted ? 'p-6 rounded-md' : 'pb-3'
        }`}
        style={{
          marginBottom: `${design.sectionGap + 2}px`,
          backgroundColor: isSolid
            ? design.accentColor
            : isTinted
            ? `${design.accentColor}10`
            : 'transparent',
          borderColor: isBottomBorder ? design.accentColor : 'transparent',
          color: headerTextCol,
        }}
      >
        <div
          className={`flex gap-5 ${
            design.headerLayout === 'center'
              ? 'flex-col items-center'
              : design.headerLayout === 'right'
              ? 'flex-row-reverse justify-between items-center'
              : 'flex-row justify-between items-center'
          }`}
        >
          {/* 이름 & 직무 타이틀 & 연락처 */}
          <div className={`flex-1 flex flex-col ${alignClass}`}>
            <h1
              className="tracking-tight leading-tight"
              style={{
                fontFamily: headingFont.cssFamily,
                fontWeight: design.headingWeight,
                fontSize: `${baseFontSizePt * 2.15}pt`,
                letterSpacing: `${design.letterSpacing}em`,
              }}
            >
              {personal.fullName || '이름을 입력하세요'}
            </h1>

            {personal.jobTitle && (
              <p
                className="mt-1 font-medium"
                style={{
                  fontFamily: headingFont.cssFamily,
                  color: isSolid ? '#ffffff' : design.accentColor,
                  fontSize: `${baseFontSizePt * 1.18}pt`,
                }}
              >
                {personal.jobTitle}
              </p>
            )}

            {/* 연락처 및 소셜 링크 */}
            {(() => {
              const allHeaderItems: React.ReactNode[] = [];

              metaList.forEach((m, idx) => {
                allHeaderItems.push(
                  <div key={`meta-${idx}`} className="cv-header-meta-item inline-flex items-center gap-1.5 leading-none">
                    {design.showHeaderIcons !== false && (
                      <span
                        className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none"
                        style={{ color: iconColor }}
                      >
                        {m.icon}
                      </span>
                    )}
                    {m.href ? (
                      <a href={m.href} className="cv-inline-text hover:underline leading-none">
                        {m.text}
                      </a>
                    ) : (
                      <span className="cv-inline-text leading-none">{m.text}</span>
                    )}
                  </div>
                );
              });

              personal.customFields?.forEach((cf) => {
                if (cf.value) {
                  allHeaderItems.push(
                    <div key={`cf-${cf.id}`} className="cv-header-meta-item inline-flex items-center gap-1 leading-none">
                      <span className="font-semibold leading-none" style={{ color: iconColor }}>
                        {cf.label}:
                      </span>
                      <span className="leading-none">{cf.value}</span>
                    </div>
                  );
                }
              });

              personal.links.forEach((link) => {
                if (link.label || link.url) {
                  allHeaderItems.push(
                    <a
                      key={`link-${link.id}`}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="cv-header-meta-item inline-flex items-center gap-1.5 hover:underline font-medium leading-none"
                    >
                      {design.showHeaderIcons !== false && (
                        <span
                          className="cv-inline-icon inline-flex items-center justify-center shrink-0 leading-none"
                          style={{ color: iconColor }}
                        >
                          {getSocialIcon(link.platform)}
                        </span>
                      )}
                      <span className="cv-inline-text leading-none">
                        {design.linkShowFullUrl && link.url ? link.url : link.label || link.url}
                      </span>
                    </a>
                  );
                }
              });

              const sepChar =
                design.headerSeparator === 'pipe'
                  ? '|'
                  : design.headerSeparator === 'dot'
                  ? '·'
                  : design.headerSeparator === 'slash'
                  ? '/'
                  : design.headerSeparator === 'bullet'
                  ? '•'
                  : null;

              return (
                <div
                  className={`flex flex-wrap items-center ${
                    sepChar ? 'gap-x-2.5 gap-y-1.5' : 'gap-x-4 gap-y-1.5'
                  } mt-3 ${
                    design.headerLayout === 'center'
                      ? 'justify-center'
                      : design.headerLayout === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                  style={{
                    color: headerSubCol,
                    fontSize: `${baseFontSizePt * 0.88}pt`,
                  }}
                >
                  {allHeaderItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {sepChar && index < allHeaderItems.length - 1 && (
                        <span
                          className="select-none opacity-40 font-light leading-none"
                          style={{
                            fontSize: `${baseFontSizePt * 0.82}pt`,
                            color: isSolid ? 'rgba(255,255,255,0.6)' : design.mutedTextColor,
                          }}
                        >
                          {sepChar}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* 증명사진 / 프로필 이미지 */}
          {personal.showPhoto && personal.photoUrl && (
            <div className="shrink-0">
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className={`object-cover border-2 ${
                  personal.photoShape === 'circle'
                    ? 'rounded-full'
                    : personal.photoShape === 'rounded'
                    ? 'rounded-xl'
                    : 'rounded-none'
                } ${personal.photoGrayscale ? 'grayscale' : ''}`}
                style={{
                  width: `${personal.photoSize}px`,
                  height: `${personal.photoSize}px`,
                  borderColor: isSolid ? '#ffffff' : `${design.accentColor}40`,
                }}
              />
            </div>
          )}
        </div>
      </header>
    );
  };

  return (
    <div
      id="maxcv-printable-sheet"
      className="cv-page-sheet bg-white shadow-2xl relative mx-auto transition-all duration-200"
      style={{
        width: design.paperSize === 'LETTER' ? '215.9mm' : '210mm',
        minHeight: design.paperSize === 'LETTER' ? '279.4mm' : '297mm',
        paddingTop: `${design.pageMarginTopBottom}mm`,
        paddingBottom: `${design.pageMarginTopBottom}mm`,
        paddingLeft: `${design.pageMarginLeftRight}mm`,
        paddingRight: `${design.pageMarginLeftRight}mm`,
        fontFamily: bodyFont.cssFamily,
        fontWeight: design.bodyWeight,
        fontSize: `${baseFontSizePt}pt`,
        lineHeight: design.lineHeight,
        letterSpacing: `${design.letterSpacing}em`,
        color: design.textColor,
        wordBreak: design.wordBreakKeepAll ? 'keep-all' : 'normal',
      }}
    >
      {/* A4 1페이지 경계선 안내 가이드 (인쇄 시에는 숨김) */}
      {design.showPageBreakGuides && (
        <div
          className="no-print pointer-events-none absolute left-0 right-0 border-b-2 border-dashed border-rose-400/70 z-20 flex justify-end pr-3"
          style={{ top: design.paperSize === 'LETTER' ? '279.4mm' : '297mm' }}
        >
          <span className="bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-t">
            1페이지 끝 (A4 Page Break)
          </span>
        </div>
      )}

      {/* 상단 개인 프로필 헤더 */}
      {renderPersonalHeader()}

      {/* 본문 레이아웃: 1단 vs 2단 */}
      {design.layoutStructure === 'single' ? (
        <div>{mainSections.map((sec) => renderSectionBlock(sec, false))}</div>
      ) : (
        <div
          className={`flex gap-6 ${
            design.layoutStructure === 'two-col-left' ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          {/* 사이드바 영역 */}
          <aside
            className="shrink-0 rounded-md p-4"
            style={{
              width: `${design.sidebarRatio}%`,
              backgroundColor: design.sidebarBgColor,
              color: design.sidebarTextColor,
            }}
          >
            {sidebarSections.length > 0 ? (
              sidebarSections.map((sec) => renderSectionBlock(sec, true))
            ) : (
              <div className="no-print text-xs text-slate-400 py-6 text-center border border-dashed border-slate-300 rounded">
                콘텐츠 탭에서 섹션의 [사이드바 배치] 버튼을 눌러 이곳으로 이동할 수 있습니다.
              </div>
            )}
          </aside>

          {/* 메인 영역 */}
          <main className="flex-1 min-w-0">
            {mainSections.map((sec) => renderSectionBlock(sec, false))}
          </main>
        </div>
      )}
    </div>
  );
};
