# MaxCV — 차세대 한국어 타이포그래피 이력서 스튜디오

<p align="center">
  <img src="https://raw.githubusercontent.com/makepado/maxcv/main/dist/assets/index.html" alt="MaxCV Banner" width="100%" style="display:none" />
</p>

<p align="center">
  <strong>한글 타이포그래피의 미학, 밀도 높은 A4 조판, Google 계정 클라우드 동기화</strong><br />
  정교한 한국어 무료 폰트 20종과 세부 요소별 정밀 px 타이포그래피 제어를 제공하는 올인원 웹 이력서 빌더
</p>

<p align="center">
  <a href="https://maxcv.pages.dev"><img src="https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Pages" /></a>
  <a href="https://developers.cloudflare.com/d1/"><img src="https://img.shields.io/badge/Database-Cloudflare%20D1%20SQLite-4285F4?style=flat-square&logo=sqlite&logoColor=white" alt="Cloudflare D1" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
</p>

---

## ⚡️ 핵심 차별점

1. **한국어 무료 웹폰트 20종 완벽 지원**
   - **Sans-serif (고딕)**: 프리텐다드(Pretendard), 원티드 산스(Wanted Sans), 수트(SUIT), 스포카 한 산스 네오, 본고딕(Noto Sans KR), 나눔스퀘어 네오, IBM Plex Sans KR, 고운돋움, 나눔고딕
   - **Serif (명조·바탕)**: 마루부리(MaruBuri), 리디바탕(RIDIBatang), 코펍월드바탕(KoPubWorld Batang), 본명조(Noto Serif KR), 함렛(Hahmlet), 고운바탕, 나눔명조, 조선일보명조, 송명
   - **Display & Monospace**: 페이퍼로지(Paperlogy), 지마켓 산스(Gmarket Sans), 에스코어 드림, D2Coding, JetBrains Mono

2. **요소별 정밀 타이포그래피 제어 (px 단위 표기)**
   - **프로필 헤더**: `이름` / `직무` / `연락처·링크` 각각의 글자 크기(px), 줄간격(배율), 자간(em) 개별 제어
   - **섹션 영역**: `섹션 헤더` / `섹션 헤드라인(회사명·학교명)` / `섹션 상세내용(불릿·성과)` / `섹션 태그` 각각의 글자 크기(px), 줄간격, 자간 개별 제어
   - 한글 단어 끊김 방지(`word-break: keep-all`) 기본 탑재

3. **헤더 레이아웃 & 정렬의 높은 자유도**
   - **이름 · 직무 배치**: `위아래 (2줄)` vs `나란히 (1줄 옆에)` 자유 전환
   - **정렬 옵션**: 이름 좌/중/우, 직무 좌/중/우, 연락처·링크 좌/중/우 독립 정렬
   - **구분 기호**: 항목 간 `| (파이프)`, `· (가운데점)`, `/ (슬래시)`, `• (불릿)` 기호 선택 및 아이콘 표시/숨김 토글

4. **Google OAuth 2.0 & Cloudflare D1 계정별 클라우드 저장**
   - 구글 팝업 로그인으로 계정 인증
   - 계정 이메일(`user_email`) 기준으로 D1 SQLite(`hongjaed1db`)에 안전하게 저장·불러오기 지원
   - 브라우저 로컬 저장소와 상호 자동 동기화

5. **2가지 완벽한 PDF 내보내기**
   - **PDF 즉시 다운로드 (`html2canvas` + `jsPDF`)**: 디자인·웹폰트가 100% 동일하게 유지되는 고해상도 A4 다중 페이지 파일 다운로드
   - **벡터 인쇄 (`printVectorPdfClean`)**: 텍스트 드래그, 복사, 링크 클릭이 살아있는 벡터 PDF 인쇄

---

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 6, Zustand, Lucide React
- **Export Engine**: `html2canvas`, `jspdf`, Isolated Clean `iframe` Print Engine
- **Serverless Backend**: Cloudflare Pages Functions (`/functions/api/resumes.ts`)
- **Database**: Cloudflare D1 SQLite Database (`hongjaed1db`)
- **Authentication**: Google OAuth 2.0 Popup Token Client

---

## 📂 프로젝트 구조

```text
maxcv/
├── dist/                     # Cloudflare Pages 프로덕션 빌드 산출물
├── functions/api/            # Cloudflare Pages Functions (D1 REST API)
│   └── resumes.ts            # GET / POST / DELETE 이력서 동기화 엔드포인트
├── src/
│   ├── components/
│   │   ├── CVPreviewCanvas.tsx      # A4 실시간 프리뷰 캔버스 & 레이아웃 렌더러
│   │   ├── ContentEditorPanel.tsx   # 15개 섹션 내용 작성기 (Enter 불릿 자동인식)
│   │   ├── FontStudioPanel.tsx      # 20종 폰트 & 요소별 px 정밀 타이포그래피 패널
│   │   ├── CustomizePanel.tsx       # 컬럼, 여백, 헤더 배치, 구분자, 컬러 테마 커스터마이저
│   │   ├── ExportAndCloudPanel.tsx  # 즉시 PDF 다운로드 & JSON 백업/복원
│   │   ├── LandingPage.tsx          # 미니멀 유니콘 스타일 랜딩 페이지
│   │   └── GoogleAuthModal.tsx      # 구글 OAuth 인증 모달
│   ├── constants/
│   │   ├── fonts.ts                 # 20종 한국어 웹폰트 명세 & 컬러 프리셋
│   │   └── defaultCv.ts             # 기본 이력서 템플릿 & 디자인 초기값
│   ├── store/useCVStore.ts          # Zustand 상태 관리 (다중 문서, 자동 로컬 저장)
│   ├── types/cv.ts                  # 이력서 및 디자인 시스템 타입 정의
│   └── utils/pdfExport.ts           # html2canvas & iframe 벡터 인쇄 유틸리티
├── wrangler.toml             # Cloudflare Pages & D1 Database 바인딩 설정
├── schema.sql                # D1 users, user_resumes 테이블 DDL
└── package.json
```

---

## 🚀 로컬 개발 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 📄 라이선스
MIT License
