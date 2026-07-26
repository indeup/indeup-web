# 챗봇 지식 감사 보고서 (Knowledge Audit)

작성일: 2026-07-26 (진행 중 — Q1~330까지 실측 완료, Q331~360 및 변형 샘플은 익일 진행 예정)

## 1. 확인한 공식 페이지

`https://indeup.com/`, `/brand/`, `/products/`, `/products/single-desk/`, `/products/double-desk/`,
`/products/floor-desk/`, `/products/side-table/`, `/products/home-bar-table/`, `/products/frame/`,
`/custom-fit/`, `/guide/`, `/support/`, `/terms/`, `/privacy/` — 총 14개 공식 페이지 + 이를 뒷받침하는
실제 소스 코드(`src/lib/policy.ts`, `products.ts`, `customFit.ts`, `chatCatalog.ts`, `worker/worker.js`)를
1차 자료로 직접 확인.

## 2. 수집한 공식 사실

`data/chatbot/official-facts.json`에 **41개 사실**을 구조화해 저장. 분류:

| knowledgeType | 개수 |
|---|---|
| brand | 5 |
| product | 8 |
| material | 1 |
| structure | 1 |
| option | 3 |
| size | 7 |
| production | 1 |
| delivery | 2 |
| assembly | 1 |
| warranty | 2 |
| exchange_return | 2 |
| support | 2 |
| privacy | 2 |
| terms | 1 |
| guide | 1 |
| (link 매핑) | 1 |

각 사실에는 `sourceUrl`/`sourceSection`/`lastCheckedAt`/`status`(verified/incomplete/requires_confirmation)를 부여.

## 3. 발견한 충돌·격차 (`data/chatbot/knowledge-conflicts.json`, 상세는 `chatbot-knowledge-conflicts.md`)

**페이지 간 실제 수치 충돌은 0건.** 보증기간(3년)·제작기간(7~8영업일)·운영시간 등 핵심 정책값은
`policy.ts` 단일 소스에서 파생되어 일관됨을 확인.

다만 실제 위험도가 있는 항목 **9건**을 `requires_confirmation`/`incomplete`로 표시:

1. 상판 5종/프레임 2종 색상·컴퓨터책상 멀티탭 개수 — 공식 페이지 텍스트에는 없고 `worker.js` 시스템
   프롬프트에만 명시됨 (미검증 확정 답변 리스크)
2. 홈바테이블 기본 높이(720mm)가 "서서 사용하는 높은 테이블"이라는 마케팅 문구와 실제 기본값이
   다름(커스터마이징 없이는 데스크 높이로 출고)
3~5. 제주/도서산간 배송비, 단순변심 반품비, 승인된 최대 하중 — 사이트 전체에 수치 없음(충돌이
   아니라 부재, 현재는 안전하게 상담 연결로 처리됨)
6. `public/jump.gif`(products 히어로 배경)가 여전히 사람이 책상 위에 올라선 모습 — alt 텍스트는
   이전 라운드에 수정했으나 이미지 자체는 미교체 (재차 확인, 계속 미해결)
7. 개인정보처리방침의 "마스킹" 문구가 Anthropic 전송분까지 마스킹되는 것으로 오인될 여지(문구 명확화 권장, 선택사항)

## 4. 확인이 필요한 항목 (운영자 결정 대기)

리포트 6가지 상세 항목은 `chatbot-knowledge-conflicts.md` 참고. 요약하면:
색상/멀티탭 구성 값 검증, 홈바테이블 기본높이 안내 방식, 제주/도서산간 배송비, 반품비, 최대 하중,
jump.gif 교체 여부 — 총 6가지가 운영자의 실제 정책 확정을 기다리는 상태입니다.

## 5. 알려진 한계

- `option-001`/`option-002`(색상), `delivery-001`(배송비), `warranty-002`(보증 세부범위),
  `exchange_return-002`(반품비), `safety-001`(최대 하중)은 사이트 전체에 걸쳐 정보 자체가 없어
  `incomplete`로 남겨두었습니다 — 챗봇은 이 항목들을 추측하지 않고 상담 연결로 처리 중이며, 이는
  실제 라이브 테스트(Q246, Q250, Q262 등)로 확인된 정상 동작입니다.
