import { policyData } from "./policy";

export type ProductFaq = { q: string; a: string };

export type Product = {
  slug: string;
  title: string;
  eyebrow: string;
  image: string;
  /** Category-listing URL on the Naver brand store for this exact product
   *  line (operator-provided, 2026-07-26) — lets a customer land on the
   *  right line directly instead of the generic storefront. */
  purchaseUrl: string;
  listSummary: string;
  metaDescription: string;
  recommendedSpace: string;
  sizeInfo: string;
  material: string;
  structure: string;
  colorInfo: string;
  optionInfo: string;
  leadTime: string;
  shipping: string;
  assembly: string;
  warranty: string;
  faqs: ProductFaq[];
};

export const naverStoreUrl = "https://brand.naver.com/indeup";

export const leadTime = `주문 내용 확인 후 제작에 들어가며, 일반적으로 ${policyData.productionDays}이 필요합니다. ${policyData.productionExcludes}은 제작 기간에서 제외되고, 주문량과 제품 사양에 따라 일정이 달라질 수 있습니다.`;

const shipping =
  "배송 방법과 배송비는 제품과 지역에 따라 달라질 수 있어, 정확한 안내는 네이버 공식 스토어의 상품 상세 정보에서 확인할 수 있습니다. 무거운 제품도 여러 박스로 나누어 보내드려 엘리베이터가 없는 공간까지 옮기기 어렵지 않습니다.";

const assembly =
  "별도 공구 없이 약 10~15분이면 조립이 끝나는 간단한 구조이며, 조립에 필요한 부품과 설명서는 제품과 함께 모두 제공됩니다. 조립 방법에 대한 자세한 안내는 고객지원 페이지 또는 네이버 공식 스토어의 상품 상세 정보에서 확인할 수 있습니다.";

export const warranty = `인디업 책상은 ${policyData.warrantyYears}년 무상보증을 제공합니다. 보증 대상과 적용 조건은 고객지원 페이지의 보증 안내에서 확인할 수 있습니다.`;

export const material =
  "아연도금 철제 프레임과 두께 18mm(18T), E0 등급 LPM 마감 목질 상판을 사용합니다. 상판은 공급사 제공 사양 기준 휨강도 35U이며, 이 수치는 상판 원자재 사양으로 완성된 책상 전체의 최대 사용하중을 의미하지 않습니다.";

export const structure =
  "프레임 연결 부위는 풀용접으로 이어 흔들림을 줄였고, 표면은 분체도장 후 고온에서 경화해 마감합니다(블랙은 무광, 화이트는 반광 마감). 바닥 높이 차이를 조정할 수 있는 회전형 수평 조절발을 기본으로 적용합니다. 18mm 고밀도 상판에 모니터암을 바로 체결할 수 있으며, 최대 3대까지 설치할 수 있습니다.";

/** Deliberately states no max-load figure — see products/[slug]/page.tsx
 *  and worker/worker.js, both of which must stay in sync with this same
 *  no-numeric-load-claim policy. Any future edit here must not reintroduce
 *  a specific kg figure or an implied "safe to stand/jump on" claim. */
export const safetyUsageNotice =
  "본 제품은 모니터, 노트북, 컴퓨터 주변기기 등 일반적인 사무용품을 올려 사용하는 가정·사무용 책상입니다. 제품의 크기, 하중이 가해지는 위치, 설치 바닥 및 조립 상태에 따라 사용 조건이 달라질 수 있어 최대 사용하중은 별도의 수치로 안내하지 않습니다. 무거운 물건은 상판 한쪽에 집중되지 않도록 고르게 배치해 주세요. 제품 위에 앉거나 올라서는 행위, 점프, 강한 충격 및 순간적인 집중하중은 제품 파손이나 안전사고의 원인이 될 수 있으므로 금지합니다. 사용 전 모든 체결부를 단단히 조이고, 조절발을 이용해 제품의 수평을 맞춘 후 사용해 주세요.";

const colorInfo =
  "프레임은 화이트·블랙 2종, 상판은 화이트·블랙·그레이·나무무늬(마인파인츠)·멀바우 5종 중에서 선택할 수 있습니다. 프레임과 상판 색상은 모든 조합으로 자유롭게 선택할 수 있습니다. 실제 선택 화면은 네이버 공식 스토어의 상품 옵션에서 확인해 주세요.";

const optionInfo =
  "전선홀 위치와 방향은 설치 환경과 전선 방향에 맞춰 선택할 수 있습니다. 그 외 옵션은 제품마다 다를 수 있습니다.";

const sizeInfo =
  "가로와 높이는 제품별 선택 범위 안에서 10mm 단위로 조정해 제작합니다. 깊이와 옵션의 선택 단위는 제품에 따라 다르므로, 정확한 제작 가능 범위는 네이버 공식 스토어의 상품 옵션에서 확인해야 합니다.";

const warrantyFaq: ProductFaq = {
  q: "보증기간은 어떻게 되나요?",
  a: `${policyData.warrantyYears}년 무상보증을 제공합니다. 보증 대상과 조건은 고객지원 페이지에서 확인할 수 있습니다.`,
};

const monitorArmFaq: ProductFaq = {
  q: "모니터암을 설치해도 되나요?",
  a: "가능합니다. 18mm 고밀도 상판에 바로 체결할 수 있으며, 최대 3대까지 설치할 수 있습니다.",
};

export const products: Product[] = [
  {
    slug: "single-desk",
    title: "1인용 책상",
    eyebrow: "SINGLE DESK",
    image: "/desk_select.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/15816f103f2242b3a974b443264f2306?cp=1",
    listSummary: "원룸, 작은 방, 서재와 홈오피스를 위한 맞춤형 개인 책상(단품)입니다.",
    metaDescription:
      "인디업 1인용 책상(단품)은 원룸, 작은 방, 서재와 홈오피스에 맞춰 가로와 높이를 10mm 단위로 조정해 제작하는 개인용 맞춤 책상입니다. 아연도금 프레임과 3년 무상보증을 제공합니다.",
    recommendedSpace:
      "원룸, 작은 방, 서재, 홈오피스처럼 한 사람이 사용하는 공간에 어울리는 상판만의 단품 구성입니다. 멀티탭거치대 없이 깔끔하게 쓰고 싶은 분께 적합하며, 필요하면 멀티탭거치대만 별도로 추가 구매할 수도 있습니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "1인용 책상은 어떤 공간에 어울리나요?",
        a: "원룸, 작은 방, 서재와 홈오피스처럼 한 사람이 사용하는 공간에 어울립니다. 사용할 모니터와 장비를 확인한 뒤 크기를 정합니다.",
      },
      {
        q: "컴퓨터책상과는 무엇이 다른가요?",
        a: "이 상품은 상판만 있는 단품 구성으로, 멀티탭거치대가 포함되지 않습니다. 멀티탭거치대가 기본 포함된 구성은 '1인용 컴퓨터책상' 라인에서 확인할 수 있습니다.",
      },
      {
        q: "제작 기간은 얼마나 걸리나요?",
        a: `일반적으로 ${policyData.productionDays}이 필요합니다. ${policyData.productionExcludes}은 제외되며 주문량과 사양에 따라 달라질 수 있습니다.`,
      },
      warrantyFaq,
    ],
  },
  {
    slug: "single-desk-computer",
    title: "1인용 컴퓨터책상",
    eyebrow: "SINGLE DESK · COMPUTER",
    image: "/one_person_desk.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/ec76e3aa30b6421c993200cc014f3b21?cp=1",
    listSummary: "모니터·PC·주변기기를 정리해 쓰는 1인용 컴퓨터책상, 멀티탭거치대 1개가 기본 포함됩니다.",
    metaDescription:
      "인디업 1인용 컴퓨터책상은 멀티탭거치대가 기본 포함된 개인용 맞춤 책상입니다. 원룸, 작은 방, 서재와 홈오피스에 맞춰 가로와 높이를 10mm 단위로 조정해 제작하며, 아연도금 프레임과 3년 무상보증을 제공합니다.",
    recommendedSpace:
      "원룸, 작은 방, 서재, 홈오피스처럼 한 사람이 컴퓨터·모니터·주변기기를 두고 사용하는 공간에 어울립니다. 멀티탭거치대 1개가 기본 포함되어 전선을 깔끔하게 정리할 수 있고, 18mm 고밀도 상판에 모니터암도 바로 체결할 수 있습니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "책상(단품)과는 무엇이 다른가요?",
        a: "이 상품은 멀티탭거치대 1개가 기본 포함된 구성입니다. 멀티탭거치대가 필요 없다면 '1인용 책상(단품)' 라인을 확인해 주세요. 두 구성은 가로 범위는 같지만 깊이(세로) 최소값이 달라, 더 좁은 깊이가 필요하면 컴퓨터책상 쪽이 유리합니다.",
      },
      monitorArmFaq,
      {
        q: "제작 기간은 얼마나 걸리나요?",
        a: `일반적으로 ${policyData.productionDays}이 필요합니다. ${policyData.productionExcludes}은 제외되며 주문량과 사양에 따라 달라질 수 있습니다.`,
      },
      warrantyFaq,
    ],
  },
  {
    slug: "double-desk",
    title: "2인용 책상",
    eyebrow: "DOUBLE DESK",
    image: "/two_person_desk.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/bcd82208fefa444981fcdd042a845a38?cp=1",
    listSummary: "부부, 커플과 두 사람이 함께 사용하는 넓고 안정적인 책상(단품)입니다.",
    metaDescription:
      "인디업 2인용 책상(단품)은 부부, 커플과 두 사람이 함께 사용하는 넓고 안정적인 맞춤 책상입니다. 아연도금 프레임과 3년 무상보증으로 오래 사용할 수 있습니다.",
    recommendedSpace:
      "부부, 커플과 두 사람이 함께 앉아 각자의 작업 공간을 나누어 쓰고 싶은 자리에 어울리는 상판만의 단품 구성입니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "2인용 책상은 두 사람이 각자 작업하기에 충분한가요?",
        a: "두 사람이 함께 사용할 수 있도록 넓게 제작하며, 정확한 폭은 사용 공간과 장비를 확인한 뒤 상담을 통해 정합니다.",
      },
      {
        q: "컴퓨터책상과는 무엇이 다른가요?",
        a: "이 상품은 상판만 있는 단품 구성으로, 멀티탭거치대가 포함되지 않습니다. 멀티탭거치대(2개)가 기본 포함된 구성은 '2인용 컴퓨터책상' 라인에서 확인할 수 있습니다.",
      },
      {
        q: "가운데 전선홀도 선택할 수 있나요?",
        a: "전선홀 위치와 방향은 설치 환경에 맞춰 선택할 수 있습니다. 두 사람이 함께 쓰는 경우 위치를 상담 시 확인합니다.",
      },
      warrantyFaq,
    ],
  },
  {
    slug: "double-desk-computer",
    title: "2인용 컴퓨터책상",
    eyebrow: "DOUBLE DESK · COMPUTER",
    image: "/two_desk_select.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/ac0477e1e4fc417a945a61e215dd4dcc?cp=1",
    listSummary: "두 사람이 각자 컴퓨터를 두고 쓰는 2인용 컴퓨터책상, 멀티탭거치대 2개가 기본 포함됩니다.",
    metaDescription:
      "인디업 2인용 컴퓨터책상은 멀티탭거치대 2개가 기본 포함된 맞춤 책상입니다. 부부, 커플과 두 사람이 함께 사용하기에 넓고 안정적이며, 아연도금 프레임과 3년 무상보증을 제공합니다.",
    recommendedSpace:
      "부부, 커플과 두 사람이 각자 컴퓨터·모니터·주변기기를 두고 함께 사용하는 자리에 어울립니다. 멀티탭거치대 2개가 기본 포함되어 두 사람 모두 전선을 깔끔하게 정리할 수 있습니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "책상(단품)과는 무엇이 다른가요?",
        a: "이 상품은 멀티탭거치대 2개가 기본 포함된 구성입니다. 멀티탭거치대가 필요 없다면 '2인용 책상(단품)' 라인을 확인해 주세요.",
      },
      monitorArmFaq,
      {
        q: "가운데 전선홀도 선택할 수 있나요?",
        a: "전선홀 위치와 방향은 설치 환경에 맞춰 선택할 수 있습니다. 두 사람이 함께 쓰는 경우 위치를 상담 시 확인합니다.",
      },
      warrantyFaq,
    ],
  },
  {
    slug: "floor-desk",
    title: "좌식 책상",
    eyebrow: "FLOOR DESK",
    image: "/floor_sitting_desk.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/c513c6aedbf940f087934edda8a6ea4f?cp=1",
    listSummary: "바닥 생활과 좌식 작업 환경에 맞춘 낮은 높이의 책상입니다.",
    metaDescription:
      "인디업 좌식 책상은 바닥 생활과 좌식 작업 환경에 맞춘 낮은 높이의 맞춤 책상입니다. 흔들림을 줄인 구조와 3년 무상보증을 제공합니다.",
    recommendedSpace:
      "좌식 생활 공간, 거실과 좌식 작업 환경처럼 바닥에 앉아 사용하는 자리에 어울립니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "좌식 책상의 높이도 조정할 수 있나요?",
        a: "좌식 생활에 맞는 낮은 높이로 제작하며, 제품별 선택 범위 안에서 조정할 수 있습니다.",
      },
      {
        q: "아이가 사용해도 안전한가요?",
        a: "풀용접으로 이어 흔들림을 줄인 구조로 제작하지만, 정확한 사용 환경은 상담을 통해 확인하는 것을 권장합니다.",
      },
      {
        q: "프레임과 상판 색상 조합을 자유롭게 선택할 수 있나요?",
        a: "네, 프레임 2종(화이트·블랙)과 상판 5종(화이트·블랙·그레이·나무무늬·멀바우) 중 원하는 조합으로 자유롭게 선택할 수 있습니다.",
      },
      warrantyFaq,
    ],
  },
  {
    slug: "side-table",
    title: "사이드테이블",
    eyebrow: "SIDE TABLE",
    image: "/side_table.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/6587e342486946208af9dc6ac028fdef?cp=1",
    listSummary: "소파 옆, 침대 옆과 틈새 공간에 필요한 슬림한 보조 테이블입니다.",
    metaDescription:
      "인디업 사이드테이블은 소파 옆, 침대 옆과 틈새 공간에 필요한 슬림한 맞춤 보조 테이블입니다. 필요한 자리에 맞춰 사이즈를 조정할 수 있습니다.",
    recommendedSpace:
      "소파 옆, 침대 옆, 틈새 공간처럼 넉넉하지 않은 자리에 필요한 만큼만 채우고 싶을 때 어울립니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "좁은 틈새 공간에도 맞출 수 있나요?",
        a: "필요한 자리에 맞춰 가로와 높이를 조정할 수 있습니다. 정확한 치수는 설치할 공간을 확인한 뒤 상담을 통해 정합니다.",
      },
      {
        q: "책상과 같은 프레임을 사용하나요?",
        a: "아연도금 철제 프레임을 동일하게 사용하며, 풀용접과 분체도장으로 마감합니다.",
      },
      {
        q: "조립이 어렵진 않나요?",
        a: "별도 공구 없이 약 10~15분이면 조립이 끝나는 간단한 구조이며, 조립에 필요한 부품과 설명서가 모두 함께 제공됩니다.",
      },
      warrantyFaq,
    ],
  },
  {
    slug: "home-bar-table",
    title: "홈바테이블",
    eyebrow: "HOME BAR TABLE",
    image: "/home_bar_table.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/0c82ac8425bf4a5a83eaacc0f0354df5?cp=1",
    listSummary: "홈바, 작업대와 공간 분리 용도로 사용하는 높은 테이블입니다.",
    metaDescription:
      "인디업 홈바테이블은 홈바, 작업대와 공간 분리 용도로 사용하는 높은 맞춤 테이블입니다. 서서 사용하는 높이에 맞춰 제작합니다.",
    recommendedSpace:
      "홈바, 서서 사용하는 작업대와 공간을 나누는 용도처럼 일반 책상보다 높은 자리가 필요할 때 어울립니다. 일반 제품과 달리 뒤쪽에 보강대가 없어 양쪽에서 마주 보고 사용할 수 있습니다.",
    sizeInfo,
    material,
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "일반 책상보다 얼마나 높게 제작되나요?",
        a: "서서 사용하는 높이에 맞춰 제작하며, 정확한 높이는 사용 목적을 확인한 뒤 상담을 통해 정합니다.",
      },
      {
        q: "양쪽에서 마주 보고 사용할 수 있나요?",
        a: "네, 일반 책상과 달리 뒤쪽에 보강대가 없는 구조라 다리 공간의 간섭 없이 양면에서 마주 보고 사용할 수 있습니다.",
      },
      {
        q: "주방 근처에 두어도 되나요?",
        a: "분체도장으로 표면을 마감해 관리가 쉬운 편이지만, 정확한 사용 환경은 상담 시 확인하는 것을 권장합니다.",
      },
      warrantyFaq,
    ],
  },
  {
    slug: "frame",
    title: "프레임",
    eyebrow: "FRAME",
    image: "/frame_desk.jpg",
    purchaseUrl: "https://brand.naver.com/indeup/category/70c2008e9ebb43fbb0aaf07f466f9e47?cp=1",
    listSummary: "원하는 상판에 맞춰 구성하거나 기존 프레임을 교체할 수 있는 단독 프레임입니다.",
    metaDescription:
      "인디업 프레임은 원하는 상판에 맞춰 구성하거나 기존 책상의 프레임만 교체하고 싶을 때 선택하는 단독 프레임 제품입니다. 아연도금 철제 소재로 제작합니다.",
    recommendedSpace:
      "이미 사용 중인 상판을 그대로 활용하면서 프레임만 교체하려는 경우, 또는 원하는 상판에 맞춰 프레임을 별도로 구성하려는 경우에 적합합니다. 프레임의 일부 구성품(보강대 1세트, 다리 프레임 1세트)만 별도로 구매하는 것도 가능합니다.",
    sizeInfo,
    material:
      "아연도금 철제 프레임으로 제작합니다. 상판은 포함되지 않으며, 보유하고 있거나 별도로 준비한 상판에 맞춰 구성합니다.",
    structure,
    colorInfo,
    optionInfo,
    leadTime,
    shipping,
    assembly,
    warranty,
    faqs: [
      {
        q: "상판 없이 프레임만 구매할 수 있나요?",
        a: "네, 프레임 제품은 상판이 포함되지 않은 단독 구성입니다. 보유한 상판이나 별도로 준비한 상판에 맞춰 사용할 수 있습니다.",
      },
      {
        q: "기존 책상의 프레임만 교체하고 싶어요.",
        a: "기존 상판을 그대로 사용하면서 프레임만 교체하려는 경우에 적합합니다. 정확한 결합 방식은 상담을 통해 확인해야 합니다.",
      },
      {
        q: "프레임의 일부만 구매할 수도 있나요?",
        a: "네, 프레임 전체가 아니라 보강대 1세트나 다리 프레임 1세트처럼 필요한 구성만 별도로 구매할 수 있습니다.",
      },
      warrantyFaq,
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
