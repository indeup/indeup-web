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
    keywordGroups: [["제작", "기간"], ["배송", "얼마"], ["언제", "와"], ["언제", "오"]],
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
    answer: "조립에 필요한 부품과 설명서가 제품과 함께 제공됩니다. 기본 공구만으로 조립할 수 있는 구조입니다.",
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
    answer: "네이버 톡톡으로 고객센터에 문의해 주세요. 가장 빠르게 확인해 드립니다. 배송 파손이나 제작 오류로 확인되면 무료로 교환해 드립니다. 인디업 책상은 고객님만을 위한 사이즈로 제작하는 맞춤형 상품이라, 단순 변심이나 사용 흔적이 있는 경우의 반품은 어려운 점 양해 부탁드립니다.",
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
    id: "price",
    keywordGroups: [["가격", "얼마"], ["가격이"], ["얼마예요"], ["얼마임"], ["얼마인가요"]],
    answer: "가격은 선택한 크기와 옵션에 따라 달라집니다. 공식 스토어에서 현재 가격을 확인해 주세요.",
    linkIds: ["storeAll"],
    quickReplies: ["1인용 책상", "2인용 책상", "좌식 책상", "사이드테이블"],
  },
  {
    id: "order-status",
    keywordGroups: [["주문번호", "조회"], ["배송", "조회"], ["출고일"], ["언제", "출고"]],
    answer: "정확한 확인이 필요한 내용입니다. 네이버 톡톡으로 문의해 주세요.",
    linkIds: ["naverTalk"],
  },
  {
    id: "regional-shipping-fee",
    keywordGroups: [["제주", "배송"], ["도서", "배송"], ["산간", "배송"], ["추가", "배송비"]],
    answer: "지역별 정확한 추가 배송비는 확인이 필요합니다. 네이버 톡톡으로 문의해 주세요.",
    linkIds: ["naverTalk"],
  },
  {
    id: "climb-on-desk",
    keywordGroups: [["올라가도"], ["올라서도"], ["밟고", "올라"]],
    answer: "책상은 작업용 가구이므로 사람이 올라가는 용도로 사용하면 안 됩니다. 구조가 튼튼해도 안전을 위해 올라가지 마세요.",
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
