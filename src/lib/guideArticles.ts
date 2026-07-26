// Indeup's own editorial guide articles — separate from the auto-fetched
// Naver Blog / YouTube feeds. Every number here is pulled straight from
// src/lib/customFit.ts's real product configs (never re-typed by hand) or
// from src/lib/products.ts's real spec constants, so this file can't drift
// into inventing a range or default the actual calculator doesn't support.

import { productFitConfigs } from "@/lib/customFit";
import { material, structure, leadTime } from "@/lib/products";

export type GuideCategory =
  | "원룸 책상"
  | "컴퓨터 책상"
  | "2인용 책상"
  | "책상 깊이"
  | "책상 높이"
  | "공간 배치"
  | "맞춤 제작";

export const GUIDE_CATEGORIES: GuideCategory[] = [
  "원룸 책상",
  "컴퓨터 책상",
  "2인용 책상",
  "책상 깊이",
  "책상 높이",
  "공간 배치",
  "맞춤 제작",
];

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  categories: GuideCategory[];
  sections: { heading: string; body: string[] }[];
  relatedProduct: { label: string; href: string };
  /** Real authored date (not build time) — every article below was written
   *  on this date; update it by hand if a specific article's body is later
   *  revised, so RSS/Article JSON-LD dates stay honest instead of drifting
   *  to "just published" on every rebuild. */
  publishedAt: string;
};

const GUIDE_ARTICLES_PUBLISHED_AT = "2026-07-22";

const singleDesk = productFitConfigs["single-desk"];
const doubleDesk = productFitConfigs["double-desk"];

export const guideArticles: GuideArticle[] = [
  {
    slug: "one-room-desk-width-800-1000-1200",
    title: "원룸 책상 크기 800·1000·1200mm 비교",
    description:
      "원룸·복층에 많이 쓰는 책상 가로 800·1000·1200mm의 차이와 공간별로 고려할 점을 비교합니다.",
    categories: ["원룸 책상"],
    sections: [
      {
        heading: "가로 800·1000·1200mm, 무엇이 다른가요?",
        body: [
          "책상 가로 폭은 그 위에 무엇을 올려두고 쓸지에 따라 체감이 크게 달라집니다. 800mm는 노트북 한 대와 필기 공간 정도를 확보할 수 있는 폭이고, 1000mm는 모니터 한 대와 키보드·마우스를 여유 있게 놓을 수 있는 폭입니다. 1200mm부터는 모니터 두 대나 넓은 모니터 한 대, 프린터 같은 주변기기를 함께 올려두는 경우에 여유가 생깁니다.",
          "원룸이나 복층처럼 공간이 한정된 곳에서는 책상 폭보다 책상을 놓을 자리의 전체 폭(양옆 여유 공간 포함)을 먼저 재보는 것이 순서입니다. 문이나 창문이 열리는 방향, 의자를 뒤로 뺄 때 필요한 공간까지 함께 고려하면 실제로 놓을 수 있는 최대 폭이 정해집니다.",
        ],
      },
      {
        heading: "인디업 책상은 이 범위를 10mm 단위로 제작합니다",
        body: [
          `인디업 1인용 책상은 가로 ${singleDesk.width!.bases[0]}mm부터 ${singleDesk.width!.bases[singleDesk.width!.bases.length - 1]}mm까지 10mm 단위로 제작됩니다. 800·1000·1200mm 사이의 애매한 치수(예: 1050mm, 1130mm)도 같은 방식으로 맞춤 제작할 수 있습니다.`,
          "정확한 사이즈가 아직 정해지지 않았다면 책상 가이드 페이지의 '내 공간 책상 사이즈 계산기'로 공간 정보를 입력해 대략적인 권장 사이즈부터 확인해보세요.",
        ],
      },
    ],
    relatedProduct: { label: "1인용 책상 자세히 보기", href: "/products/single-desk/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "computer-desk-depth-500-600-700",
    title: "컴퓨터 책상 깊이 300~700mm, 일반 책상형과 무엇이 다른가",
    description:
      "모니터, 키보드, PC 본체까지 올려두는 컴퓨터 책상형은 깊이 300mm부터 선택할 수 있습니다 — 깊이 500·600·700mm만 있는 일반 책상형과 실제로 어떻게 다른지 정리합니다.",
    categories: ["컴퓨터 책상", "책상 깊이"],
    sections: [
      {
        heading: "깊이가 부족하면 가장 먼저 불편한 것",
        body: [
          "책상 깊이(앞뒤 폭)가 부족하면 모니터와 눈 사이 거리가 가까워지고, 키보드를 놓을 자리가 좁아집니다. 일반적인 모니터 1대 기준으로는 500~600mm 깊이로도 사용할 수 있지만, 모니터암을 쓰거나 노트북과 모니터를 함께 올려두는 경우에는 600mm 이상을 권장하는 경우가 많습니다.",
          "PC 본체를 책상 위나 책상과 연결된 거치대에 함께 두려는 경우에는 별도로 깊이 여유가 더 필요합니다.",
        ],
      },
      {
        heading: "인디업의 깊이 옵션",
        body: [
          `인디업 1인용 책상은 일반 사양으로 깊이 ${singleDesk.depth!.variants[0].bases.join("·")}mm 중에서 선택하고, PC 본체 거치가 필요한 경우를 위한 컴퓨터책상 사양은 깊이 ${singleDesk.depth!.variants[1].bases[0]}mm부터 ${singleDesk.depth!.variants[1].hardMax}mm까지 제작할 수 있습니다. 컴퓨터책상 사양에는 멀티탭거치대가 기본으로 포함됩니다.`,
          "두 사양 모두 10mm 단위로 세부 조정이 가능하니, 정확한 깊이가 애매하다면 가장 가까운 기본 사양에 옵션을 더하는 방식으로 주문하면 됩니다.",
        ],
      },
    ],
    relatedProduct: { label: "1인용 컴퓨터책상 자세히 보기", href: "/products/single-desk/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "desk-height-720mm-default",
    title: "책상 높이 720mm가 기본인 이유",
    description:
      "일반 책상 높이의 기준점인 720mm가 왜 기본값인지, 그리고 필요할 때 어떻게 조정할 수 있는지 설명합니다.",
    categories: ["책상 높이"],
    sections: [
      {
        heading: "720mm는 어디서 온 기준일까요",
        body: [
          "720mm 전후는 일반적인 성인이 의자에 앉아 팔을 편하게 놓을 수 있는 책상 높이로 널리 쓰이는 기준입니다. 대부분의 사무용 의자와 함께 사용했을 때 팔꿈치가 크게 꺾이지 않는 높이여서, 여러 가구 브랜드가 기본 높이로 채택하고 있습니다.",
          "다만 사용자의 키, 의자 높이, 사용 목적(타이핑 위주인지 서류 작업 위주인지)에 따라 편한 높이는 조금씩 달라질 수 있습니다.",
        ],
      },
      {
        heading: "인디업 책상의 높이 조정 범위",
        body: [
          `인디업 1인용 책상·2인용 책상·사이드테이블·홈바테이블은 기본 높이 ${singleDesk.height!.defaultHeight}mm를 기준으로, 제품마다 지정된 범위 안에서 10mm 단위로 옵션을 추가할 수 있습니다. 예를 들어 1인용 책상은 ${singleDesk.height!.min}~${singleDesk.height!.max}mm, 2인용 책상은 ${doubleDesk.height!.min}~${doubleDesk.height!.max}mm 범위에서 조정됩니다.`,
          "좌식 생활에 맞춘 좌식책상은 별도의 낮은 기본 높이를 사용합니다. 좌식책상 관련 사이즈는 책상 가이드의 '내 공간 책상 사이즈 계산기' 또는 맞춤 제작 페이지에서 확인할 수 있습니다.",
        ],
      },
    ],
    relatedProduct: { label: "맞춤 제작 사이즈 확인하기", href: "/custom-fit/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "double-desk-size-guide-1600-2600",
    title: "2인용 책상 사이즈 1600~2600mm 선택 가이드",
    description:
      "두 사람이 함께 쓰는 2인용 책상의 가로 1600~2600mm 사이즈를 어떻게 고르면 되는지 정리합니다.",
    categories: ["2인용 책상"],
    sections: [
      {
        heading: "1인당 필요한 폭부터 계산해보세요",
        body: [
          "2인용 책상은 결국 '1인용 책상 두 개를 이어 붙인 폭'이라고 생각하면 계산이 쉬워집니다. 한 사람당 800~1000mm 정도를 기준으로 잡으면 전체 가로는 1600~2000mm대가 되고, 각자 모니터를 여러 대 쓰거나 여유 있게 쓰고 싶다면 2200mm 이상을 고려하게 됩니다.",
          "두 사람이 마주 보지 않고 나란히 앉는 배치인지, 중간에 파티션이나 간이 구분이 필요한지도 폭을 정할 때 함께 고려하면 좋습니다.",
        ],
      },
      {
        heading: "인디업 2인용 책상의 사이즈 범위",
        body: [
          `인디업 2인용 책상은 가로 ${doubleDesk.width!.bases[0]}~${doubleDesk.width!.bases[doubleDesk.width!.bases.length - 1]}mm 사이에서 제작되며, 기본 사이즈에 옵션을 더하는 방식으로 세부 조정합니다. 깊이는 1인용 책상과 동일하게 일반 사양과 컴퓨터책상 사양(멀티탭거치대 기본 2개 포함) 중에서 선택할 수 있고, 높이는 기본 ${doubleDesk.height!.defaultHeight}mm를 기준으로 ${doubleDesk.height!.min}~${doubleDesk.height!.max}mm 범위에서 조정됩니다.`,
        ],
      },
    ],
    relatedProduct: { label: "2인용 책상 자세히 보기", href: "/products/double-desk/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "narrow-room-desk-layout",
    title: "좁은 방 책상 배치와 통로 공간 확인법",
    description:
      "좁은 방에 책상을 놓을 때 가구 폭만큼 중요한 통로·동선 공간을 확인하는 방법을 안내합니다.",
    categories: ["공간 배치", "원룸 책상"],
    sections: [
      {
        heading: "책상 폭보다 먼저 볼 것: 의자를 뺄 공간",
        body: [
          "책상을 놓을 벽면의 폭만 재고 나서 막상 배치하면, 의자를 뒤로 빼거나 앉고 일어날 때 필요한 공간이 부족해지는 경우가 많습니다. 일반적으로 의자를 편하게 빼고 앉으려면 책상 뒤로 최소 600~700mm 정도의 여유 공간이 권장됩니다.",
          "방문이 열리는 방향, 옷장이나 침대 서랍이 열리는 반경, 사람이 지나다니는 동선도 함께 확인하면 실제로 사용 가능한 배치를 가늠할 수 있습니다.",
        ],
      },
      {
        heading: "실측 순서를 정리하면",
        body: [
          "1) 책상을 놓을 벽면의 전체 가로 폭을 잽니다. 2) 창문, 콘센트, 몰딩처럼 튀어나온 부분을 제외한 실제 사용 가능한 폭을 확인합니다. 3) 의자를 사용할 때 필요한 뒤쪽 여유 공간을 더해 전체 통로 폭이 충분한지 확인합니다.",
          "이렇게 측정한 값을 책상 가이드의 '내 공간 책상 사이즈 계산기'에 입력하면 대략적인 권장 사이즈를 바로 확인할 수 있습니다.",
        ],
      },
    ],
    relatedProduct: { label: "내 공간 책상 사이즈 계산기로 이동", href: "#quick-size-finder" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "measure-space-before-custom-order",
    title: "맞춤 책상 주문 전 공간 실측 방법",
    description:
      "10mm 단위 맞춤 제작을 주문하기 전, 줄자로 공간을 정확히 실측하는 방법을 안내합니다.",
    categories: ["맞춤 제작", "공간 배치"],
    sections: [
      {
        heading: "줄자 하나로 충분합니다",
        body: [
          "인디업 맞춤 제작은 10mm 단위로 이루어지기 때문에, 정확한 실측이 곧 정확한 사이즈로 이어집니다. 책상을 놓을 공간의 가로(좌우 폭), 세로(앞뒤 깊이), 높이(바닥부터 상판까지) 세 가지를 줄자로 측정해 mm 단위로 기록해 두세요.",
          "벽이나 가구 사이에 놓을 예정이라면 가장 좁은 지점을 기준으로 측정하는 것이 안전합니다. 몰딩이나 콘센트처럼 튀어나온 부분이 있다면 그만큼을 뺀 실제 사용 가능한 치수를 사용해 주세요.",
        ],
      },
      {
        heading: "측정한 값으로 바로 확인하기",
        body: [
          `측정을 마쳤다면 맞춤 제작 페이지에서 가로·세로·높이를 입력해 어떤 인디업 제품으로 제작 가능한지, 주문 시 어떤 옵션을 선택해야 하는지 바로 확인할 수 있습니다. ${leadTime}`,
        ],
      },
    ],
    relatedProduct: { label: "맞춤 제작 사이즈 확인하기", href: "/custom-fit/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "stable-desk-structure-check",
    title: "흔들림 없는 책상 구조 확인하는 방법",
    description:
      "타이핑이나 마우스 사용처럼 반복적인 움직임에도 흔들리지 않는 책상 구조를 고를 때 확인할 점을 정리합니다.",
    categories: ["맞춤 제작"],
    sections: [
      {
        heading: "흔들림은 대부분 프레임 연결 부위에서 시작됩니다",
        body: [
          "책상이 흔들리는 원인은 대개 상판 자체보다 프레임의 연결 방식에 있습니다. 나사나 볼트로만 조립된 프레임은 시간이 지나면서 연결부가 헐거워질 수 있고, 다리와 상판을 지지하는 구조가 단순할수록 좌우로 흔들리는 느낌이 커집니다.",
          "구매 전에는 프레임이 어떤 방식으로 연결되는지, 바닥이 평평하지 않을 때 높이를 조절할 수 있는 장치가 있는지 확인해보는 것이 좋습니다.",
        ],
      },
      {
        heading: "인디업 책상의 구조",
        body: [structure],
      },
    ],
    relatedProduct: { label: "브랜드 이야기 더 보기", href: "/brand/#our-standard" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
  {
    slug: "monitor-arm-compatible-desk",
    title: "모니터암 사용이 가능한 책상 조건",
    description:
      "클램프형 모니터암을 설치하려면 책상 상판과 가장자리 구조에서 어떤 점을 확인해야 하는지 안내합니다.",
    categories: ["컴퓨터 책상"],
    sections: [
      {
        heading: "모니터암 설치 전 확인할 두 가지",
        body: [
          "클램프(집게) 방식 모니터암은 책상 가장자리를 집게로 고정하는 구조라, 상판 두께와 가장자리에 방해되는 구조물이 없는지가 중요합니다. 일반적으로 클램프형 모니터암은 상판 두께 15~80mm 범위에서 사용 가능하도록 설계된 제품이 많으며, 정확한 호환 범위는 사용하시는 모니터암 제품의 사양을 함께 확인하시는 것이 좋습니다.",
          "책상 안쪽에 서랍이나 프레임 구조물이 가장자리 바로 아래까지 나와 있으면 클램프를 완전히 고정하기 어려울 수 있으니, 상판 아래쪽 여유 공간도 함께 확인해 주세요.",
        ],
      },
      {
        heading: "인디업 책상 상판 사양",
        body: [
          `인디업 책상은 ${material} 클램프형 모니터암을 고려하신다면, 주문 전 네이버 톡톡이나 고객센터로 상판 가장자리 구조를 문의하시면 더 정확히 안내해 드립니다.`,
        ],
      },
    ],
    relatedProduct: { label: "고객지원에 문의하기", href: "/support/" },
    publishedAt: GUIDE_ARTICLES_PUBLISHED_AT,
  },
];

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return guideArticles.find((a) => a.slug === slug);
}
