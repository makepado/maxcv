import React, { useState } from 'react';
import {
  User,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Copy,
  Columns,
  Link2,
  Camera,
  Sparkles,
  Tag,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { SECTION_CATALOG } from '../constants/defaultCv';
import { CVSection, SectionItem, SocialLink } from '../types/cv';

export const ContentEditorPanel: React.FC = () => {
  const doc = useCVStore((s) => s.getActiveDocument());
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const addSection = useCVStore((s) => s.addSection);
  const updateSection = useCVStore((s) => s.updateSection);
  const removeSection = useCVStore((s) => s.removeSection);
  const moveSectionOrder = useCVStore((s) => s.moveSectionOrder);
  const toggleSectionColumn = useCVStore((s) => s.toggleSectionColumn);

  const addSectionItem = useCVStore((s) => s.addSectionItem);
  const updateSectionItem = useCVStore((s) => s.updateSectionItem);
  const removeSectionItem = useCVStore((s) => s.removeSectionItem);
  const duplicateSectionItem = useCVStore((s) => s.duplicateSectionItem);
  const moveSectionItemOrder = useCVStore((s) => s.moveSectionItemOrder);

  const [personalOpen, setPersonalOpen] = useState<boolean>(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [doc.sections[0]?.id || '']: true,
    [doc.sections[1]?.id || '']: true,
  });
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});

  const toggleSectionAccordion = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updatePersonal({ photoUrl: reader.result, showPhoto: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const addSocialLink = () => {
    const nextLinks: SocialLink[] = [
      ...doc.personal.links,
      {
        id: `link-${Date.now()}`,
        platform: 'github',
        label: 'github.com/username',
        url: 'https://github.com/',
      },
    ];
    updatePersonal({ links: nextLinks });
  };

  const updateSocialLink = (id: string, patch: Partial<SocialLink>) => {
    updatePersonal({
      links: doc.personal.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  };

  const removeSocialLink = (id: string) => {
    updatePersonal({
      links: doc.personal.links.filter((l) => l.id !== id),
    });
  };

  const addCustomField = () => {
    updatePersonal({
      customFields: [
        ...(doc.personal.customFields || []),
        { id: `cf-${Date.now()}`, label: '기타', value: '' },
      ],
    });
  };

  const handleAddTag = (sectionId: string, item: SectionItem) => {
    const raw = tagInputs[item.id]?.trim();
    if (!raw) return;
    const newTags = raw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !item.tags.includes(t));
    if (newTags.length > 0) {
      updateSectionItem(sectionId, item.id, { tags: [...item.tags, ...newTags] });
    }
    setTagInputs((prev) => ({ ...prev, [item.id]: '' }));
  };

  const handleRemoveTag = (sectionId: string, item: SectionItem, idx: number) => {
    updateSectionItem(sectionId, item.id, {
      tags: item.tags.filter((_, i) => i !== idx),
    });
  };

  // 텍스트 서식 래퍼 적용 (볼드 **, 기울임 *, 밑줄 <u></u>)
  const applyFormatWrapper = (
    textarea: HTMLTextAreaElement | null,
    sectionId: string,
    itemId: string,
    prefix: string,
    suffix: string,
    placeholder: string
  ) => {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value || '';
    const selected = val.substring(start, end);

    let nextVal = '';
    let newStart = 0;
    let newEnd = 0;

    if (selected.length > 0) {
      // 선택 영역이 이미 prefix/suffix로 감싸져 있으면 제거(토글), 아니면 감싸기
      if (
        val.substring(start - prefix.length, start) === prefix &&
        val.substring(end, end + suffix.length) === suffix
      ) {
        // 앞뒤 마크 제거
        const before = val.substring(0, start - prefix.length);
        const after = val.substring(end + suffix.length);
        nextVal = before + selected + after;
        newStart = start - prefix.length;
        newEnd = newStart + selected.length;
      } else {
        // 감싸기
        const before = val.substring(0, start);
        const after = val.substring(end);
        nextVal = before + prefix + selected + suffix + after;
        newStart = start + prefix.length;
        newEnd = newStart + selected.length;
      }
    } else {
      // 선택 영역이 없으면 플레이스홀더를 감싸서 삽입
      const before = val.substring(0, start);
      const after = val.substring(end);
      nextVal = before + prefix + placeholder + suffix + after;
      newStart = start + prefix.length;
      newEnd = newStart + placeholder.length;
    }

    updateSectionItem(sectionId, itemId, { description: nextVal });

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    });
  };

  // 엔터(Enter) 자동 불릿 및 서식 단축키(Ctrl+B, Ctrl+I, Ctrl+U)
  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    sectionId: string,
    item: SectionItem
  ) => {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    // 단축키: Ctrl/Cmd + B (볼드)
    if (isCtrlOrCmd && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyFormatWrapper(e.currentTarget, sectionId, item.id, '**', '**', '굵은 텍스트');
      return;
    }

    // 단축키: Ctrl/Cmd + I (기울임)
    if (isCtrlOrCmd && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      applyFormatWrapper(e.currentTarget, sectionId, item.id, '*', '*', '기울임 텍스트');
      return;
    }

    // 단축키: Ctrl/Cmd + U (밑줄)
    if (isCtrlOrCmd && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      applyFormatWrapper(e.currentTarget, sectionId, item.id, '<u>', '</u>', '밑줄 텍스트');
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = item.description || '';
      const before = val.slice(0, start);
      const after = val.slice(end);

      const lineStart = before.lastIndexOf('\n') + 1;
      const currentLine = before.slice(lineStart);

      // 현재 줄이 불릿 기호(•, -, –, ▪, *, 1. 등)로 시작하는지 검사
      const bulletMatch = currentLine.match(/^(\s*)([•\-–▪*]|\d+\.)(\s*)/);

      if (bulletMatch) {
        e.preventDefault();
        const [fullBullet, indent, bulletSymbol] = bulletMatch;
        const lineContentAfterBullet = currentLine.slice(fullBullet.length);

        // 불릿 기호만 있고 내용이 없는 빈 불릿 줄에서 엔터를 치면 불릿을 제거하고 일반 줄바꿈
        if (!lineContentAfterBullet.trim()) {
          const textBeforeLine = before.slice(0, lineStart);
          const nextVal = `${textBeforeLine}${after}`;
          updateSectionItem(sectionId, item.id, { description: nextVal });

          requestAnimationFrame(() => {
            target.selectionStart = lineStart;
            target.selectionEnd = lineStart;
          });
          return;
        }

        // 숫자인 경우 번호 1 증가, 아니면 동일 기호 유지
        let nextBullet = `${indent}${bulletSymbol} `;
        const numMatch = bulletSymbol.match(/^(\d+)\.$/);
        if (numMatch) {
          const nextNum = parseInt(numMatch[1], 10) + 1;
          nextBullet = `${indent}${nextNum}. `;
        }

        const nextVal = `${before}\n${nextBullet}${after}`;
        updateSectionItem(sectionId, item.id, { description: nextVal });

        requestAnimationFrame(() => {
          const nextCursor = start + 1 + nextBullet.length;
          target.selectionStart = nextCursor;
          target.selectionEnd = nextCursor;
        });
      }
      // 불릿 줄이 아니면 기본 엔터(일반 줄바꿈)가 브라우저 기본 동작으로 처리됨
    }
  };

  const renderSectionEditor = (section: CVSection, secIdx: number) => {
    const isOpen = !!openSections[section.id];
    const meta = SECTION_CATALOG.find((m) => m.type === section.type) || SECTION_CATALOG[0];
    const isTwoCol = doc.design.layoutStructure !== 'single';

    return (
      <div
        key={section.id}
        className={`w-full overflow-hidden bg-white rounded-2xl border transition-all shadow-2xs ${
          section.visible ? 'border-zinc-200' : 'border-zinc-200/60 opacity-60'
        }`}
      >
        {/* 섹션 헤더 바 */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 gap-1.5 sm:gap-2 w-full overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSectionAccordion(section.id)}
            className="flex items-center gap-1.5 sm:gap-2 flex-1 w-0 min-w-0 overflow-hidden text-left font-bold text-zinc-900 hover:text-zinc-600 transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <span className="truncate block min-w-0 text-sm sm:text-base">
              {section.title || `(제목 없음 · ${meta.labelKo})`}
            </span>
            <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full shrink-0">
              {section.items.length}
            </span>
          </button>

          {/* 섹션 컨트롤 버튼들 */}
          <div className="flex items-center gap-0.5 shrink-0">
            {isTwoCol && (
              <button
                type="button"
                onClick={() => toggleSectionColumn(section.id)}
                title="메인 / 사이드바 전환"
                className={`px-1.5 sm:px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium flex items-center gap-1 border transition-colors ${
                  section.column === 'sidebar'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {section.column === 'sidebar' ? '사이드바' : '메인'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => moveSectionOrder(section.id, 'up')}
              disabled={secIdx === 0}
              title="위로"
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded-lg hover:bg-zinc-100"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => moveSectionOrder(section.id, 'down')}
              disabled={secIdx === doc.sections.length - 1}
              title="아래로"
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded-lg hover:bg-zinc-100"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => updateSection(section.id, { visible: !section.visible })}
              title={section.visible ? '숨기기' : '표시'}
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
            >
              {section.visible ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              type="button"
              onClick={() => removeSection(section.id)}
              title="삭제"
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* 섹션 내부 편집 폼 */}
        {isOpen && (
          <div className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-zinc-100 space-y-4">
            {/* 섹션 제목 및 요소별 숨김 / 표시 토글 옵션 */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                <label className="text-xs font-semibold text-zinc-500 sm:w-20 shrink-0">
                  섹션 제목
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="flex-1 min-w-0 text-sm px-3 py-1.5 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                  placeholder="섹션 제목 (비우거나 숨기면 밑줄·아이콘도 숨김)"
                />
              </div>

              {/* 요소별 숨김 / 숨김해제 빠른 토글 바 */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-zinc-100">
                <span className="text-[11px] font-semibold text-zinc-400 mr-1">요소 노출:</span>

                {/* 섹션 제목 숨김/표시 */}
                <button
                  type="button"
                  onClick={() => updateSection(section.id, { hideTitle: !section.hideTitle })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                    !section.hideTitle
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through'
                  }`}
                  title={!section.hideTitle ? '섹션 제목 숨기기' : '섹션 제목 표시하기'}
                >
                  {!section.hideTitle ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>섹션 제목</span>
                </button>

                {/* 헤드라인 숨김/표시 */}
                <button
                  type="button"
                  onClick={() => updateSection(section.id, { hideItemTitle: !section.hideItemTitle })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                    !section.hideItemTitle
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through'
                  }`}
                  title={!section.hideItemTitle ? '헤드라인 전체 숨기기' : '헤드라인 전체 표시하기'}
                >
                  {!section.hideItemTitle ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>헤드라인</span>
                </button>

                {/* 상세내용 숨김/표시 */}
                <button
                  type="button"
                  onClick={() =>
                    updateSection(section.id, { hideItemDescription: !section.hideItemDescription })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                    !section.hideItemDescription
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through'
                  }`}
                  title={!section.hideItemDescription ? '상세내용 전체 숨기기' : '상세내용 전체 표시하기'}
                >
                  {!section.hideItemDescription ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>상세내용</span>
                </button>
              </div>
            </div>

            {/* 각 항목 리스트 */}
            <div className="space-y-3">
              {section.items.map((item, itemIdx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.visible
                      ? 'bg-zinc-50/70 border-zinc-200/90'
                      : 'bg-zinc-100/50 border-zinc-200 opacity-60'
                  }`}
                >
                  {/* 항목 상단 툴바 */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-zinc-200/70">
                    <span className="text-xs font-semibold text-zinc-700 truncate min-w-0 flex-1">
                      #{itemIdx + 1} {item.title || meta.labelKo}
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveSectionItemOrder(section.id, item.id, 'up')}
                        disabled={itemIdx === 0}
                        className="p-1.5 sm:p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                        title="위로"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSectionItemOrder(section.id, item.id, 'down')}
                        disabled={itemIdx === section.items.length - 1}
                        className="p-1.5 sm:p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                        title="아래로"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateSectionItem(section.id, item.id)}
                        className="p-1.5 sm:p-1 text-zinc-400 hover:text-zinc-900"
                        title="복제"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSectionItem(section.id, item.id, { visible: !item.visible })
                        }
                        className="p-1.5 sm:p-1 text-zinc-400 hover:text-zinc-900"
                        title={item.visible ? '숨기기' : '보이기'}
                      >
                        {item.visible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSectionItem(section.id, item.id)}
                        className="p-1.5 sm:p-1 text-zinc-400 hover:text-rose-600"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 항목 입력 필드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className={section.type === 'profile' ? 'sm:col-span-2' : ''}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-zinc-500">
                          {section.type === 'profile'
                            ? '헤드라인'
                            : section.type === 'experience'
                            ? '회사명'
                            : section.type === 'education'
                            ? '학교명'
                            : section.type === 'skills'
                            ? '기술명'
                            : '제목'}
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateSectionItem(section.id, item.id, { hideTitle: !item.hideTitle })
                          }
                          className={`text-[10px] flex items-center gap-1 font-medium px-1.5 py-0.5 rounded transition-colors ${
                            item.hideTitle
                              ? 'text-rose-600 bg-rose-50 border border-rose-200'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                          title={item.hideTitle ? '헤드라인 표시하기' : '이 항목 헤드라인 숨기기'}
                        >
                          {item.hideTitle ? (
                            <>
                              <EyeOff className="w-3 h-3 text-rose-500" />
                              <span className="line-through">헤드라인 숨김</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 text-zinc-400" />
                              <span>표시중</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateSectionItem(section.id, item.id, { title: e.target.value })
                        }
                        placeholder={meta.titlePlaceholder}
                        className={`w-full text-sm px-2.5 py-1.5 rounded-lg border focus:border-zinc-900 outline-none ${
                          item.hideTitle || section.hideItemTitle
                            ? 'bg-zinc-100/80 text-zinc-400 border-zinc-200'
                            : 'bg-white border-zinc-200'
                        }`}
                      />
                    </div>

                    {section.type !== 'profile' && (
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                          {section.type === 'experience'
                            ? '직책'
                            : section.type === 'education'
                            ? '전공 및 학위'
                            : section.type === 'skills'
                            ? '보조 설명'
                            : '부제목'}
                        </label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) =>
                            updateSectionItem(section.id, item.id, { subtitle: e.target.value })
                          }
                          placeholder={meta.subtitlePlaceholder}
                          className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                        />
                      </div>
                    )}

                    {/* 날짜 및 위치 필드 */}
                    {!['profile', 'skills', 'languages', 'interests'].includes(section.type) && (
                      <>
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                            시작일
                          </label>
                          <input
                            type="text"
                            value={item.startDate}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, { startDate: e.target.value })
                            }
                            placeholder="2023.03"
                            className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-medium text-zinc-500">종료일</label>
                            <label className="inline-flex items-center gap-1 text-[11px] text-zinc-700 font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.isCurrent}
                                onChange={(e) =>
                                  updateSectionItem(section.id, item.id, {
                                    isCurrent: e.target.checked,
                                  })
                                }
                                className="rounded text-zinc-900"
                              />
                              재직·진행중
                            </label>
                          </div>
                          <input
                            type="text"
                            disabled={item.isCurrent}
                            value={item.isCurrent ? '현재' : item.endDate}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, { endDate: e.target.value })
                            }
                            placeholder="2026.11"
                            className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                            {section.type === 'education' ? '학점' : '위치'}
                          </label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, { location: e.target.value })
                            }
                            placeholder={
                              section.type === 'education'
                                ? '학점 (예: 4.12 / 4.5)'
                                : (meta.locationPlaceholder || '서울')
                            }
                            className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                            링크
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={item.urlLabel}
                              onChange={(e) =>
                                updateSectionItem(section.id, item.id, { urlLabel: e.target.value })
                              }
                              placeholder="라벨"
                              className="w-2/5 min-w-0 text-sm px-2 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                            />
                            <input
                              type="url"
                              value={item.url}
                              onChange={(e) =>
                                updateSectionItem(section.id, item.id, { url: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-3/5 min-w-0 text-sm px-2 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 스킬 / 어학 전용 레벨 컨트롤 */}
                    {(section.type === 'skills' || section.type === 'languages') && (
                      <>
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                            숙련도: <strong className="text-zinc-900">{item.level}</strong>
                          </label>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={item.level || 4}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, {
                                level: Number(e.target.value),
                              })
                            }
                            className="w-full accent-zinc-900 mt-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                            수준 표기
                          </label>
                          <input
                            type="text"
                            value={item.levelText}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, { levelText: e.target.value })
                            }
                            placeholder="Expert / OPIc AL"
                            className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {/* 상세 내용 (엔터 입력 시 • 불릿 자동 삽입 및 서식 B/I/U 지원) */}
                    {section.type !== 'skills' && section.type !== 'languages' && (
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1.5">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-medium text-zinc-500">
                              상세 내용
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                updateSectionItem(section.id, item.id, {
                                  hideDescription: !item.hideDescription,
                                })
                              }
                              className={`text-[10px] flex items-center gap-1 font-medium px-1.5 py-0.5 rounded transition-colors ${
                                item.hideDescription
                                  ? 'text-rose-600 bg-rose-50 border border-rose-200'
                                  : 'text-zinc-500 hover:text-zinc-800'
                              }`}
                              title={item.hideDescription ? '상세내용 표시하기' : '이 항목 상세내용 숨기기'}
                            >
                              {item.hideDescription ? (
                                <>
                                  <EyeOff className="w-3 h-3 text-rose-500" />
                                  <span className="line-through">상세내용 숨김</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3 text-zinc-400" />
                                  <span>표시중</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* 텍스트 서식 툴바 (볼드, 기울임, 밑줄, 불릿 추가) */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center bg-zinc-100 rounded-md p-0.5 border border-zinc-200">
                              <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`desc-textarea-${item.id}`) as HTMLTextAreaElement | null;
                                  if (el) applyFormatWrapper(el, section.id, item.id, '**', '**', '굵은 텍스트');
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors"
                                title="굵게 / 볼드 (Ctrl+B)"
                              >
                                <span className="font-extrabold text-[13px] leading-none">B</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`desc-textarea-${item.id}`) as HTMLTextAreaElement | null;
                                  if (el) applyFormatWrapper(el, section.id, item.id, '*', '*', '기울임 텍스트');
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded text-xs italic font-serif text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors"
                                title="기울임 / 이탤릭 (Ctrl+I)"
                              >
                                <span className="italic font-serif text-[13px] leading-none">I</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`desc-textarea-${item.id}`) as HTMLTextAreaElement | null;
                                  if (el) applyFormatWrapper(el, section.id, item.id, '<u>', '</u>', '밑줄 텍스트');
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded text-xs text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors"
                                title="밑줄 (Ctrl+U)"
                              >
                                <span className="underline underline-offset-2 font-semibold text-[13px] leading-none">U</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const prefix = item.description ? `${item.description}\n• ` : '• ';
                                updateSectionItem(section.id, item.id, { description: prefix });
                              }}
                              className="text-[11px] text-zinc-700 hover:text-zinc-950 font-semibold px-2 py-0.5 rounded hover:bg-zinc-100 transition-colors"
                            >
                              + 불릿 추가
                            </button>
                          </div>
                        </div>
                        <textarea
                          id={`desc-textarea-${item.id}`}
                          rows={3}
                          value={item.description}
                          onKeyDown={(e) => handleDescriptionKeyDown(e, section.id, item)}
                          onChange={(e) =>
                            updateSectionItem(section.id, item.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="• 주요 내용 입력 (텍스트 드래그 후 B/I/U 또는 Ctrl+B/I/U로 서식 적용)"
                          className={`w-full text-sm px-3 py-2 rounded-lg border focus:border-zinc-900 outline-none leading-relaxed ${
                            item.hideDescription || section.hideItemDescription
                              ? 'bg-zinc-100/80 text-zinc-400 border-zinc-200'
                              : 'bg-white border-zinc-200'
                          }`}
                        />
                      </div>
                    )}

                    {/* 태그 입력 */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                        태그
                      </label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={tagInputs[item.id] || ''}
                            onChange={(e) =>
                              setTagInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                e.preventDefault();
                                handleAddTag(section.id, item);
                              }
                            }}
                            placeholder="React, TypeScript"
                            className="w-full text-sm pl-8 pr-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddTag(section.id, item)}
                          className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 shrink-0"
                        >
                          추가
                        </button>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-xs font-medium border border-zinc-200"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(section.id, item, tIdx)}
                                className="hover:text-rose-600 ml-0.5 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 항목 추가 버튼 */}
            <button
              type="button"
              onClick={() => addSectionItem(section.id)}
              className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 text-zinc-700 hover:bg-zinc-100/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>항목 추가</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-16">
      {/* 1. 기본 인적사항 카드 */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setPersonalOpen(!personalOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left font-bold text-zinc-900 hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>인적사항</span>
          </div>
          {personalOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {personalOpen && (
          <div className="p-3.5 sm:p-4 border-t border-zinc-100 space-y-4">
            {/* 프로필 사진 업로드 및 모양 설정 */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center gap-3">
                {doc.personal.photoUrl ? (
                  <img
                    src={doc.personal.photoUrl}
                    alt="프로필"
                    className="w-14 h-14 object-cover rounded-xl border border-zinc-300"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-400">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer">
                      사진 업로드
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {doc.personal.photoUrl && (
                      <button
                        type="button"
                        onClick={() => updatePersonal({ photoUrl: '', showPhoto: false })}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-xs text-zinc-600 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.personal.showPhoto}
                      onChange={(e) => updatePersonal({ showPhoto: e.target.checked })}
                      className="rounded text-zinc-900"
                    />
                    사진 표시
                  </label>
                </div>
              </div>

              {doc.personal.showPhoto && (
                <div className="w-full sm:w-auto sm:ml-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-200/70 flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 text-xs">
                  <select
                    value={doc.personal.photoShape}
                    onChange={(e) =>
                      updatePersonal({
                        photoShape: e.target.value as 'circle' | 'rounded' | 'square',
                      })
                    }
                    className="px-2 py-1 rounded border border-zinc-200 bg-white"
                  >
                    <option value="circle">원형</option>
                    <option value="rounded">둥근 사각형</option>
                    <option value="square">직사각형</option>
                  </select>
                  <label className="flex items-center gap-1">
                    <span>크기</span>
                    <input
                      type="range"
                      min={64}
                      max={128}
                      value={doc.personal.photoSize}
                      onChange={(e) => updatePersonal({ photoSize: Number(e.target.value) })}
                      className="w-20 accent-zinc-900"
                    />
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.personal.photoGrayscale}
                      onChange={(e) => updatePersonal({ photoGrayscale: e.target.checked })}
                    />
                    흑백
                  </label>
                </div>
              )}
            </div>

            {/* 기본 정보 입력 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">이름</label>
                <input
                  type="text"
                  value={doc.personal.fullName}
                  onChange={(e) => updatePersonal({ fullName: e.target.value })}
                  placeholder="홍길동"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">직무</label>
                <input
                  type="text"
                  value={doc.personal.jobTitle}
                  onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
                  placeholder="Senior Frontend Engineer"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">이메일</label>
                <input
                  type="email"
                  value={doc.personal.email}
                  onChange={(e) => updatePersonal({ email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">연락처</label>
                <input
                  type="text"
                  value={doc.personal.phone}
                  onChange={(e) => updatePersonal({ phone: e.target.value })}
                  placeholder="010-1234-5678"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">주소</label>
                <input
                  type="text"
                  value={doc.personal.location}
                  onChange={(e) => updatePersonal({ location: e.target.value })}
                  placeholder="서울특별시 강남구"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">생년월일</label>
                <input
                  type="text"
                  value={doc.personal.birthDate}
                  onChange={(e) => updatePersonal({ birthDate: e.target.value })}
                  placeholder="1995.04"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">국적</label>
                <input
                  type="text"
                  value={doc.personal.nationality}
                  onChange={(e) => updatePersonal({ nationality: e.target.value })}
                  placeholder="대한민국"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">병역 / 비자</label>
                <input
                  type="text"
                  value={doc.personal.militaryOrVisa}
                  onChange={(e) => updatePersonal({ militaryOrVisa: e.target.value })}
                  placeholder="병역필"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                />
              </div>
            </div>

            {/* Link 관리 */}
            <div className="pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-zinc-700" />
                  Link
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                  >
                    + 커스텀 항목
                  </button>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-xs text-zinc-900 hover:underline font-semibold"
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-2">
                {doc.personal.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 sm:p-0 rounded-xl sm:rounded-none bg-zinc-50/80 sm:bg-transparent border sm:border-0 border-zinc-200/70"
                  >
                    <div className="flex items-center gap-2 sm:contents">
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(link.id, {
                            platform: e.target.value as SocialLink['platform'],
                          })
                        }
                        className="text-xs px-2 py-1.5 rounded-lg border border-zinc-200 bg-white sm:bg-zinc-50 shrink-0"
                      >
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="website">Website</option>
                        <option value="blog">Blog</option>
                        <option value="velog">Velog</option>
                        <option value="notion">Notion</option>
                        <option value="scholar">Scholar</option>
                        <option value="other">기타</option>
                      </select>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                        placeholder="표시 텍스트"
                        className="flex-1 min-w-0 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(link.id)}
                        className="p-1.5 sm:hidden text-zinc-400 hover:text-rose-600 shrink-0"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full sm:flex-1 min-w-0 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      className="hidden sm:inline-flex p-1 text-zinc-400 hover:text-rose-600 shrink-0"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {doc.personal.customFields?.map((cf) => (
                  <div key={cf.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cf.label}
                      onChange={(e) =>
                        updatePersonal({
                          customFields: doc.personal.customFields.map((item) =>
                            item.id === cf.id ? { ...item, label: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="항목명"
                      className="w-24 sm:w-28 min-w-0 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50"
                    />
                    <input
                      type="text"
                      value={cf.value}
                      onChange={(e) =>
                        updatePersonal({
                          customFields: doc.personal.customFields.map((item) =>
                            item.id === cf.id ? { ...item, value: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="내용"
                      className="flex-1 min-w-0 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updatePersonal({
                          customFields: doc.personal.customFields.filter(
                            (item) => item.id !== cf.id
                          ),
                        })
                      }
                      className="p-1.5 sm:p-1 text-zinc-400 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 동적 섹션 리스트 */}
      <div className="space-y-3">
        {doc.sections.map((sec, idx) => renderSectionEditor(sec, idx))}
      </div>

      {/* 3. 새 섹션 추가 버튼 및 모달 그리드 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="w-full py-3.5 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>섹션 추가</span>
        </button>

        {showAddModal && (
          <div className="mt-3 p-4 bg-white rounded-2xl border border-zinc-200 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-zinc-800" />
                섹션 선택
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700"
              >
                닫기 ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SECTION_CATALOG.map((meta) => (
                <button
                  key={meta.type}
                  type="button"
                  onClick={() => {
                    addSection(meta.type);
                    setShowAddModal(false);
                  }}
                  className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all"
                >
                  <div className="font-bold text-xs text-zinc-900">{meta.labelKo}</div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{meta.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
