import React from 'react';
import {
  Layout,
  Palette,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Calendar,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { COLOR_PALETTES, TEMPLATE_PRESETS } from '../constants/fonts';
import {
  DateFormatStyle,
  DatePositionStyle,
  HeaderLayout,
  HeadingStyle,
  LayoutStructure,
  SkillDisplayStyle,
} from '../types/cv';

export const CustomizePanel: React.FC = () => {
  const doc = useCVStore((s) => s.getActiveDocument());
  const updateDesign = useCVStore((s) => s.updateDesign);
  const resetDesign = useCVStore((s) => s.resetDesign);
  const { design } = doc;

  return (
    <div className="space-y-5 pb-16">
      {/* 1. 레이아웃 프리셋 (폰트는 건드리지 않고 레이아웃과 스타일만 변경) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-800" />
            레이아웃 프리셋
          </h3>
          <button
            type="button"
            onClick={resetDesign}
            className="text-xs text-zinc-500 hover:text-rose-600 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TEMPLATE_PRESETS.map((preset) => {
            const isSelected = design.templatePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => updateDesign(preset.designPatch)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10'
                    : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900">{preset.nameKo}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-snug">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 컬럼 구조 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Columns className="w-4 h-4 text-zinc-800" />
          컬럼 구조
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {(
            [
              { id: 'single', label: '1단 표준' },
              { id: 'two-col-left', label: '2단 좌측 사이드바' },
              { id: 'two-col-right', label: '2단 우측 사이드바' },
            ] as { id: LayoutStructure; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateDesign({ layoutStructure: opt.id })}
              className={`p-3 rounded-xl border text-center text-xs transition-all ${
                design.layoutStructure === opt.id
                  ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {design.layoutStructure !== 'single' && (
          <div className="pt-2 border-t border-zinc-100 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                <span>사이드바 비율</span>
                <span className="text-zinc-900">
                  {design.sidebarRatio}% : {100 - design.sidebarRatio}%
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={45}
                step={1}
                value={design.sidebarRatio}
                onChange={(e) => updateDesign({ sidebarRatio: Number(e.target.value) })}
                className="w-full accent-zinc-900"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                <span>사이드바 배경</span>
                <input
                  type="color"
                  value={design.sidebarBgColor}
                  onChange={(e) => updateDesign({ sidebarBgColor: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-zinc-200"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  updateDesign({ sidebarBgColor: '#f8fafc', sidebarTextColor: '#0f172a' })
                }
                className="text-xs px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              >
                라이트 그레이
              </button>
              <button
                type="button"
                onClick={() =>
                  updateDesign({ sidebarBgColor: '#0f172a', sidebarTextColor: '#f8fafc' })
                }
                className="text-xs px-2.5 py-1 rounded bg-zinc-900 text-white"
              >
                다크 네이비
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. 여백 및 간격 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-zinc-800" />
          여백 및 간격
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>상하 여백</span>
              <span className="text-zinc-900">{design.pageMarginTopBottom}mm</span>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={design.pageMarginTopBottom}
              onChange={(e) => updateDesign({ pageMarginTopBottom: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>좌우 여백</span>
              <span className="text-zinc-900">{design.pageMarginLeftRight}mm</span>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={design.pageMarginLeftRight}
              onChange={(e) => updateDesign({ pageMarginLeftRight: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>섹션 간격</span>
              <span className="text-zinc-900">{design.sectionGap}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={34}
              step={1}
              value={design.sectionGap}
              onChange={(e) => updateDesign({ sectionGap: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>항목 간격</span>
              <span className="text-zinc-900">{design.entryGap}px</span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              step={1}
              value={design.entryGap}
              onChange={(e) => updateDesign({ entryGap: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* 4. 헤더 · 섹션 · 스킬 스타일 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Layout className="w-4 h-4 text-zinc-800" />
          헤더 · 섹션 · 스킬 스타일
        </h3>

        {/* 상단 헤더 정렬 */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            헤더 정렬
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'left', label: '좌측', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { id: 'center', label: '중앙', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                { id: 'right', label: '우측', icon: <AlignRight className="w-3.5 h-3.5" /> },
              ] as { id: HeaderLayout; label: string; icon: React.ReactNode }[]
            ).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => updateDesign({ headerLayout: h.id })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  design.headerLayout === h.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {h.icon}
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* 상단 헤더 배경 */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            헤더 장식
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'none', label: '없음' },
              { id: 'bottom-border', label: '하단 선' },
              { id: 'tinted', label: '틴트 박스' },
              { id: 'solid-accent', label: '컬러 채우기' },
            ].map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() =>
                  updateDesign({
                    headerBgStyle: bg.id as 'none' | 'tinted' | 'solid-accent' | 'bottom-border',
                  })
                }
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                  design.headerBgStyle === bg.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* 섹션 제목 스타일 */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            섹션 제목 스타일
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
              [
                { id: 'underline-full', label: '전체 밑줄' },
                { id: 'underline-accent', label: '포인트 밑줄' },
                { id: 'left-bar', label: '좌측 바' },
                { id: 'shaded-box', label: '배경 박스' },
                { id: 'caps-minimal', label: '미니멀 라인' },
              ] as { id: HeadingStyle; label: string }[]
            ).map((hs) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => updateDesign({ headingStyle: hs.id })}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                  design.headingStyle === hs.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {hs.label}
              </button>
            ))}
          </div>
        </div>

        {/* 스킬 표시 스타일 */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            기술 · 어학 표시
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                { id: 'badge', label: '배지' },
                { id: 'bars', label: '바' },
                { id: 'dots', label: '도트' },
                { id: 'text-only', label: '텍스트' },
                { id: 'compact-inline', label: '인라인' },
              ] as { id: SkillDisplayStyle; label: string }[]
            ).map((sk) => (
              <button
                key={sk.id}
                type="button"
                onClick={() => updateDesign({ skillDisplayStyle: sk.id })}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold ${
                  design.skillDisplayStyle === sk.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {sk.label}
              </button>
            ))}
          </div>
        </div>

        {/* 헤더 연락처 구분자 */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            헤더 정보 구분 기호
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'none', label: '없음 (공백)' },
              { id: 'pipe', label: '| (파이프)' },
              { id: 'dot', label: '· (가운데점)' },
              { id: 'slash', label: '/ (슬래시)' },
              { id: 'bullet', label: '• (불릿)' },
            ].map((sep) => (
              <button
                key={sep.id}
                type="button"
                onClick={() => updateDesign({ headerSeparator: sep.id as any })}
                className={`py-1.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  (design.headerSeparator || 'none') === sep.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {sep.label}
              </button>
            ))}
          </div>
        </div>

        {/* 아이콘 및 표시 옵션 체크박스 */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-100">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showHeaderIcons !== false}
              onChange={(e) => updateDesign({ showHeaderIcons: e.target.checked })}
              className="rounded text-zinc-900"
            />
            프로필 헤더 아이콘 표시
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showSectionIcons}
              onChange={(e) => updateDesign({ showSectionIcons: e.target.checked })}
              className="rounded text-zinc-900"
            />
            섹션 제목 아이콘 표시
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.linkShowFullUrl}
              onChange={(e) => updateDesign({ linkShowFullUrl: e.target.checked })}
              className="rounded text-zinc-900"
            />
            전체 URL 노출
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showPageBreakGuides}
              onChange={(e) => updateDesign({ showPageBreakGuides: e.target.checked })}
              className="rounded text-zinc-900"
            />
            페이지 경계선 표시
          </label>
        </div>
      </div>

      {/* 5. 날짜 표기 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-800" />
          날짜 표기
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'dot', label: '2026.11' },
              { id: 'korean', label: '2026년 11월' },
              { id: 'slash', label: '2026/11' },
              { id: 'english', label: 'Nov 2026' },
            ] as { id: DateFormatStyle; label: string }[]
          ).map((df) => (
            <button
              key={df.id}
              type="button"
              onClick={() => updateDesign({ dateFormat: df.id })}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                design.dateFormat === df.id
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {(
            [
              { id: 'right', label: '우측 정렬' },
              { id: 'below-title', label: '제목 아래 배치' },
            ] as { id: DatePositionStyle; label: string }[]
          ).map((dp) => (
            <button
              key={dp.id}
              type="button"
              onClick={() => updateDesign({ datePosition: dp.id })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                design.datePosition === dp.id
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {dp.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. 색상 테마 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-zinc-800" />
          색상 테마
        </h3>

        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTES.map((pal) => {
            const isSelected = design.accentColor.toLowerCase() === pal.color.toLowerCase();
            return (
              <button
                key={pal.color}
                type="button"
                onClick={() => updateDesign({ accentColor: pal.color })}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-2xs'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: pal.color }}
                />
                <span>{pal.name}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-zinc-100 text-xs font-semibold text-zinc-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <span>포인트 색상</span>
            <input
              type="color"
              value={design.accentColor}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-200"
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span>본문 색상</span>
            <input
              type="color"
              value={design.textColor}
              onChange={(e) => updateDesign({ textColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-200"
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span>보조 텍스트</span>
            <input
              type="color"
              value={design.mutedTextColor}
              onChange={(e) => updateDesign({ mutedTextColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-200"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
