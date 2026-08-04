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
import type { ProductSlug } from "./customFit";

export type ProductLink = {
  /** One of the 8 catalog lines in products.ts — a superset of customFit's
   *  6-value ProductSlug (which models "책상 단품"/"컴퓨터책상" as a variant
   *  within a line, not a separate top-level id). Use resolveCatalogId()
   *  below to go from a ProductSlug + variantKey to this id. */
  id: string;
  name: string;
  shortDescription: string;
  detailUrl: string;
  /** Category-listing URL on the Naver brand store for this exact product
   *  line (see products.ts) — every line has one, so this is always set. */
  purchaseUrl: string;
  imageUrl: string;
  useCases: string[];
  isActive: boolean;
};

export const productCatalog: ProductLink[] = products.map((p) => ({
  id: p.slug,
  name: `인디업 ${p.title}`,
  shortDescription: p.listSummary,
  detailUrl: `/products/${p.slug}/`,
  purchaseUrl: p.purchaseUrl,
  imageUrl: p.image,
  useCases: p.recommendedSpace.split(/[.,]\s*/).filter(Boolean),
  isActive: true,
}));

export function getProductLink(id: string): ProductLink | undefined {
  return productCatalog.find((p) => p.id === id);
}

/** The sizing engine (customFit.ts) still models "책상 단품" vs "컴퓨터책상"
 *  as a variantKey within 6 product lines (that's the real shape of its
 *  base/option/redirect rules) — but the catalog above has 8 separate
 *  entries so each gets its own photo, description and Naver link. This
 *  bridges a size-checker match back to the right catalog entry, e.g.
 *  ("single-desk", "computer") -> "single-desk-computer". */
export function resolveCatalogId(product: ProductSlug, variantKey: string): string {
  if (variantKey === "computer" && (product === "single-desk" || product === "double-desk")) {
    return `${product}-computer`;
  }
  return product;
}

export type GuideLinkId =
  | "products"
  | "customFit"
  | "spaceGuide"
  | "support"
  | "delivery"
  | "assembly"
  | "damageSupport"
  | "naverTalk"
  | "storeAll";

export const guideLinks: Record<GuideLinkId, { label: string; href: string }> = {
  products: { label: "전체 제품 보기", href: "/products/" },
  customFit: { label: "사이즈 제작 가능 여부 확인", href: "/custom-fit/" },
  spaceGuide: { label: "책상가이드에서 추천받기", href: "/guide/" },
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
