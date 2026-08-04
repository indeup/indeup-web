/**
 * Single source of truth for the numeric/operational facts that used to be
 * repeated as literal Korean sentences across products.ts, brand/page.tsx,
 * support/page.tsx and the AI chat worker. Anything here should only ever
 * change in one place.
 *
 * Caveat: the Cloudflare Worker (worker/worker.js) is deployed by pasting a
 * single standalone file into the Cloudflare dashboard — it has no build
 * step and cannot `import` from this repo. Its system prompt mirrors these
 * same values as literal text, so any change here must be copied into
 * worker.js by hand and redeployed.
 */
export const policyData = {
  productionDays: "7~8영업일",
  // Numeric form of the same fact, for Merchant listing structured data
  // (schema.org OfferShippingDetails.deliveryTime.handlingTime) — keep in
  // lockstep with productionDays above; this is production/handling time
  // only, not courier transit time (no confirmed figure for that yet).
  productionDaysMin: 7,
  productionDaysMax: 8,
  productionExcludes: "주말 및 공휴일",
  // Courier transit time after the product ships (confirmed by operator
  // 2026-08-04) — for deliveryTime.transitTime, separate from handlingTime
  // (production) above.
  transitDaysMin: 1,
  transitDaysMax: 2,
  warrantyYears: 3,
  /** Scoped to what support/page.tsx actually promises — damage/defect
   *  cases only, not a blanket "everything is free" claim. */
  damageSupport: "배송 파손 또는 제작 오류가 확인되면 무료 교환",
  operatingHours: "평일 오전 9시 ~ 오후 5시",
  operatingDays: "평일(월~금)",
} as const;
