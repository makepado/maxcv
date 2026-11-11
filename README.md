# MaxCV (FlowCV क्ल론 & 한국어 무료 폰트 특화 이력서/CV 빌더)

**MaxCV**는 FlowCV가 제공하는 올인원 이력서 제작 경험을 완벽히 구현하고, **20종의 한국어 무료 웹폰트(고딕, 명조·바탕, 디스플레이, 고정폭 코딩 폰트)**와 **Cloudflare D1 SQLite 데이터베이스(`hongjae1db`) 클라우드 동기화**를 지원하는 웹 애플리케이션입니다.

## 주요 기능
- **한국어 무료 폰트 20종 완벽 지원**:
  - **고딕 (Sans-serif)**: 프리텐다드(Pretendard), 원티드 산스(Wanted Sans), 수트(SUIT), 스포카 한 산스 네오, 본고딕(Noto Sans KR), 나눔스퀘어 네오, IBM Plex Sans KR, 고운돋움, 나눔고딕
  - **명조·바탕 (Serif)**: 마루부리(MaruBuri), 리디바탕(RIDIBatang), 코펍월드바탕(KoPubWorld Batang), 본명조(Noto Serif KR), 함렛(Hahmlet), 고운바탕, 나눔명조, 조선일보명조, 송명
  - **타이틀·디스플레이 (Display)**: 페이퍼로지(Paperlogy), 지마켓 산스(Gmarket Sans), 에스코어 드림(S-Core Dream)
  - **고정폭·개발자 (Monospace)**: D2Coding, JetBrains Mono + 프리텐다드 하이브리드
- **세밀한 한글 타이포그래피 제어**: 제목/본문 폰트 개별 조합, 글자 크기 배율, 줄간격, 자간, 굵기, 어절 단위 줄바꿈(`word-break: keep-all`) 제어
- **FlowCV 15개 전체 섹션 지원**: 인적사항(증명사진 모양/크기/흑백 필터, 소셜 링크, 커스텀 필드), 자기소개, 경력사항, 프로젝트, 학력사항, 보유 기술, 어학 능력, 자격증, 수상 내역, 논문 및 출판, 교육 이수, 대외활동, 소속 학회, 관심 분야, 추천인, 사용자 정의 섹션
- **실시간 레이아웃 & 디자인 커스터마이저**: 1단 / 2단 좌·우 사이드바 레이아웃, 사이드바 비율 조절, 섹션 간격, 여백, 날짜 포맷 일괄 변경, 포인트 컬러 테마
- **벡터 PDF 인쇄 및 Cloudflare D1(`hongjae1db`) 연동**: 텍스트 선택 및 링크 클릭이 가능한 고화질 벡터 PDF 내보내기, JSON 백업/복원, Cloudflare Pages Functions + D1 SQLite 영구 저장
