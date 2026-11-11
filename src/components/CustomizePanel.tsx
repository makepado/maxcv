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
      {/* 1. 원클릭 템플릿 프리셋 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            원클릭 디자인 프리셋 (FlowCV Templates)
          </h3>
          <button
            type="button"
            onClick={resetDesign}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            기본값 초기화
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
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/15'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{preset.nameKo}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 레이아웃 구조 (1단 / 2단 좌측 사이드바 / 2단 우측 사이드바) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Columns className="w-4 h-4 text-indigo-600" />
          페이지 컬럼 레이아웃 & 비율
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {(
            [
              { id: 'single', label: '1단 표준형', sub: 'Single Column' },
              { id: 'two-col-left', label: '2단 (좌측 사이드바)', sub: 'Left Sidebar' },
              { id: 'two-col-right', label: '2단 (우측 사이드바)', sub: 'Right Sidebar' },
            ] as { id: LayoutStructure; label: string; sub: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateDesign({ layoutStructure: opt.id })}
              className={`p-3 rounded-xl border text-center transition-all ${
                design.layoutStructure === opt.id
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 font-bold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs">{opt.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>

        {design.layoutStructure !== 'single' && (
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>사이드바 너비 비율</span>
                <span className="text-indigo-600">
                  사이드바 {design.sidebarRatio}% : 메인 {100 - design.sidebarRatio}%
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={45}
                step={1}
                value={design.sidebarRatio}
                onChange={(e) => updateDesign({ sidebarRatio: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span>사이드바 배경색</span>
                <input
                  type="color"
                  value={design.sidebarBgColor}
                  onChange={(e) => updateDesign({ sidebarBgColor: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                />
              </label>
              <button
                type="button"
                onClick={() => updateDesign({ sidebarBgColor: '#f8fafc', sidebarTextColor: '#0f172a' })}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                소프트 그레이
              </button>
              <button
                type="button"
                onClick={() => updateDesign({ sidebarBgColor: '#0f172a', sidebarTextColor: '#f8fafc' })}
                className="text-xs px-2.5 py-1 rounded bg-slate-900 text-white"
              >
                다크 네이비
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. 여백 및 간격 (Spacing & Margins) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-indigo-600" />
          여백 및 섹션/항목 간격 (Spacing)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>상하 페이지 여백</span>
              <span className="text-indigo-600">{design.pageMarginTopBottom}mm</span>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={design.pageMarginTopBottom}
              onChange={(e) => updateDesign({ pageMarginTopBottom: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>좌우 페이지 여백</span>
              <span className="text-indigo-600">{design.pageMarginLeftRight}mm</span>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={design.pageMarginLeftRight}
              onChange={(e) => updateDesign({ pageMarginLeftRight: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>섹션 간 간격 (Section Gap)</span>
              <span className="text-indigo-600">{design.sectionGap}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={34}
              step={1}
              value={design.sectionGap}
              onChange={(e) => updateDesign({ sectionGap: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>항목 간 간격 (Entry Gap)</span>
              <span className="text-indigo-600">{design.entryGap}px</span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              step={1}
              value={design.entryGap}
              onChange={(e) => updateDesign({ entryGap: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* 4. 헤더 & 섹션 타이틀 & 스킬 스타일 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-600" />
          헤더 · 섹션 제목 · 스킬 표시 스타일
        </h3>

        {/* 상단 헤더 정렬 */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            인적사항 헤더 정렬 방식
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'left', label: '좌측 정렬', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { id: 'center', label: '중앙 정렬', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                { id: 'right', label: '우측 정렬', icon: <AlignRight className="w-3.5 h-3.5" /> },
              ] as { id: HeaderLayout; label: string; icon: React.ReactNode }[]
            ).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => updateDesign({ headerLayout: h.id })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  design.headerLayout === h.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
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
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            인적사항 헤더 배경 장식
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'none', label: '배경 없음 (심플)' },
              { id: 'bottom-border', label: '하단 구분선' },
              { id: 'tinted', label: '소프트 틴트 박스' },
              { id: 'solid-accent', label: '포인트 컬러 채우기' },
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
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* 섹션 제목 스타일 */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            섹션 제목(Heading) 구분선 스타일
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
              [
                { id: 'underline-full', label: '전체 하단 밑줄' },
                { id: 'underline-accent', label: '투톤 포인트 밑줄' },
                { id: 'left-bar', label: '좌측 포인트 바' },
                { id: 'shaded-box', label: '배경 박스 강조' },
                { id: 'caps-minimal', label: '미니멀 라인' },
              ] as { id: HeadingStyle; label: string }[]
            ).map((hs) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => updateDesign({ headingStyle: hs.id })}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                  design.headingStyle === hs.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {hs.label}
              </button>
            ))}
          </div>
        </div>

        {/* 스킬 숙련도 표시 스타일 */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            보유 기술(Skills) & 어학 시각화 방식
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                { id: 'badge', label: '태그 배지' },
                { id: 'bars', label: '프로그레스 바' },
                { id: 'dots', label: '5단계 도트' },
                { id: 'text-only', label: '텍스트 나열' },
                { id: 'compact-inline', label: '콤팩트 인라인' },
              ] as { id: SkillDisplayStyle; label: string }[]
            ).map((sk) => (
              <button
                key={sk.id}
                type="button"
                onClick={() => updateDesign({ skillDisplayStyle: sk.id })}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold ${
                  design.skillDisplayStyle === sk.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sk.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showSectionIcons}
              onChange={(e) => updateDesign({ showSectionIcons: e.target.checked })}
              className="rounded text-indigo-600"
            />
            섹션 제목 옆 아이콘 표시
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.linkShowFullUrl}
              onChange={(e) => updateDesign({ linkShowFullUrl: e.target.checked })}
              className="rounded text-indigo-600"
            />
            인쇄용 전체 URL 주소 노출
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showPageBreakGuides}
              onChange={(e) => updateDesign({ showPageBreakGuides: e.target.checked })}
              className="rounded text-indigo-600"
            />
            1페이지 A4 경계선 표시
          </label>
        </div>
      </div>

      {/* 5. 날짜 포맷 및 위치 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          날짜 표기 포맷 및 위치 일괄 변경
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'dot', label: '2026.11 (점 표기)' },
              { id: 'korean', label: '2026년 11월 (한글)' },
              { id: 'slash', label: '2026/11 (슬래시)' },
              { id: 'english', label: 'Nov 2026 (영문)' },
            ] as { id: DateFormatStyle; label: string }[]
          ).map((df) => (
            <button
              key={df.id}
              type="button"
              onClick={() => updateDesign({ dateFormat: df.id })}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                design.dateFormat === df.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {(
            [
              { id: 'right', label: '항목 우측 끝 정렬 (표준)' },
              { id: 'below-title', label: '제목 바로 아래 줄 배치' },
            ] as { id: DatePositionStyle; label: string }[]
          ).map((dp) => (
            <button
              key={dp.id}
              type="button"
              onClick={() => updateDesign({ datePosition: dp.id })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                design.datePosition === dp.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dp.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. 색상 테마 커스터마이징 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          포인트 컬러 & 텍스트 색상 테마
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
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <span>직접 포인트 색상 선택</span>
            <input
              type="color"
              value={design.accentColor}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span>본문 텍스트 색상</span>
            <input
              type="color"
              value={design.textColor}
              onChange={(e) => updateDesign({ textColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span>보조 텍스트 색상</span>
            <input
              type="color"
              value={design.mutedTextColor}
              onChange={(e) => updateDesign({ mutedTextColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
