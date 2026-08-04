/**
 * Computes the price shown on a /custom-fit/ result card from a resolved
 * `ProductMatch`, using the confirmed base-price + surcharge + coupon tables
 * in pricingData.ts. See [[project_indeup_naver_coupon_pricing_rules]] for
 * where the 최대혜택가 formula came from and why the lounge store coupon is
 * excluded from it.
 *
 * Anywhere the operator hasn't confirmed a surcharge yet (a genuine data
 * gap, not a bug — see pricingData.ts comments), this returns an "inquiry"
 * result instead of guessing a number. Never fabricate a price on a live
 * commercial page.
 */

import type { ProductMatch } from "./customFit";
import {
  basePrices,
  depthBridgeSurcharge,
  depthSurcharge,
  heightOptionPricers,
  homeBarSurcharge,
  loungeStoreCoupon,
  productCoupons,
  reviewReward,
  toCatalogSlug,
  widthOptionSurcharge,
  type CatalogSlug,
} from "./pricingData";

export type PriceResult =
  | { status: "unavailable" }
  | { status: "inquiry" }
  | {
      status: "ok";
      /** 기본가 (옵션 없는 상태) — 옵션 추가금 없이 이 사이즈/라인의 기준 가격. */
      baseListPrice: number;
      baseDiscountPrice: number;
      /** 옵션 추가금, 화면에 가로/세로/높이로 각각 나눠 보여주기 위해 분리 — 0이면 그 차원엔 추가금 없음. */
      widthAddon: number;
      /** 세로 "선택기본값" 옵션가(쿠폰 대상, specLine "OOOmm 선택"에 붙는 금액) — depthBridgeAddon과 합쳐서 보여주면 실제보다 훨씬 비싸 보인다는 피드백(2026-07-28)으로 분리. */
      depthBaseAddon: number;
      /** 세로 추가제작(쿠폰 제외분, optionLine "옵션추가 +OOmm"에 붙는 금액). */
      depthBridgeAddon: number;
      heightAddon: number;
      listPrice: number;
      discountPrice: number;
      discountPct: number;
      maxBenefit: number;
      couponName: string | null;
      couponAmount: number;
      loungeEligible: boolean;
      loungeAmount: number;
      /** 리뷰 작성 시 추후 지급되는 적립 — 구매 시점 혜택이 아니라 별도 안내. */
      textReviewReward: number;
      photoReviewReward: number;
    };

function bestCoupon(discountTotal: number): { name: string | null; amount: number } {
  let best = { name: null as string | null, amount: 0 };
  for (const c of productCoupons) {
    if (discountTotal < c.minOrder) continue;
    const amount = c.flat != null ? c.flat : Math.min(Math.round(discountTotal * (c.pct ?? 0)), c.cap);
    if (amount > best.amount) best = { name: c.name, amount };
  }
  return best;
}

export function computePriceForMatch(match: ProductMatch): PriceResult {
  const catalogSlug = toCatalogSlug(match.product, match.variantKey);
  if (!catalogSlug) return { status: "unavailable" };

  // home-bar-table sells one listed price row (800x300) — every other width/
  // depth combo is priced off that same row via homeBarSurcharge below, which
  // already encodes the full width+depth differential, not just depth. Every
  // other line has one row per sold width, so it looks up by width.base.
  const baseRow =
    catalogSlug === "home-bar-table"
      ? basePrices[catalogSlug][0]
      : basePrices[catalogSlug].find((r) => r.width === match.width.base);
  if (!baseRow) return { status: "inquiry" };

  // 선택기본값 옵션가(세로+색상 조합 가격, home-bar-table은 가로x세로 그리드) —
  // 쿠폰 %가 적용되는 "본품 판매가"의 일부. 실측 확인(2026-07-28): 1인용
  // 책상 1200, 세로 600mm 선택(+5,000) 상태에서 7% 쿠폰이 정확히
  // (210,000+5,000)×7%=15,050원으로 나왔다 — 즉 쿠폰은 이 금액에만 붙는다.
  let eligibleAmount: number | undefined;
  if (catalogSlug === "home-bar-table") {
    eligibleAmount = homeBarSurcharge[`${match.width.base}x${match.depth.base}`];
  } else {
    eligibleAmount = depthSurcharge[catalogSlug][match.depth.base];
  }
  if (eligibleAmount == null) return { status: "inquiry" };

  // 옵션값(추가상품) — 가로/세로 별도제작, 높이 별도제작. 별도의
  // "추가구성상품"으로 취급되어 쿠폰 %가 붙지 않는다(적립 안내 문구
  // "카드청구할인/배송비/추가구성상품가격은 제외"와 같은 맥락) — 위 실측치가
  // 이걸 확인해준다. 가로/세로/높이로 따로 보관해 화면에 항목별로 표기한다.
  let widthAddon = 0;
  let depthBridgeAddon = 0;
  let heightAddon = 0;

  if (match.depth.option != null) {
    const bridge = depthBridgeSurcharge[catalogSlug];
    if (bridge == null) return { status: "inquiry" };
    depthBridgeAddon = bridge;
  }

  if (match.width.option != null) {
    widthAddon = widthOptionSurcharge[catalogSlug];
  }

  if (match.height.optionLine) {
    const heightAmount = heightOptionPricers[catalogSlug](match.height.resolvedValue);
    if (heightAmount == null) return { status: "inquiry" };
    heightAddon = heightAmount;
  }

  const depthBaseAddon = eligibleAmount;
  const surcharge = widthAddon + depthBaseAddon + depthBridgeAddon + heightAddon;
  const listPrice = baseRow.listPrice + surcharge;
  const discountPrice = baseRow.discountPrice + surcharge;
  const discountPct = Math.round((1 - discountPrice / listPrice) * 100);

  // 쿠폰은 "선택기본값" 부분(기본가+세로옵션가)에만 적용 — 추가구성상품은 제외.
  const couponEligibleBase = baseRow.discountPrice + eligibleAmount;
  const coupon = bestCoupon(couponEligibleBase);
  const maxBenefit = discountPrice - coupon.amount;
  const loungeEligible = discountPrice >= loungeStoreCoupon.minOrder;
  const review = reviewReward[catalogSlug];

  return {
    status: "ok",
    baseListPrice: baseRow.listPrice,
    baseDiscountPrice: baseRow.discountPrice,
    widthAddon,
    depthBaseAddon,
    depthBridgeAddon,
    heightAddon,
    listPrice,
    discountPrice,
    discountPct,
    maxBenefit,
    couponName: coupon.name,
    couponAmount: coupon.amount,
    loungeEligible,
    loungeAmount: loungeStoreCoupon.amount,
    textReviewReward: review.text,
    photoReviewReward: review.photo,
  };
}

/** Cheapest listed row for a catalog line — used where no exact size has been resolved yet (e.g. a general chat product recommendation), to show "N원부터" instead of a specific 최대혜택가. Returns null for ids outside the 7 priced lines (e.g. "frame"). */
export function getStartingPrice(catalogId: string): { listPrice: number; discountPrice: number } | null {
  const rows = basePrices[catalogId as CatalogSlug];
  if (!rows || rows.length === 0) return null;
  return rows.reduce((min, r) => (r.discountPrice < min.discountPrice ? r : min), rows[0]);
}

/** Full 즉시할인가 range across every listed width row — feeds Product.offers (AggregateOffer) in JSON-LD so search/AI rich results show a real "OOO~OOO원" range instead of just the lowest figure. Returns null for ids outside the 7 priced lines. */
export function getPriceRange(catalogId: string): { low: number; high: number; count: number } | null {
  const rows = basePrices[catalogId as CatalogSlug];
  if (!rows || rows.length === 0) return null;
  const prices = rows.map((r) => r.discountPrice);
  return { low: Math.min(...prices), high: Math.max(...prices), count: rows.length };
}

export type { CatalogSlug };
