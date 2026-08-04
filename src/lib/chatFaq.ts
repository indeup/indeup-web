/**
 * Rule-based fast answers for the AI chat widget. Matched entirely on the
 * client (see ChatWidget.tsx) before any network call is made — an exact
 * hit means zero latency, zero API cost and a guaranteed-consistent answer
 * for the questions customers ask most. Anything that doesn't match falls
 * through to the AI worker.
 *
 * `keywords` are plain-substring checks (all of them must appear in the
 * lowercased, whitespace-stripped user message) — deliberately not fuzzy
 * matching, since a wrong silent match here is worse than falling through
 * to the AI.
 */
import { policyData } from "./policy";
import type { GuideLinkId } from "./chatCatalog";

export type ChatFaqEntry = {
  id: string;
  /** Each inner array is one AND-group of keywords; any group matching is a hit (OR across groups). */
  keywordGroups: string[][];
  answer: string;
  linkIds?: GuideLinkId[];
  quickReplies?: string[];
};

export const chatFaqs: ChatFaqEntry[] = [
  {
    id: "production-days",
    // "배송" + "얼마" alone used to match "도서산간 배송비 얼마예요?" (a fee
    // question, not a duration question) before regional-shipping-fee ever
    // got a chance — confirmed as a real bug 2026-07-31 via live chatbot QA.
    // Requiring "걸리" scopes this to genuine "how long" questions.
    keywordGroups: [["제작", "기간"], ["배송", "얼마나", "걸리"], ["언제", "와"], ["언제", "오"]],
    answer: `주문 확인 후 일반적으로 ${policyData.productionDays}이 필요합니다. ${policyData.productionExcludes}은 제작 기간에서 제외됩니다.`,
    linkIds: ["delivery"],
  },
  {
    id: "production-excludes-weekend",
    keywordGroups: [["주말", "제작"], ["공휴일", "제작"], ["주말", "포함"]],
    answer: `${policyData.productionExcludes}은 제작 기간 계산에서 제외됩니다. 그 외 영업일 기준으로 ${policyData.productionDays}이 필요합니다.`,
    linkIds: ["delivery"],
  },
  {
    id: "size-unit",
    keywordGroups: [["10mm", "단위"], ["mm", "단위", "조정"]],
    answer: "가로와 높이는 제품별 선택 범위 안에서 10mm 단위로 조정해 제작합니다.",
    linkIds: ["customFit"],
  },
  {
    id: "how-to-measure",
    keywordGroups: [["사이즈", "측정"], ["치수", "재는"], ["사이즈", "재는"]],
    answer: "설치할 공간의 가로·세로(깊이)·높이를 mm 단위로 측정한 뒤, 사이즈 계산기에 입력하면 제작 가능 여부를 바로 확인할 수 있습니다.",
    linkIds: ["customFit"],
  },
  {
    id: "assembly",
    keywordGroups: [["조립", "방법"], ["조립", "어려"], ["조립", "힘들"]],
    answer: "조립에 필요한 부품과 설명서가 제품과 함께 제공됩니다. 별도 공구 없이 약 10~15분이면 조립이 끝나는 간단한 구조입니다.",
    linkIds: ["assembly"],
  },
  {
    id: "missing-parts",
    keywordGroups: [["부품", "누락"], ["나사", "빠졌"], ["나사", "없"], ["부품", "빠졌"]],
    answer: "부족한 부품 종류와 수량을 확인해 주문자명 또는 주문번호와 함께 네이버 톡톡으로 보내주시면 빠르게 보내드립니다.",
    linkIds: ["naverTalk"],
  },
  {
    id: "damage",
    keywordGroups: [["파손"], ["부서져"], ["깨져서"]],
    answer: "파손 부위와 포장 박스를 사진으로 남긴 뒤 주문자명 또는 주문번호와 함께 네이버 톡톡으로 보내주세요. 확인 후 무료 교환을 안내합니다.",
    linkIds: ["naverTalk", "damageSupport"],
  },
  {
    id: "as-request",
    keywordGroups: [["a/s"], ["에이에스"], ["as", "접수"]],
    answer: "제품 상태와 증상을 사진과 함께 네이버 톡톡으로 보내주시면 확인 후 A/S를 안내합니다.",
    linkIds: ["naverTalk"],
  },
  {
    id: "warranty",
    keywordGroups: [["보증", "기간"], ["보증", "몇"], ["무상보증"]],
    answer: `${policyData.warrantyYears}년 무상보증을 제공합니다. 보증 대상과 조건은 고객지원 페이지에서 확인할 수 있습니다.`,
    linkIds: ["support"],
  },
  {
    id: "digital-warranty",
    keywordGroups: [["디지털", "보증서"], ["보증서", "발급"]],
    answer: "구매가 완료되면 네이버 N컬렉션 디지털 보증서가 자동으로 발급됩니다. 별도 등록은 필요하지 않습니다.",
    linkIds: ["support"],
  },
  {
    id: "exchange-return",
    keywordGroups: [["교환", "반품", "어디"], ["교환", "신청"], ["반품", "신청"]],
    answer: "네이버 톡톡으로 고객센터에 문의해 주세요. 가장 빠르게 확인해 드립니다. 배송 파손이나 제작 오류로 확인되면 무료로 교환해 드립니다. 재신 치수와 실제 공간이 맞지 않는 경우에도 최초 1회에 한해 사이즈를 다시 확인한 뒤 무상으로 교환해 드리니 편하게 문의해 주세요. 인디업 책상은 고객님만을 위한 사이즈로 제작하는 맞춤형 상품이라, 단순 변심이나 사용 흔적이 있는 경우의 반품은 어려운 점 양해 부탁드립니다.",
    linkIds: ["naverTalk"],
  },
  {
    id: "naver-talk",
    keywordGroups: [["상담원"], ["톡톡", "상담"], ["상담", "연결"]],
    answer: "네이버 톡톡에서 인디업 상담을 받을 수 있습니다.",
    linkIds: ["naverTalk"],
  },
  {
    id: "store-location",
    keywordGroups: [["스토어", "어디"], ["구매", "어디"], ["어디서", "사"]],
    answer: "인디업 제품은 네이버 브랜드스토어에서 구매할 수 있습니다.",
    linkIds: ["storeAll"],
  },
  {
    id: "custom-fit-explainer",
    keywordGroups: [["custom-fit"], ["커스텀핏"], ["custom fit"]],
    answer: "책상 가로·세로·높이를 입력해 제작 가능 여부를 확인하는 페이지입니다.",
    linkIds: ["customFit"],
  },
  {
    id: "order-status",
    keywordGroups: [["주문번호", "조회"], ["배송", "조회"], ["출고일"], ["언제", "출고"]],
    answer: "정확한 확인이 필요한 내용입니다. 네이버 톡톡으로 문의해 주세요.",
    linkIds: ["naverTalk"],
  },
  {
    id: "jeju-shipping-fee",
    keywordGroups: [["제주", "배송"], ["제주", "가능"], ["제주도"]],
    answer:
      "네, 제주도도 배송 가능합니다. 제품 1개 기준으로 1인용 계열은 18,000원, 2인용 계열은 24,000원의 추가 배송비가 발생합니다. 인디업은 경동화물 택배를 이용하고 있어, 평소 거주하시는 지역에서 경동화물 택배를 받아보신 적이 있다면 배송 가능한 지역입니다.",
    linkIds: ["naverTalk"],
    // 제주 얘기 다음엔 자연스럽게 "다른 섬 지역은요?"가 궁금해지는 경우가
    // 많아 바로 그 답으로 이어지는 버튼을 붙였다 — 문구는 반드시
    // regional-shipping-fee의 키워드 그룹("도서"+"배송")과 실제로 매칭되도록
    // 맞춰 씀.
    quickReplies: ["도서산간 배송비는요?"],
  },
  {
    id: "regional-shipping-fee",
    keywordGroups: [["도서", "배송"], ["산간", "배송"], ["추가", "배송비"]],
    answer:
      "네, 도서산간 지역도 배송 가능합니다. 제품 1개 기준으로 1인용 계열은 36,000원, 2인용 계열은 48,000원의 추가 배송비가 발생합니다. 인디업은 경동화물 택배를 이용하고 있어, 평소 거주하시는 지역에서 경동화물 택배를 받아보신 적이 있다면 배송 가능한 지역입니다.",
    linkIds: ["naverTalk"],
    quickReplies: ["제주도는요?"],
  },
  {
    id: "local-area-shipping",
    // Was ordered BEFORE regional-shipping-fee, and its ["지역","배송","되"]
    // group is broad enough to match "산간지역도 배송비 추가되나요?" too —
    // "산간지역" contains "지역", so it silently stole that question away
    // from regional-shipping-fee before this entry moved down. Confirmed
    // 2026-07-31 via live chatbot QA. Dropped that group entirely (redundant
    // with "여기"+"배송"+"되" anyway) rather than just reordering, so a
    // future regional/topic word containing "지역" can't repeat this.
    keywordGroups: [["우리", "동네", "배송"], ["저희", "동네", "배송"], ["여기", "배송", "되"]],
    answer:
      "인디업은 경동화물 택배를 이용하고 있어, 평소 거주하시는 지역에서 경동화물 택배를 받아보신 적이 있다면 배송 가능한 지역입니다. 제주도·도서산간은 별도 추가 배송비가 있으니 궁금하시면 다시 물어봐 주세요.",
  },
  {
    id: "size-input-direct",
    keywordGroups: [["원하는", "사이즈", "입력"]],
    answer: "책상 가로·세로·높이를 입력하면 제작 가능 여부를 바로 확인할 수 있습니다.",
    linkIds: ["customFit"],
  },
  {
    id: "space-based-recommend",
    keywordGroups: [["내방", "공간", "추천받기"], ["방", "공간에", "맞는", "책상", "추천"]],
    answer: "공간의 가로·세로 거리와 사용 인원을 입력하면 딱 맞는 책상을 추천해 드립니다. 아래 책상가이드에서 확인해 주세요.",
    linkIds: ["spaceGuide"],
  },
  {
    // Operator-specified exact chatbot answer (2026-08-01) — deliberately a
    // fixed local FAQ, not left to the AI to compute from the real price
    // table, so the wording never drifts from what the operator wants said
    // here. Does NOT reflect the actual product-page price table (that
    // stays untouched — see pricingData.ts).
    id: "computer-vs-plain-price-diff",
    keywordGroups: [["단품", "컴퓨터책상", "차이"], ["단품", "컴퓨터책상", "가격"]],
    answer:
      "동일한 사이즈 기준으로, 1인용은 책상 단품과 컴퓨터책상의 가격 차이가 30,000원, 2인용은 50,000원입니다. 컴퓨터책상에는 멀티탭거치대가 기본 포함되어 있어 그만큼 가격이 더 높습니다.",
    linkIds: ["storeAll"],
  },
  {
    id: "climb-on-desk",
    keywordGroups: [["올라가도"], ["올라서도"], ["밟고", "올라"]],
    answer: "책상은 작업용 가구이므로 사람이 올라가는 용도로 사용하면 안 됩니다. 구조가 튼튼해도 안전을 위해 올라가지 마세요.",
  },
  {
    // Deliberately LAST: its single-keyword groups (["얼마예요"] etc.) match
    // almost any "OO 얼마예요?" question regardless of topic — it used to sit
    // near the top and silently steal questions like "도서산간 배송비
    // 얼마예요?" away from regional-shipping-fee before that entry ever got a
    // chance to match. matchFaq() returns the first hit in array order, so
    // keeping every specific-topic entry above this one means they always
    // win when they legitimately apply; this only catches genuinely generic
    // price questions that don't match anything more specific.
    //
    // Dropped the old ["가격","얼마"] group (2026-07-31, live QA): "얼마" as a
    // bare substring also matches "얼마나" (e.g. "가격 차이가 얼마나 나나요?"),
    // which deflected an answerable comparative question into this vague
    // fallback even though the AI has real numbers for both products — the
    // remaining exact-form groups (얼마예요/얼마임/얼마인가요) still cover the
    // overwhelming majority of genuine generic price questions.
    id: "price",
    keywordGroups: [["가격이"], ["얼마예요"], ["얼마임"], ["얼마인가요"]],
    answer: "가격은 선택한 크기와 옵션에 따라 달라집니다. 공식 스토어에서 현재 가격을 확인해 주세요.",
    linkIds: ["storeAll"],
    quickReplies: ["1인용 책상", "2인용 책상", "좌식 책상", "사이드테이블"],
  },
];

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export function matchFaq(userMessage: string): ChatFaqEntry | null {
  const normalized = normalize(userMessage);
  for (const entry of chatFaqs) {
    const hit = entry.keywordGroups.some((group) => group.every((kw) => normalized.includes(normalize(kw))));
    if (hit) return entry;
  }
  return null;
}
