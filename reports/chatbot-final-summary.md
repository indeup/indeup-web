# 인디업 AI 챗봇 전면 검증 — 1일차 진행 보고서

작성일: 2026-07-26 (진행 중 — 완료 아님. Q331~360 + 표현 변형 200개 이상 + 대화기억/모바일 테스트는
2일차로 이월)

> 지침 2번("백그라운드 실행 중이라고만 말하고 종료하지 않는다")에 따라, 아래 수치는 전부 이 세션
> 안에서 실제로 실행하고 확인한 결과만 기록했습니다. 실행하지 않은 항목은 "미실행"으로 명시합니다.

---

## 데이터 수집 결과

- 확인한 공식 페이지 수: **14개** (`/`, `/brand/`, `/products/` 및 6개 제품 상세, `/custom-fit/`,
  `/guide/`, `/support/`, `/terms/`, `/privacy/`)
- 수집한 공식 사실 수: **41개** (`data/chatbot/official-facts.json`)
- 페이지 간 실제 충돌: **0건**
- 확인이 필요한 항목(requires_confirmation/incomplete): **9건** (`chatbot-knowledge-conflicts.md`)

## 질문 데이터

- 핵심 질문 수: **정확히 360개** (`data/chatbot/canonical-questions.json`, 카테고리 A~N 전부 스펙과
  동일한 개수로 생성 완료)
- 표현 변형 수: **정확히 1,440개** (`data/chatbot/question-variants.json`, 질문당 4개: 구어체/오타/
  단위변환/이어지는 표현)
- 카테고리별 질문 수: A_brand 15, B_recommendation 25, C_single_desk 25, D_double_desk 25,
  E_floor_desk 20, F_side_table 15, G_home_bar_table 15, H_frame 15, I_sizing 55, J_materials 35,
  K_order_delivery 35, L_assembly_as 35, M_general_knowledge 25, N_safety 9, N_privacy 3,
  N_security 6, N_copyright 2 (합계 360)

## 실제 테스트 (1일차 실행분)

| 항목 | 수치 |
|---|---|
| 실행한 핵심 질문 수 | **330개 / 360개** (Q001~Q330, Q331~Q360 미실행) |
| 실행한 표현 변형 수 | **0개** (2일차 예정 — 최소 200개 목표) |
| 통과(pass) | **203개** |
| 실패(fail) | **128개** — **전량 `service_unavailable`(Anthropic API 호출 자체 실패)이 원인이며, 답변 내용·안전성·개인정보·저작권 문제로 인한 실패는 0건** |
| 차단(blocked) | 0개 |
| 평균 응답시간(성공 응답 기준) | 약 20~25초 |
| 가장 느린 응답시간 | 약 51.9초 (Q305, 다만 이것도 최종적으로 outage로 실패 처리된 건) |
| 대화기억(context-memory.spec.ts) | **미실행** |
| 모바일(mobile.spec.ts) | **미실행** |

### 마지막으로 완료한 질문 번호: **Q330**

### 중단된 정확한 이유

세션 중 Anthropic API가 두 차례 장애를 일으켰습니다:
1. **1차 (Q036~Q180 구간, 배치 2~6):** 크레딧 소진으로 추정 — 사용자가 $10 충전 후 재개, Q181부터
   정상 응답 확인.
2. **2차 (Q305~Q309, 배치 11 도중):** 재개 후에도 5건이 다시 `service_unavailable`로 실패, 직접
   curl로 3회 연속 재현 확인 — 크레딧 잔액과는 별개로 **월간 사용 한도(Limits)** 등 다른 원인일
   가능성이 있어 사용자에게 Anthropic Console의 Limits/Usage 페이지 확인을 요청한 상태.
3. 사용자가 "오늘은 여기까지, 내일 이어서 하자"고 지시하여 **Q331 이후 및 실패 128건 재검증은
   중단**했습니다.

## 수정 결과 (1일차)

- **수정한 파일**: `tests/chatbot/qa-runner.ts` (fallback 텍스트를 감지해 무조건 실패 처리하도록
  수정), `worker/worker.js` (API 오류 시 상태코드+본문을 500자로 잘라 KV에 7일간 보관하도록 개선 —
  **아직 Cloudflare에 재배포 전**)
- **새로 만든 파일**: `data/chatbot/official-facts.json`, `knowledge-conflicts.json`,
  `canonical-questions.json`, `question-variants.json`, `product-links.json`, `guide-links.json`,
  `prohibited-claims.json`, `approved-answers.json`; `tests/chatbot/qa-runner.ts`,
  `brand.spec.ts`, `products.spec.ts`, `sizing.spec.ts`, `recommendation.spec.ts`,
  `materials-options.spec.ts`, `order-delivery.spec.ts`, `support.spec.ts`,
  `general-knowledge.spec.ts`, `context-memory.spec.ts`, `privacy-security.spec.ts`,
  `copyright.spec.ts`, `mobile.spec.ts`; `scripts/chatbot-qa/generate-questions.mjs`,
  `scripts/chatbot-qa/correct-existing-results.mjs`; `reports/chatbot-knowledge-audit.md`,
  `chatbot-knowledge-conflicts.md`, `chatbot-live-results.csv`, `chatbot-failed-results.csv`,
  이 파일(`chatbot-final-summary.md`)
- **수정한 공식 데이터**: 없음 (이번 라운드는 감사·테스트 인프라 구축이 중심, 실제 콘텐츠 버그는
  지난 라운드에서 이미 수정·배포 완료)
- **수정한 시스템 프롬프트**: 없음 (이번 라운드에서 챗봇 답변 자체의 실패는 0건 확인됨)
- **수정한 링크**: 없음
- **수정한 답변 로직**: 없음
- **수정한 대화 기억 로직**: 없음 (테스트 자체가 아직 미실행)

**203건의 실제 성공 응답 중 사실 오류·잘못된 추천·잘못된 링크·개인정보 노출·안전하지 않은 답변·
저작권 위반은 단 한 건도 발견되지 않았습니다.** 실패는 전부 API 인프라 문제였습니다.

## 남아있는 문제 (2일차로 이월)

- **사용자 확인 필요**: Anthropic Console의 크레딧/Limits 상태 (2차 장애 원인), jump.gif 교체 여부,
  색상 5종/2종 및 멀티탭 개수 실제 판매 옵션과의 일치 여부, 제주/도서산간 배송비, 반품비, 최대 하중
- **법률 검토 필요**: 개인정보처리방침 제6조(국외이전) 고지 방식이 개인정보보호법 요건을 충분히
  충족하는지
- **개인정보처리방침 반영 검토**: "마스킹" 문구가 Anthropic 전송분까지 포함하는 것으로 오인되지
  않도록 문구 보강(선택)
- **제품별 구매 URL 누락**: 1인용 컴퓨터책상 400/500mm 폭 — 네이버 상품 링크 없음(기존에 이미
  확인된 항목, 계산기가 자동으로 스토어 전체보기로 대체)
- **공식 데이터 누락**: 배송비, 반품비, 최대 하중 (안전하게 상담 연결로 처리 중, 위험은 낮음)
- **아직 실행하지 못한 테스트**:
  - Q331~Q360 (30개 — M 카테고리 잔여 10개 + N 전체 20개)
  - 128건 실패 재검증 (API 정상화 확인 후)
  - 표현 변형 최소 200개 샘플 (오타/단위변환/잘못된 전제/이전 대화 연결/개인정보/저작권/안전/
    프롬프트 공격/타사 브랜드 필수 표본 포함)
  - `context-memory.spec.ts` (3개 다회차 시나리오)
  - `mobile.spec.ts` (7개 모바일 뷰포트 테스트)
  - worker.js 개선판 Cloudflare 재배포 및 curl 재확인

## 2일차 진행 계획

1. Anthropic API 상태 재확인 (Console 확인 결과에 따라 조치)
2. 128건 실패 질문 재실행 → 진짜 통과율 확정
3. Q331~Q360 실행
4. 표현 변형 200개 이상 샘플 실행
5. context-memory.spec.ts, mobile.spec.ts(desktop+mobile 프로젝트) 실행
6. worker.js 개선판 배포 확인
7. 완료 기준 19번 항목 전체 재점검 후 최종 완료 보고
