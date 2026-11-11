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
      name: '프리텐다드 올인원 (가장 깔끔한 표준)',
      heading: 'pretendard',
      body: 'pretendard',
      desc: '제목과 본문 모두 프리텐다드를 사용하여 일관되고 현대적인 인상',
    },
    {
      name: '마루부리 제목 + 리디바탕 본문 (명조 에디토리얼)',
      heading: 'maruburi',
      body: 'ridi-batang',
      desc: '기품 있는 마루부리 헤딩과 긴 글 가독성이 뛰어난 리디바탕의 조화',
    },
    {
      name: '원티드 산스 제목 + 수트(SUIT) 본문 (IT·스타트업)',
      heading: 'wanted-sans',
      body: 'suit',
      desc: '선명한 타이틀과 밀도 높은 본문으로 테크 직군에 최적화',
    },
    {
      name: '본명조 제목 + 코펍월드바탕 본문 (정통 학술·연구 CV)',
      heading: 'noto-serif-kr',
      body: 'kopub-batang',
      desc: '논문, 출판, 학위 이력서에 어울리는 정통 출판 조판 조합',
    },
    {
      name: '페이퍼로지 제목 + 프리텐다드 본문 (포트폴리오 강조)',
      heading: 'paperlogy',
      body: 'pretendard',
      desc: '시선을 사로잡는 헤딩과 안정적인 본문 가독성',
    },
    {
      name: '지마켓 산스 제목 + 스포카 한 산스 본문 (비즈니스·마케팅)',
      heading: 'gmarket-sans',
      body: 'spoqa-han-sans',
      desc: '힘 있는 섹션 타이틀과 숫자/데이터 가독성이 뛰어난 본문',
    },
  ];

  return (
    <div className="space-y-5 pb-16">
      {/* 현재 적용된 폰트 요약 배너 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            현재 한국어 타이포그래피 구성
          </span>
          <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full text-indigo-200">
            총 {KOREAN_FONTS.length}종 무료 폰트 지원
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 mb-0.5">제목 / 헤딩 폰트 (Heading)</div>
            <div
              className="text-base font-bold truncate"
              style={{ fontFamily: currentHeadingFont.cssFamily }}
            >
              {currentHeadingFont.nameKo}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 mb-0.5">본문 / 설명 폰트 (Body)</div>
            <div
              className="text-base font-medium truncate"
              style={{ fontFamily: currentBodyFont.cssFamily }}
            >
              {currentBodyFont.nameKo}
            </div>
          </div>
        </div>
      </div>

      {/* 1. 타이포그래피 디테일 미세조절 슬라이더 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          한글 조판 디테일 미세 조절 (크기 · 행간 · 자간 · 굵기)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>전체 글자 크기 배율</span>
              <span className="text-indigo-600">{Math.round(design.fontSizeScale * 100)}% ({(10 * design.fontSizeScale).toFixed(1)}pt)</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.25}
              step={0.02}
              value={design.fontSizeScale}
              onChange={(e) => updateDesign({ fontSizeScale: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>줄간격 (Line Height)</span>
              <span className="text-indigo-600">{design.lineHeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.25}
              max={1.85}
              step={0.03}
              value={design.lineHeight}
              onChange={(e) => updateDesign({ lineHeight: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>한글 자간 (Letter Spacing)</span>
              <span className="text-indigo-600">{design.letterSpacing.toFixed(3)}em</span>
            </div>
            <input
              type="range"
              min={-0.05}
              max={0.06}
              step={0.005}
              value={design.letterSpacing}
              onChange={(e) => updateDesign({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">제목 굵기</label>
              <select
                value={design.headingWeight}
                onChange={(e) =>
                  updateDesign({
                    headingWeight: Number(e.target.value) as 500 | 600 | 700 | 800,
                  })
                }
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50"
              >
                <option value={500}>Medium (500)</option>
                <option value={600}>SemiBold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={800}>ExtraBold (800)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">본문 굵기</label>
              <select
                value={design.bodyWeight}
                onChange={(e) =>
                  updateDesign({
                    bodyWeight: Number(e.target.value) as 300 | 400 | 500,
                  })
                }
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50"
              >
                <option value={300}>Light (300)</option>
                <option value={400}>Regular (400)</option>
                <option value={500}>Medium (500)</option>
              </select>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={design.wordBreakKeepAll}
            onChange={(e) => updateDesign({ wordBreakKeepAll: e.target.checked })}
            className="rounded text-indigo-600"
          />
          <span>한글 어절 단위 줄바꿈 유지 (word-break: keep-all — 단어 중간 끊김 방지)</span>
        </label>
      </div>

      {/* 2. 원클릭 추천 폰트 페어링 (제목 + 본문 조합) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          추천 한글 폰트 페어링 (제목 + 본문 원클릭 조합)
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
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/15'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{pair.name}</span>
                  {isActive && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{pair.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 전체 한국어 무료 폰트 카탈로그 (고딕 / 명조 / 디스플레이 / 코드) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            한국어 무료 폰트 라이브러리 ({filteredFonts.length}종)
          </h3>

          {/* 적용 대상 선택 토글 */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTargetRole('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'both' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              전체(제목+본문) 적용
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('heading')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'heading' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              제목에만 적용
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('body')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                targetRole === 'body' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              본문에만 적용
            </button>
          </div>
        </div>

        {/* 카테고리 탭 & 검색창 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '전체보기' },
              { id: 'sans', label: '고딕 (Sans-serif)' },
              { id: 'serif', label: '명조·바탕 (Serif)' },
              { id: 'display', label: '타이틀·디스플레이' },
              { id: 'mono', label: '개발·고정폭 (Mono)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as FontCategory | 'all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="폰트 이름 또는 추천 직무 검색..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full border border-slate-200 focus:border-indigo-500 outline-none"
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
                ? { text: '명조 · Serif', cls: 'bg-amber-50 text-amber-800 border-amber-200' }
                : font.category === 'sans'
                ? { text: '고딕 · Sans', cls: 'bg-sky-50 text-sky-800 border-sky-200' }
                : font.category === 'display'
                ? { text: '디스플레이 · Title', cls: 'bg-purple-50 text-purple-800 border-purple-200' }
                : { text: '코딩 · Mono', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' };

            return (
              <div
                key={font.id}
                onClick={() => handleApplyFont(font.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isHeading || isBody
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-bold text-slate-900"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.nameKo}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryBadge.cls}`}
                    >
                      {categoryBadge.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isHeading && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                        제목 사용중
                      </span>
                    )}
                    {isBody && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                        본문 사용중
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {font.recommendedFor}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-2.5">{font.description}</p>

                {/* 실제 폰트 렌더링 샘플 */}
                <div
                  className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-sm text-slate-800"
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
