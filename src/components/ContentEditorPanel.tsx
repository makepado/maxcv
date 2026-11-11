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

  // 엔터(Enter) 키 입력 시 다음 줄에 자동으로 `• ` 불릿을 삽입
  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    sectionId: string,
    item: SectionItem
  ) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = item.description || '';
      const before = val.slice(0, start);
      const after = val.slice(end);

      // 첫 줄에 아직 불릿이 없다면 첫 줄 앞에도 불릿 보정
      const normalizedBefore =
        before.trim().length > 0 && !before.trimStart().startsWith('•') && !before.includes('\n')
          ? `• ${before}`
          : before;

      const diff = normalizedBefore.length - before.length;
      const nextVal = `${normalizedBefore}\n• ${after}`;
      updateSectionItem(sectionId, item.id, { description: nextVal });

      requestAnimationFrame(() => {
        const nextCursor = start + diff + 3;
        target.selectionStart = nextCursor;
        target.selectionEnd = nextCursor;
      });
    }
  };

  const renderSectionEditor = (section: CVSection, secIdx: number) => {
    const isOpen = !!openSections[section.id];
    const meta = SECTION_CATALOG.find((m) => m.type === section.type) || SECTION_CATALOG[0];
    const isTwoCol = doc.design.layoutStructure !== 'single';

    return (
      <div
        key={section.id}
        className={`bg-white rounded-2xl border transition-all shadow-2xs ${
          section.visible ? 'border-zinc-200' : 'border-zinc-200/60 opacity-60'
        }`}
      >
        {/* 섹션 헤더 바 */}
        <div className="flex items-center justify-between px-4 py-3.5 gap-2">
          <button
            type="button"
            onClick={() => toggleSectionAccordion(section.id)}
            className="flex items-center gap-2.5 flex-1 text-left font-bold text-zinc-900 hover:text-zinc-600 transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <span className="truncate">{section.title}</span>
            <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
              {section.items.length}
            </span>
          </button>

          {/* 섹션 컨트롤 버튼들 */}
          <div className="flex items-center gap-1">
            {isTwoCol && (
              <button
                type="button"
                onClick={() => toggleSectionColumn(section.id)}
                title="메인 / 사이드바 전환"
                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border transition-colors ${
                  section.column === 'sidebar'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Columns className="w-3 h-3" />
                {section.column === 'sidebar' ? '사이드바' : '메인'}
              </button>
            )}

            <button
              type="button"
              onClick={() => moveSectionOrder(section.id, 'up')}
              disabled={secIdx === 0}
              title="위로"
              className="p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded-lg hover:bg-zinc-100"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => moveSectionOrder(section.id, 'down')}
              disabled={secIdx === doc.sections.length - 1}
              title="아래로"
              className="p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded-lg hover:bg-zinc-100"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => updateSection(section.id, { visible: !section.visible })}
              title={section.visible ? '숨기기' : '표시'}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
            >
              {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => removeSection(section.id)}
              title="삭제"
              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 섹션 내부 편집 폼 */}
        {isOpen && (
          <div className="px-4 pb-4 pt-2 border-t border-zinc-100 space-y-4">
            {/* 섹션 제목 변경 */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-500 w-20 shrink-0">
                섹션 제목
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
                placeholder="섹션 제목"
              />
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
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-200/70">
                    <span className="text-xs font-semibold text-zinc-700 truncate max-w-[220px]">
                      #{itemIdx + 1} {item.title || meta.labelKo}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSectionItemOrder(section.id, item.id, 'up')}
                        disabled={itemIdx === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                        title="위로"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSectionItemOrder(section.id, item.id, 'down')}
                        disabled={itemIdx === section.items.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                        title="아래로"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateSectionItem(section.id, item.id)}
                        className="p-1 text-zinc-400 hover:text-zinc-900"
                        title="복제"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSectionItem(section.id, item.id, { visible: !item.visible })
                        }
                        className="p-1 text-zinc-400 hover:text-zinc-900"
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
                        className="p-1 text-zinc-400 hover:text-rose-600"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 항목 입력 필드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className={section.type === 'profile' ? 'sm:col-span-2' : ''}>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">
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
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateSectionItem(section.id, item.id, { title: e.target.value })
                        }
                        placeholder={meta.titlePlaceholder}
                        className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
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
                            위치 / 학점
                          </label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) =>
                              updateSectionItem(section.id, item.id, { location: e.target.value })
                            }
                            placeholder={meta.locationPlaceholder || '서울'}
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
                              className="w-2/5 text-sm px-2 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
                            />
                            <input
                              type="url"
                              value={item.url}
                              onChange={(e) =>
                                updateSectionItem(section.id, item.id, { url: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-3/5 text-sm px-2 py-1.5 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none"
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

                    {/* 상세 내용 (엔터 입력 시 • 불릿 자동 삽입) */}
                    {section.type !== 'skills' && section.type !== 'languages' && (
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-medium text-zinc-500">
                            상세 내용
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const prefix = item.description ? `${item.description}\n• ` : '• ';
                              updateSectionItem(section.id, item.id, { description: prefix });
                            }}
                            className="text-[11px] text-zinc-700 hover:text-zinc-950 font-semibold"
                          >
                            + 불릿 추가
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={item.description}
                          onKeyDown={(e) => handleDescriptionKeyDown(e, section.id, item)}
                          onChange={(e) =>
                            updateSectionItem(section.id, item.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="• 주요 성과 입력 (Enter 입력 시 다음 줄 불릿 자동 생성)"
                          className="w-full text-sm px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:border-zinc-900 outline-none leading-relaxed"
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
          <div className="p-4 border-t border-zinc-100 space-y-4">
            {/* 프로필 사진 업로드 및 모양 설정 */}
            <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
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
                <div className="flex flex-wrap items-center gap-3 ml-auto text-xs">
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

              <div className="space-y-2">
                {doc.personal.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(link.id, {
                          platform: e.target.value as SocialLink['platform'],
                        })
                      }
                      className="text-xs px-2 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50"
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
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600"
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
                      className="w-28 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50"
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
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200"
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
                      className="p-1 text-zinc-400 hover:text-rose-600"
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
