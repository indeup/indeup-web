import type { PriceResult } from "@/lib/pricing";

function won(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

/**
 * Price display for a /custom-fit/ result card — 즉시할인가 + 쿠폰까지 반영한
 * "예상 최대혜택가", 실제 확정된 쿠폰 규칙 그대로 계산 내역을 펼쳐 보여준다.
 * 라운지 가입 쿠폰은 헤드라인 숫자에 넣지 않고 별도 문구로만 안내한다 —
 * 이유는 [[project_indeup_naver_coupon_pricing_rules]] 참고.
 */
export default function PriceBlock({ price }: { price: PriceResult }) {
  if (price.status === "unavailable") return null;

  if (price.status === "inquiry") {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]">가격</p>
        <p className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)]">
          선택하신 옵션은 정확한 가격을 확인 중입니다. 채널톡이나 고객센터로 문의해 주시면 안내해 드립니다.
        </p>
      </div>
    );
  }

  const addonRows: { label: string; amount: number }[] = [
    { label: "가로 옵션", amount: price.widthAddon },
    { label: "세로 옵션(사이즈 선택)", amount: price.depthBaseAddon },
    { label: "세로 추가옵션", amount: price.depthBridgeAddon },
    { label: "높이 옵션", amount: price.heightAddon },
  ].filter((r) => r.amount > 0);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3.5 sm:px-5 sm:py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]">가격</p>

      <div className="mt-2 flex flex-col gap-0.5 [font-variant-numeric:tabular-nums]">
        <span className="text-sm text-[var(--color-muted-foreground)] line-through decoration-1">{won(price.baseListPrice)}</span>
        <span className="flex items-baseline gap-1.5 text-base font-semibold text-[var(--color-primary)]">
          <span>기본가</span>
          <span>{won(price.baseDiscountPrice)}</span>
        </span>

        {addonRows.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-0.5 border-t border-dashed border-[var(--color-border)] pt-1.5">
            {addonRows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-[var(--color-secondary)]">{r.label}</span>
                <span className="font-semibold text-[var(--color-accent)]">+{won(r.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <span className="mt-1.5 flex items-baseline gap-1.5 border-t border-[var(--color-border)] pt-1.5 text-base font-semibold text-[var(--color-accent)]">
          <span>{price.discountPct}%</span>
          <span>{won(price.discountPrice)}</span>
        </span>

        <details className="mt-1 group">
          <summary className="flex cursor-pointer list-none items-baseline gap-1.5 [&::-webkit-details-marker]:hidden [&::marker]:content-['']">
            <span className="text-xs font-semibold text-[var(--color-accent)]">예상 최대혜택가*</span>
            <svg
              aria-hidden="true"
              className="text-[var(--color-muted-foreground)] transition-transform duration-150 group-open:rotate-180 group-open:text-[var(--color-accent)]"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className="text-xl font-bold tracking-[-0.01em] text-[var(--color-accent)]">{won(price.maxBenefit)}</span>
          </summary>

          <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2.5 text-xs leading-6 text-[var(--color-secondary)]">
            <p className="font-semibold text-[var(--color-primary)]">예상 최대혜택가 계산 방법</p>
            <div className="mt-1 flex flex-col gap-0.5 [font-variant-numeric:tabular-nums]">
              <div className="flex items-baseline justify-between gap-3">
                <span>즉시할인가</span>
                <span>{won(price.discountPrice)}</span>
              </div>
              {price.couponName && (
                <div className="flex items-baseline justify-between gap-3">
                  <span>{price.couponName}</span>
                  <span>-{won(price.couponAmount)}</span>
                </div>
              )}
              <div className="mt-0.5 flex items-baseline justify-between gap-3 border-t border-[var(--color-border)] pt-1 font-bold text-[var(--color-primary)]">
                <span>예상 최대혜택가</span>
                <span>{won(price.maxBenefit)}</span>
              </div>
            </div>
            <p className="mt-2">
              쿠폰은 첫 구매, 찜하기, 라운지 가입 등 조건에 맞는 것 중 가장 큰 할인 1개가 자동으로 적용돼요. 이 조건을
              만족했을 때 나오는 가격이라, 실제 결제 금액은 고객님 조건에 따라 다를 수 있어요.
            </p>
          </div>
        </details>

        <details className="mt-2 group w-fit">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md bg-[var(--color-naver-bg)] px-2 py-1 [&::-webkit-details-marker]:hidden [&::marker]:content-['']">
            <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--color-naver)] text-[9px] font-extrabold leading-none text-white">
              N
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-naver)]">네이버페이 적립 안내</span>
            <svg
              aria-hidden="true"
              className="text-[var(--color-naver)] transition-transform duration-150 group-open:rotate-180"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="mt-1.5 flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2.5 text-xs leading-6 text-[var(--color-secondary)]">
            <div className="flex items-baseline justify-between gap-3">
              <span>0원 ~ 20만원</span>
              <span className="font-semibold text-[var(--color-primary)]">기본적립 1% + 멤버십적립 4% = 총 5%</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span>20만원 초과 ~ 300만원</span>
              <span className="font-semibold text-[var(--color-primary)]">기본적립 1% + 멤버십적립 1% = 총 2%</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span>300만원 초과</span>
              <span className="font-semibold text-[var(--color-primary)]">기본적립 1%</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-5">
              네이버페이 공식 안내 기준이며, 구간은 이번 달 네이버페이 누적 구매금액(가족 결합 시 가족 합산)에 따라
              정해져요. 정확한 적립액은 결제 화면에서 확인해 주세요.
            </p>
          </div>
        </details>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-secondary)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            무료배송
          </span>
          {price.loungeEligible && (
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              라운지 가입 시 {won(price.loungeAmount)} 추가 할인
            </span>
          )}
        </div>

        {/* 구매 시점 혜택이 아니라 구매 후 리뷰를 작성해야 받는 별도 적립이라, 위 가격/적립과는 구분되게 한 줄로만 안내한다. */}
        <p className="mt-1 text-[11px] leading-5 text-[var(--color-muted-foreground)]">
          리뷰 작성 시 텍스트 {won(price.textReviewReward)} · 포토/동영상 {won(price.photoReviewReward)} 추가 적립
        </p>
      </div>
    </div>
  );
}
