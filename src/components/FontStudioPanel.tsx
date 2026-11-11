import React, { useState } from 'react';
import { Type, Check, Sliders, Sparkles, Search, BookOpen } from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { KOREAN_FONTS, getFontById } from '../constants/fonts';
import { FontCategory } from '../types/cv';

export const FontStudioPanel: React.FC = () => {
  const doc = useCVStore((s) => s.getActiveDocument());
  const updateDesign = useCVStore((s) => s.updateDesign);
  const { design } = doc;

  const [selectedCategory, setSelectedCategory] = useState<FontCategory | 'all'>('all');
  const [targetRole, setTargetRole] = useState<'both' | 'heading' | 'body'>('both');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFonts = KOREAN_FONTS.filter((f) => {
    const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      f.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleApplyFont = (fontId: string) => {
    if (targetRole === 'both') {
      updateDesign({ headingFontId: fontId, bodyFontId: fontId });
    } else if (targetRole === 'heading') {
      updateDesign({ headingFontId: fontId });
    } else {
      updateDesign({ bodyFontId: fontId });
    }
  };

  const currentHeadingFont = getFontById(design.headingFontId);
  const currentBodyFont = getFontById(design.bodyFontId);

  const fontPairings = [
    {
      name: '프리텐다드 스탠다드',
      heading: 'pretendard',
      body: 'pretendard',
      desc: '제목과 본문 모두 프리텐다드를 사용하는 깔끔한 구성',
    },
    {
      name: '마루부리 + 리디바탕',
      heading: 'maruburi',
      body: 'ridi-batang',
      desc: '기품 있는 마루부리 헤딩과 가독성이 뛰어난 리디바탕 본문',
    },
    {
      name: '원티드 산스 + 수트',
      heading: 'wanted-sans',
      body: 'suit',
      desc: '선명한 타이틀과 밀도 높은 본문의 IT·스타트업 조합',
    },
    {
      name: '본명조 + 코펍월드바탕',
      heading: 'noto-serif-kr',
      body: 'kopub-batang',
      desc: '논문, 출판, 학위 이력서에 어울리는 정통 명조 조합',
    },
    {
      name: '페이퍼로지 + 프리텐다드',
      heading: 'paperlogy',
      body: 'pretendard',
      desc: '시선을 끄는 타이틀과 안정적인 본문 가독성',
    },
    {
      name: '지마켓 산스 + 스포카 한 산스',
      heading: 'gmarket-sans',
      body: 'spoqa-han-sans',
      desc: '강조된 섹션 타이틀과 숫자 가독성이 뛰어난 본문',
    },
  ];

  return (
    <div className="space-y-5 pb-16">
      {/* 현재 적용된 폰트 요약 */}
      <div className="bg-zinc-950 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            적용 중인 폰트
          </span>
          <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full text-zinc-300">
            {KOREAN_FONTS.length}종 지원
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-zinc-400 mb-0.5">제목 폰트</div>
            <div
              className="text-base font-bold truncate"
              style={{ fontFamily: currentHeadingFont.cssFamily }}
            >
              {currentHeadingFont.nameKo.replace(/\s*\(.*?\)/g, '')}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-zinc-400 mb-0.5">본문 폰트</div>
            <div
              className="text-base font-medium truncate"
              style={{ fontFamily: currentBodyFont.cssFamily }}
            >
              {currentBodyFont.nameKo.replace(/\s*\(.*?\)/g, '')}
            </div>
          </div>
        </div>
      </div>

      {/* 1. 타이포그래피 미세 조절 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-800" />
          크기 · 행간 · 자간 · 굵기
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>글자 크기</span>
              <span className="text-zinc-900">{Math.round(design.fontSizeScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.25}
              step={0.02}
              value={design.fontSizeScale}
              onChange={(e) => updateDesign({ fontSizeScale: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>줄간격</span>
              <span className="text-zinc-900">{design.lineHeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.25}
              max={1.85}
              step={0.03}
              value={design.lineHeight}
              onChange={(e) => updateDesign({ lineHeight: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
              <span>자간</span>
              <span className="text-zinc-900">{design.letterSpacing.toFixed(3)}em</span>
            </div>
            <input
              type="range"
              min={-0.05}
              max={0.06}
              step={0.005}
              value={design.letterSpacing}
              onChange={(e) => updateDesign({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">제목 굵기</label>
              <select
                value={design.headingWeight}
                onChange={(e) =>
                  updateDesign({
                    headingWeight: Number(e.target.value) as 500 | 600 | 700 | 800,
                  })
                }
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50"
              >
                <option value={500}>500</option>
                <option value={600}>600</option>
                <option value={700}>700</option>
                <option value={800}>800</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">본문 굵기</label>
              <select
                value={design.bodyWeight}
                onChange={(e) =>
                  updateDesign({
                    bodyWeight: Number(e.target.value) as 300 | 400 | 500,
                  })
                }
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50"
              >
                <option value={300}>300</option>
                <option value={400}>400</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-xs font-medium text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={design.wordBreakKeepAll}
            onChange={(e) => updateDesign({ wordBreakKeepAll: e.target.checked })}
            className="rounded text-zinc-900"
          />
          <span>한글 어절 단위 줄바꿈 유지</span>
        </label>
      </div>

      {/* 2. 폰트 조합 프리셋 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-800" />
          폰트 조합 프리셋
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {fontPairings.map((pair, idx) => {
            const isActive =
              design.headingFontId === pair.heading && design.bodyFontId === pair.body;
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  updateDesign({ headingFontId: pair.heading, bodyFontId: pair.body })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10'
                    : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">{pair.name}</span>
                  {isActive && <Check className="w-4 h-4 text-zinc-900 shrink-0" />}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">{pair.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 한국어 폰트 목록 */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-800" />
            폰트 목록
          </h3>

          <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTargetRole('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'both' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('heading')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'heading' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              제목만
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('body')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'body' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              본문만
            </button>
          </div>
        </div>

        {/* 카테고리 탭 & 검색창 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '전체' },
              { id: 'sans', label: '고딕' },
              { id: 'serif', label: '명조' },
              { id: 'display', label: '타이틀' },
              { id: 'mono', label: '고정폭' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as FontCategory | 'all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="폰트 검색"
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full border border-zinc-200 focus:border-zinc-900 outline-none"
            />
          </div>
        </div>

        {/* 폰트 카드 리스트 */}
        <div className="grid grid-cols-1 gap-3">
          {filteredFonts.map((font) => {
            const isHeading = design.headingFontId === font.id;
            const isBody = design.bodyFontId === font.id;

            const categoryBadge =
              font.category === 'serif'
                ? { text: '명조', cls: 'bg-amber-50 text-amber-800 border-amber-200' }
                : font.category === 'sans'
                ? { text: '고딕', cls: 'bg-sky-50 text-sky-800 border-sky-200' }
                : font.category === 'display'
                ? { text: '타이틀', cls: 'bg-purple-50 text-purple-800 border-purple-200' }
                : { text: '고정폭', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' };

            return (
              <div
                key={font.id}
                onClick={() => handleApplyFont(font.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isHeading || isBody
                    ? 'border-zinc-900 bg-zinc-50/70 ring-1 ring-zinc-900/10'
                    : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-bold text-zinc-900"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.nameKo.replace(/\s*\(.*?\)/g, '')}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryBadge.cls}`}
                    >
                      {categoryBadge.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isHeading && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                        제목
                      </span>
                    )}
                    {isBody && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-700 text-white">
                        본문
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {font.recommendedFor}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 mb-2.5">{font.description}</p>

                <div
                  className="p-2.5 rounded-lg bg-white border border-zinc-200/80 text-sm text-zinc-800"
                  style={{ fontFamily: font.cssFamily }}
                >
                  {font.sampleText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
