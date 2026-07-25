# 인디업(indeup.com) 검색엔진 등록 체크리스트

이 문서는 개발 지식이 없어도 순서대로 따라 할 수 있도록 작성했습니다. 카페24에 실제로 파일을 업로드한 뒤부터 진행하세요.

---

## 0. 시작 전 준비물

- 카페24 호스팅 관리자 로그인 정보
- 가비아(또는 도메인을 구매한 곳) DNS 관리자 로그인 정보
- `indeup.com` 도메인 소유 권한
- 네이버 아이디(개인 또는 브랜드 계정)
- 구글 계정

---

## 1단계: 배포와 기술 확인 (가장 먼저)

1. 카페24에 `out/` 폴더 안의 모든 파일을 웹 루트에 업로드합니다. (`.htaccess`, `robots.txt`, `sitemap.xml`, `rss.xml`, `llms.txt`, 확인용 키 파일까지 전부 포함)
2. 카페24에서 SSL(HTTPS) 인증서가 적용되어 있는지 확인합니다. 카페24 호스팅 관리자 화면에 무료 SSL 발급 메뉴가 있습니다.
3. 브라우저에서 아래 주소를 하나씩 열어 전부 `https://indeup.com/...`로 자동 이동하는지 확인합니다.
   - `http://indeup.com`
   - `http://www.indeup.com`
   - `https://www.indeup.com`
   - (이 리디렉션은 이미 `.htaccess`에 구현되어 있습니다. SSL 인증서만 설치되면 바로 작동합니다.)
4. 다음 주소가 실제로 열리는지 확인합니다.
   - `https://indeup.com/robots.txt`
   - `https://indeup.com/sitemap.xml`
   - `https://indeup.com/rss.xml`
   - `https://indeup.com/llms.txt`
5. 존재하지 않는 주소(`https://indeup.com/이런페이지없음`)에 접속했을 때 인디업 디자인의 404 페이지가 뜨는지 확인합니다.
6. 아무 페이지에서나 마우스 우클릭 → "페이지 소스 보기"를 열어, 제목과 본문 텍스트가 자바스크립트 실행 없이도 소스에 그대로 보이는지 확인합니다.

이 단계가 끝나기 전까지는 아래 2단계(검색엔진 등록)를 진행해도 정상적으로 수집되지 않습니다.

---

## 2단계: 검색엔진 등록

### 2-1. 네이버 서치어드바이저

1. https://searchadvisor.naver.com 접속 후 로그인
2. "웹마스터 도구" → "사이트 등록"에서 `https://indeup.com` 입력
3. 소유확인 방법 선택 (HTML 파일 업로드 또는 메타태그 방식 중 하나)
   - 메타태그 방식을 쓰는 경우, 발급받은 값을 환경변수 `NAVER_SITE_VERIFICATION`에 넣고 다시 빌드하면 `<meta name="naver-site-verification">` 태그가 자동으로 추가됩니다. (이 사이트 코드에 이미 구현되어 있습니다.)
4. 소유확인 완료 후 "요청 → 사이트맵 제출"에서 `https://indeup.com/sitemap.xml` 제출
5. "요청 → RSS 제출"에서 `https://indeup.com/rss.xml` 제출
6. "요청 → 웹페이지 수집" 에서 다음 주요 페이지를 하나씩 수집 요청
   - `https://indeup.com/`
   - `https://indeup.com/brand/`
   - `https://indeup.com/products/`
   - `https://indeup.com/guide/`
   - `https://indeup.com/custom-fit/`
   - `https://indeup.com/support/`
7. 2~4주 뒤 "요청 → 최적화" 및 "노출현황"에서 색인된 페이지 수, 검색어, 오류를 확인

**주의:**
- 네이버는 사이트 등록만으로 노출되지 않습니다. 실제로 로봇(Yeti)이 콘텐츠를 수집하고 품질을 평가해야 검색결과에 나타납니다.
- `robots.txt`나 방화벽에서 Yeti를 차단하지 마세요 (이미 허용되어 있습니다).
- `nosourceinfo` 메타태그는 사용하지 않습니다 (AI 자동 출처 설명에서 제외될 수 있음).

### 2-2. Google Search Console

1. https://search.google.com/search-console 접속
2. "도메인" 속성으로 `indeup.com` 추가 (www 포함 모든 하위 주소가 자동으로 포함됨)
3. 소유확인은 DNS TXT 레코드 방식을 권장합니다 (가비아 DNS 관리 화면에서 TXT 레코드 추가). HTML 태그 방식을 쓰려면 `GOOGLE_SITE_VERIFICATION` 환경변수에 값을 넣고 재빌드하세요.
4. "Sitemaps" 메뉴에서 `sitemap.xml` 제출
5. "URL 검사" 도구로 홈페이지와 주요 페이지를 하나씩 검사 후 "색인 생성 요청" 클릭
6. 이후 확인할 항목:
   - "페이지" 리포트: 색인된 페이지 수, 제외된 페이지와 사유
   - "Core Web Vitals": 모바일 성능 점수
   - "모바일 사용성": 오류 여부
   - "향상 기능 → 관련 구조화된 데이터": Organization, Article, FAQ, BreadcrumbList 오류 여부
   - "보안 및 수동 조치": 문제 없음 확인

**주의:**
- 직접 결제가 불가능한 공식 홈페이지이므로 Google Merchant Center/Merchant Listing은 무리하게 연결하지 않습니다.
- Google Business Profile은 고객이 실제로 방문·상담할 수 있는 사업장이 있을 때만 등록합니다.

### 2-3. Bing Webmaster Tools

1. https://www.bing.com/webmasters 접속
2. Google Search Console 계정으로 가져오기(Import) 기능을 사용하면 사이트와 사이트맵이 한 번에 연동됩니다. (직접 등록도 가능)
3. "Sitemaps"에서 `sitemap.xml` 제출
4. "URL Inspection"으로 주요 페이지 제출
5. "IndexNow" 메뉴에서 이 사이트가 제출한 URL 내역이 보이는지 확인 (아래 IndexNow 섹션 참고)
6. Bingbot이 차단되지 않았는지 확인 (이미 허용됨)

Bing 색인은 Bing 자체 검색 외에도 Microsoft Copilot, Yahoo·DuckDuckGo 검색 결과 일부에 영향을 주므로 반드시 등록합니다.

### 2-4. Daum·Kakao

1. Daum 검색등록: https://register.search.daum.net 에서 `https://indeup.com` 등록 신청
   - 사이트 제목과 설명은 실제 홈페이지 `<title>`, meta description과 일치시킵니다.
2. 실제로 방문 가능한 매장·쇼룸이 있는 경우에만 Kakao맵에 장소 등록 (상호, 전화번호, 주소, 홈페이지 URL을 다른 채널과 동일하게 입력)
3. 단순 제작 작업장이라면 Kakao맵/네이버 스마트플레이스 등록은 생략합니다 (실제 방문 불가능한 주소를 방문 가능한 매장처럼 등록하지 않습니다).

### 2-5. IndexNow (Bing 및 참여 엔진 대상, 선택)

- 이 사이트의 IndexNow 키 파일: `https://indeup.com/46a0a0be398a58ed1e9f600d2283a7da.txt`
- 새 글이나 페이지를 배포한 뒤, 터미널에서 다음처럼 실행해 바뀐 주소만 제출합니다.

  ```
  node scripts/indexnow-submit.mjs https://indeup.com/guide/새글주소/
  ```

- **주의: 이 사이트는 카페24에 수동 업로드하는 방식이라 자동 배포 파이프라인이 없습니다.** 그래서 IndexNow 제출도 "실제로 파일을 새로 업로드한 직후" 사람이 직접 실행하는 수동 단계로 남겨뒀습니다. 자동화하면 실제로 바뀌지 않은 페이지까지 매번 제출하게 되어 IndexNow 자체 가이드라인에도 어긋납니다.
- 네이버와 구글은 현재 IndexNow를 사용하지 않으므로, 이 단계는 sitemap·서치어드바이저 제출을 "대체"하지 않고 "보완"합니다.

---

## 3단계: 공식 채널 정리 (전부 완료 시 체크)

각 채널의 프로필/소개란에 `https://indeup.com`이 홈페이지로 연결되어 있는지 확인하세요.

- [ ] 네이버 브랜드스토어 (`https://brand.naver.com/indeup`) 브랜드 소개에 홈페이지 링크
- [ ] 네이버 블로그 (`https://blog.naver.com/indeup_official`) 프로필에 홈페이지 링크
- [ ] 티스토리 (`https://indeup.tistory.com/`) 사이드바에 홈페이지 링크
- [ ] YouTube (`https://www.youtube.com/@indeup`) 채널 정보란에 홈페이지 링크
- [ ] Instagram (`https://www.instagram.com/indeup.kr`) 프로필 링크에 홈페이지

모든 채널에서 브랜드명(인디업/INDEUP), 로고, 연락처(1668-5738)를 동일하게 유지하세요.

---

## 4단계: 2~4주 뒤 점검

- 네이버·구글·빙 각 웹마스터 도구에서 색인된 페이지 수 확인
- "인디업", "INDEUP" 브랜드 검색 시 공식 홈페이지가 나오는지 확인
- 잘못된 title·description으로 표시되는 페이지가 있는지 확인
- Core Web Vitals·모바일 사용성 오류 확인
- 구조화 데이터 오류 확인
- ChatGPT, Perplexity, 네이버 AI 검색 등에 "인디업 책상"을 검색해 정보가 올바르게 인용되는지 직접 확인 (오류가 있으면 홈페이지 본문 내용부터 수정)

---

## 검색엔진·AI 서비스별 연결 관계 (참고용 설명)

| 검색·AI 서비스 | 관련된 크롤러/도구 |
|---|---|
| 네이버 검색·네이버 AI 검색 | Yeti, 네이버 서치어드바이저, sitemap, RSS |
| 구글 검색, Gemini 기반 구글 AI 검색 | Googlebot, Search Console, sitemap |
| 빙 검색, Microsoft Copilot | Bingbot, Bing Webmaster Tools, sitemap, IndexNow |
| ChatGPT 검색 | OAI-SearchBot |
| Claude 검색 | Claude-SearchBot, Claude-User |
| Perplexity 검색 | PerplexityBot |
| Daum 검색 | Daum 검색등록, 자체 수집 |
| Yahoo, DuckDuckGo 등 일부 결과 | Bing 색인의 영향을 받는 경우가 있음 |

이 표는 "이 봇을 허용하면 그 검색·AI 서비스에 반드시 노출된다"는 뜻이 아니라, "이 봇을 차단하면 그 서비스에서 원천적으로 발견될 수 없다"는 최소 조건을 설명한 것입니다.

---

## 현실적인 기준 (반드시 기억할 것)

- 검색엔진 등록은 상위 노출을 보장하지 않습니다.
- sitemap 제출은 색인을 보장하지 않습니다.
- 구조화 데이터(JSON-LD)는 리치 결과를 보장하지 않습니다.
- AI 크롤러를 허용한다고 해서 AI가 반드시 인디업을 인용하는 것은 아닙니다.
- `llms.txt`는 모든 AI 검색 서비스가 요구하는 공식 표준이 아니라 보조 안내 파일입니다.
- 가장 중요한 것은 홈페이지 안의 실제 텍스트 정보가 정확하고, 검색엔진이 읽을 수 있는 형태(HTML)로 존재하는 것입니다.
