/**
 * Central registry of every link the AI chat widget is allowed to surface.
 * The chat model (worker.js) never generates a URL or button label itself —
 * it only ever returns an id (`productId` / `linkId`) chosen from the enums
 * mirrored in its own system prompt, and this file is the single place that
 * turns an id into an actual href + label. This keeps internal paths (like
 * `/custom-fit/`) out of anything the model could echo back verbatim, and
 * means every button's destination and wording lives in one spot instead of
 * being duplicated across chat, homepage and product pages.
 */
import { products, naverStoreUrl } from "./products";
import { resolveNaverProductUrl, type ProductSlug } from "./customFit";

export type ProductLink = {
  id: ProductSlug;
  name: string;
  shortDescription: string;
  detailUrl: string;
  /** Only set when a single Naver listing unambiguously covers the whole
   *  product line regardless of size (e.g. home-bar-table). Products sold
   *  as many separate per-width listings (single-desk, double-desk,
   *  floor-desk, side-table) are left undefined here — the chat never knows
   *  the customer's exact width up front, so picking one SKU's URL would be
   *  guessing. Those customers get the generic store link instead, then the
   *  size calculator hands them the exact per-SKU link once real dimensions
   *  are entered. */
  purchaseUrl?: string;
  imageUrl: string;
  useCases: string[];
  isActive: boolean;
};

export const productCatalog: ProductLink[] = products.map((p) => ({
  id: p.slug as ProductSlug,
  name: `인디업 ${p.title}`,
  shortDescription: p.listSummary,
  detailUrl: `/products/${p.slug}/`,
  purchaseUrl: p.slug === "home-bar-table" ? resolveNaverProductUrl("home-bar-table", "default", 0) : undefined,
  imageUrl: p.image,
  useCases: p.recommendedSpace.split(/[.,]\s*/).filter(Boolean),
  isActive: true,
}));

export function getProductLink(id: string): ProductLink | undefined {
  return productCatalog.find((p) => p.id === id);
}

export type GuideLinkId =
  | "products"
  | "customFit"
  | "support"
  | "delivery"
  | "assembly"
  | "damageSupport"
  | "naverTalk"
  | "storeAll";

export const guideLinks: Record<GuideLinkId, { label: string; href: string }> = {
  products: { label: "전체 제품 보기", href: "/products/" },
  customFit: { label: "사이즈 제작 가능 여부 확인", href: "/custom-fit/" },
  support: { label: "고객지원 보기", href: "/support/" },
  delivery: { label: "주문·배송 안내", href: "/support/#order-shipping" },
  assembly: { label: "조립 방법 확인", href: "/support/" },
  damageSupport: { label: "파손·누락·A/S 안내", href: "/support/#damage-as" },
  naverTalk: { label: "네이버 톡톡 상담", href: "https://talk.naver.com/profile/wcs0s3" },
  storeAll: { label: "공식 스토어에서 구매하기", href: naverStoreUrl },
};

export function getGuideLink(id: string): { label: string; href: string } | undefined {
  return (guideLinks as Record<string, { label: string; href: string }>)[id];
}
