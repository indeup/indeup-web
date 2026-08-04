/**
 * Real per-line pricing, exactly as provided by the store operator (Naver
 * Smart Store export, 2026-07-28) — same rigor as customFit.ts: every number
 * below is a literal business rule, not an estimate. Do not "clean up" or
 * interpolate missing rows — a missing row means the operator hasn't
 * confirmed that price yet, and pricing.ts must fall back to an inquiry
 * state rather than guessing.
 */

import type { ProductSlug } from "./customFit";

export type CatalogSlug =
  | "single-desk"
  | "single-desk-computer"
  | "double-desk"
  | "double-desk-computer"
  | "floor-desk"
  | "side-table"
  | "home-bar-table";

/** Maps a customFit (product, variantKey) pair to the catalog line its price data lives under. Returns null for lines with no price data (frame — inquiry-only, never priced). */
export function toCatalogSlug(product: ProductSlug, variantKey: string): CatalogSlug | null {
  if (product === "single-desk") return variantKey === "computer" ? "single-desk-computer" : "single-desk";
  if (product === "double-desk") return variantKey === "computer" ? "double-desk-computer" : "double-desk";
  if (product === "floor-desk") return "floor-desk";
  if (product === "side-table") return "side-table";
  if (product === "home-bar-table") return "home-bar-table";
  return null;
}

export type BasePriceRow = { width: number; listPrice: number; discountPrice: number };

/** 정상가/판매가 (listPrice) → 즉시할인가 (discountPrice), per line per sold width. */
export const basePrices: Record<CatalogSlug, BasePriceRow[]> = {
  "floor-desk": [
    { width: 400, listPrice: 160000, discountPrice: 150000 },
    { width: 500, listPrice: 165000, discountPrice: 155000 },
    { width: 600, listPrice: 170000, discountPrice: 160000 },
    { width: 700, listPrice: 175000, discountPrice: 165000 },
    { width: 800, listPrice: 180000, discountPrice: 170000 },
    { width: 900, listPrice: 185000, discountPrice: 175000 },
    { width: 1000, listPrice: 190000, discountPrice: 180000 },
    { width: 1100, listPrice: 195000, discountPrice: 185000 },
    { width: 1200, listPrice: 200000, discountPrice: 190000 },
    { width: 1300, listPrice: 205000, discountPrice: 195000 },
  ],
  "single-desk": [
    { width: 400, listPrice: 180000, discountPrice: 170000 },
    { width: 500, listPrice: 185000, discountPrice: 175000 },
    { width: 600, listPrice: 190000, discountPrice: 180000 },
    { width: 700, listPrice: 195000, discountPrice: 185000 },
    { width: 800, listPrice: 200000, discountPrice: 190000 },
    { width: 900, listPrice: 205000, discountPrice: 195000 },
    { width: 1000, listPrice: 210000, discountPrice: 200000 },
    { width: 1100, listPrice: 215000, discountPrice: 205000 },
    { width: 1200, listPrice: 220000, discountPrice: 210000 },
    { width: 1300, listPrice: 225000, discountPrice: 215000 },
  ],
  "side-table": [
    { width: 400, listPrice: 165000, discountPrice: 155000 },
    { width: 500, listPrice: 170000, discountPrice: 160000 },
    { width: 600, listPrice: 175000, discountPrice: 165000 },
    { width: 700, listPrice: 180000, discountPrice: 170000 },
    { width: 800, listPrice: 185000, discountPrice: 175000 },
    { width: 900, listPrice: 190000, discountPrice: 180000 },
    { width: 1000, listPrice: 195000, discountPrice: 185000 },
    { width: 1100, listPrice: 200000, discountPrice: 190000 },
    { width: 1200, listPrice: 205000, discountPrice: 195000 },
    { width: 1300, listPrice: 210000, discountPrice: 200000 },
  ],
  "home-bar-table": [{ width: 800, listPrice: 190000, discountPrice: 180000 }],
  "double-desk": [
    { width: 1600, listPrice: 360000, discountPrice: 330000 },
    { width: 1800, listPrice: 370000, discountPrice: 340000 },
    { width: 2000, listPrice: 380000, discountPrice: 350000 },
    { width: 2200, listPrice: 390000, discountPrice: 360000 },
    { width: 2400, listPrice: 400000, discountPrice: 370000 },
    { width: 2600, listPrice: 410000, discountPrice: 380000 },
  ],
  "double-desk-computer": [
    { width: 1600, listPrice: 410000, discountPrice: 380000 },
    { width: 1800, listPrice: 420000, discountPrice: 390000 },
    { width: 2000, listPrice: 430000, discountPrice: 400000 },
    { width: 2200, listPrice: 440000, discountPrice: 410000 },
    { width: 2400, listPrice: 450000, discountPrice: 420000 },
    { width: 2600, listPrice: 460000, discountPrice: 430000 },
  ],
  "single-desk-computer": [
    { width: 600, listPrice: 205000, discountPrice: 195000 },
    { width: 700, listPrice: 210000, discountPrice: 200000 },
    { width: 800, listPrice: 215000, discountPrice: 205000 },
    { width: 900, listPrice: 220000, discountPrice: 210000 },
    { width: 1000, listPrice: 225000, discountPrice: 215000 },
    { width: 1100, listPrice: 230000, discountPrice: 220000 },
    { width: 1200, listPrice: 235000, discountPrice: 225000 },
    { width: 1300, listPrice: 240000, discountPrice: 230000 },
  ],
};

/** 세로(깊이) 기준 옵션가 — 색상 조합은 대부분 무료라 색상 무관 단일 표. home-bar-table은 가로도 함께 바뀌는 별도 그리드라 여기 포함하지 않음(아래 homeBarSurcharge 참고). */
export const depthSurcharge: Record<Exclude<CatalogSlug, "home-bar-table">, Record<number, number>> = {
  "single-desk": { 500: 0, 600: 5000, 700: 10000 },
  "single-desk-computer": { 300: 0, 400: 5000, 500: 10000, 600: 15000, 700: 20000 },
  "double-desk": { 300: 0, 400: 10000, 500: 20000, 600: 30000, 700: 40000 },
  "double-desk-computer": { 300: 0, 400: 10000, 500: 20000, 600: 30000, 700: 40000 },
  "floor-desk": { 300: 0, 400: 5000, 500: 10000, 600: 15000, 700: 20000 },
  "side-table": { 200: 0, 300: 5000, 400: 10000 },
};

/** 홈바테이블: 가로x세로 조합별 옵션가, 800x300(기준) 대비 추가금. 색상별 가격 차이 없음. */
export const homeBarSurcharge: Record<string, number> = {
  "800x300": 0,
  "800x400": 5000,
  "900x300": 5000,
  "900x400": 10000,
  "1000x300": 10000,
  "1000x400": 15000,
  "1100x300": 15000,
  "1100x400": 20000,
  "1200x300": 20000,
  "1200x400": 25000,
  "1300x300": 25000,
  "1300x400": 30000,
};

/** 가로 주문제작(+mm) 고정 추가금 — 몇 mm를 추가하든 라인별로 동일한 금액. */
export const widthOptionSurcharge: Record<CatalogSlug, number> = {
  "single-desk": 15000,
  "single-desk-computer": 15000,
  "double-desk": 30000,
  "double-desk-computer": 30000,
  "floor-desk": 15000,
  "side-table": 15000,
  "home-bar-table": 15000,
};

/**
 * 세로 추가제작(+50mm, 선택기본값 표의 깊이 라인업을 넘어서는 별도 옵션) 고정 추가금.
 * "double-desk"(2인용 책상 단품)은 2026-07-28 확인 — 같은 2인용 계열인
 * double-desk-computer와 가로/높이 추가제작 금액이 동일(30,000원)해 세로도
 * 동일하게 20,000원으로 반영. 운영자가 정확한 금액을 별도로 다시 확인해줄
 * 예정이라 값이 바뀌면 여기만 고치면 된다.
 */
export const depthBridgeSurcharge: Partial<Record<CatalogSlug, number>> = {
  "single-desk": 10000,
  "single-desk-computer": 10000,
  "double-desk": 20000,
  "double-desk-computer": 20000,
  "floor-desk": 10000,
  "side-table": 10000,
  "home-bar-table": 15000,
};

/**
 * 높이 주문제작 가격 — mm를 넣으면 추가금을 돌려주는 함수. 확인된 구간 밖이면
 * undefined를 반환해 pricing.ts가 "가격 별도문의"로 처리하게 한다.
 */
export type HeightPricer = (mm: number) => number | undefined;

const tieredHeightPricer: HeightPricer = (mm) => {
  if (mm >= 500 && mm <= 750) return 15000;
  if (mm >= 760 && mm <= 900) return 20000;
  if (mm >= 910 && mm <= 1000) return 25000;
  return undefined;
};

function flatHeightPricer(min: number, max: number, price: number): HeightPricer {
  return (mm) => (mm >= min && mm <= max ? price : undefined);
}

export const heightOptionPricers: Record<CatalogSlug, HeightPricer> = {
  "single-desk": flatHeightPricer(500, 750, 15000),
  "single-desk-computer": tieredHeightPricer,
  "double-desk": flatHeightPricer(600, 750, 30000),
  "double-desk-computer": flatHeightPricer(600, 750, 30000),
  "floor-desk": flatHeightPricer(300, 500, 15000),
  "side-table": tieredHeightPricer,
  "home-bar-table": tieredHeightPricer,
};

/**
 * 예상 최대혜택가 계산에 쓰이는 쿠폰 규칙 — 2026-07-28 실측 확인.
 * 최소주문금액은 즉시할인가(옵션 포함 총액) 기준.
 */
export type ProductCoupon = { name: string; pct: number | null; flat: number | null; cap: number; minOrder: number };

export const productCoupons: ProductCoupon[] = [
  { name: "네이버플러스 멤버십 쿠폰", pct: 0.03, flat: null, cap: 20000, minOrder: 200000 },
  { name: "라운지 회원 쿠폰", pct: null, flat: 10000, cap: 10000, minOrder: 100000 },
  { name: "찜하기 쿠폰", pct: 0.1, flat: null, cap: 15000, minOrder: 150000 },
  { name: "첫 구매 쿠폰", pct: 0.07, flat: null, cap: 20000, minOrder: 150000 },
];

/** 라운지 가입 시에만 발급되는 스토어 쿠폰 — 헤드라인 가격 계산에는 포함하지 않고 별도 문구로만 안내(이유는 [[project_indeup_naver_coupon_pricing_rules]] 참고). */
export const loungeStoreCoupon = { amount: 10000, minOrder: 150000 };

/**
 * 리뷰 작성 적립 — 혜택.xls 확인(2026-07-28), 구매 시점이 아니라 리뷰 작성 시
 * 추후 지급되는 포인트. "한달사용 리뷰"·"알림받기 동의" 등 세부 항목은 생략하고
 * 최초 텍스트/포토·동영상 리뷰 금액만 사용 — 라인별로 사실상 고정값이라
 * 대분류 단위로 저장(2인용컴퓨터책상 1600 한 건만 텍스트리뷰 3,000원으로 달랐지만
 * 포토리뷰는 동일해 무시할 수 있는 차이).
 */
export const reviewReward: Record<CatalogSlug, { text: number; photo: number }> = {
  "single-desk": { text: 2000, photo: 4000 },
  "single-desk-computer": { text: 2000, photo: 4000 },
  "double-desk": { text: 4000, photo: 9000 },
  "double-desk-computer": { text: 4000, photo: 9000 },
  "floor-desk": { text: 2000, photo: 4000 },
  "side-table": { text: 2000, photo: 4000 },
  "home-bar-table": { text: 2000, photo: 4000 },
};

/**
 * 네이버페이 적립(기본적립+멤버십적립) — 네이버 공식 고객센터 문서로 최종
 * 확인(2026-07-28, help.naver.com/service/23168): 요율이 이번 결제 금액이
 * 아니라 **"이번 달 네이버페이 이용기간 내 누적 유효구매금액"** 구간으로
 * 정해짐(가족 결합 시 가족 합산이라 더 예측 불가능). 즉 이 값은 저희(판매자)
 * 쪽에서 절대 알 수 없어 — 실측 3건이 2.01~2.87%로 제각각 나왔던 이유가 이걸로
 * 설명됨(원인 규명 전 3%/4% 사이를 오가며 반복 수정했던 이력 있음) — 특정
 * 손님의 특정 주문에 대한 원화 적립액을 계산/표시하지 않는다. 화면에는
 * PriceBlock.tsx에서 고객센터 문서 그대로의 %표만 정적으로 보여준다
 * (0~20만원 5%, 20만원~300만원 2%, 300만원 초과 1%).
 */
