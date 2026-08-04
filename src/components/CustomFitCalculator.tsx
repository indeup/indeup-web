"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { checkAllProducts, diagnoseNoMatch, getGlobalBounds, type ProductMatch } from "@/lib/customFit";
import { naverTalkUrl } from "@/lib/brand";
import { ColorSwatchGroup, frameSwatches, topSwatches } from "@/components/ColorSwatches";
import { computePriceForMatch } from "@/lib/pricing";
import PriceBlock from "@/components/PriceBlock";

/** Product photo(s) per product line + variant — "computer" desks additionally show the multi-tap adapter shot. */
function getProductImages(product: ProductMatch["product"], variantKey: string): string[] {
  const base: Record<ProductMatch["product"], string> = {
    "single-desk": "/desk_select.jpg",
    "double-desk": "/two_desk_select.jpg",
    "floor-desk": "/low_desk_select.jpg",
    "side-table": "/side_table_select.jpg",
    "home-bar-table": "/homebar_table_select.jpg",
    frame: "",
  };
  const images = [base[product]];
  if (variantKey === "computer") images.push("/adapter_select.jpg");
  return images;
}

/** Strips the trailing "(...)" note so the name reads cleanly inside a sentence, e.g. "좌식 책상 1200". */
function bareProductName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

const dimensionPlaceholders = { 가로: "1200", 세로: "600", 높이: "720" } as const;

function DimensionField({
  label,
  value,
  onChange,
  error,
  onEnter,
}: {
  label: "가로" | "세로" | "높이";
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onEnter?: () => void;
}) {
  const inputId = `custom-fit-${label}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={`text-sm font-semibold ${error ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if ([".", ",", "e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter?.();
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[^0-9]/.test(text)) e.preventDefault();
          }}
          placeholder={dimensionPlaceholders[label]}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`h-[52px] w-full rounded-xl border bg-white px-4 pr-11 text-base tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 ${
            error
              ? "border-[var(--color-accent)] text-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]/40"
              : "border-[var(--color-border)] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]/20"
          }`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted-foreground)]"
        >
          mm
        </span>
      </div>
      {error && (
        <span id={errorId} role="alert" className="text-xs font-semibold text-[var(--color-accent)]">
          {error}
        </span>
      )}
    </div>
  );
}

function OptionPill({
  label,
  specLine,
  optionLine,
  needsInquiry,
  specAddonAmount,
  optionAddonAmount,
}: {
  label: string;
  specLine?: string;
  optionLine?: string;
  needsInquiry: boolean;
  /** Won amount tied to specLine (e.g. "500mm 선택") — shown right under that line, separate from optionAddonAmount so a combined depth surcharge doesn't read as one big scary number (합산 표기가 실제보다 비싸 보인다는 피드백, 2026-07-28). Undefined/0 when there's no addon. */
  specAddonAmount?: number;
  /** Won amount tied to optionLine (e.g. "옵션추가 +50mm") — shown right under that line. Undefined/0 when there's no addon. */
  optionAddonAmount?: number;
}) {
  const hasOption = !!optionLine;
  return (
    <div
      className={`rounded-xl border px-4 py-3.5 ${
        hasOption ? "border-[var(--color-primary)]/25 bg-[var(--color-muted)]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]">{label}</p>
      {specLine && (
        <p className="mt-1.5 text-base font-semibold tracking-[-0.01em] text-[var(--color-primary)]">
          {specLine}
          {!!specAddonAmount && (
            <span className="ml-1.5 text-sm font-semibold text-[var(--color-accent)]">
              +{specAddonAmount.toLocaleString("ko-KR")}원
            </span>
          )}
        </p>
      )}
      {optionLine && (
        <p
          className={`text-base font-semibold tracking-[-0.01em] text-[var(--color-primary)] ${specLine ? "mt-0.5 text-sm font-semibold" : "mt-1.5"}`}
        >
          {optionLine}
          {needsInquiry && <span className="ml-1.5 font-semibold">(별도문의)</span>}
          {!!optionAddonAmount && (
            <span className="ml-1.5 text-[var(--color-accent)]">+{optionAddonAmount.toLocaleString("ko-KR")}원</span>
          )}
        </p>
      )}
    </div>
  );
}

/** One clear sentence restating exactly what to click in the store — the single most prominent line in the card. */
function buildOrderSummary(match: ProductMatch): string {
  const base = bareProductName(match.productName);
  const parts: string[] = [];
  if (match.width.optionLine) parts.push(`가로 ${match.width.optionLine.replace("옵션추가 ", "")}`);
  if (match.depth.optionLine) parts.push(`세로 ${match.depth.optionLine.replace("옵션추가 ", "")}`);
  if (match.height.optionLine) parts.push(`높이 ${match.height.optionLine.replace("옵션추가 ", "")}`);

  if (parts.length === 0) {
    return `${base} 선택 후 추가 옵션 없이 바로 주문하시면 됩니다.`;
  }
  return `${base} 선택 후, ${parts.join(" · ")} 옵션을 추가해 주세요.`;
}

function MatchCard({
  match,
  inputWidth,
  inputDepth,
  inputHeight,
}: {
  match: ProductMatch;
  inputWidth: string;
  inputDepth: string;
  inputHeight: string;
}) {
  const images = getProductImages(match.product, match.variantKey);
  const baseName = bareProductName(match.productName);
  const price = computePriceForMatch(match);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white"
        >
          &#10003;
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]">
            {match.displayLabel}
          </p>
          <a
            href={`/products/${match.product}/`}
            className="mt-1 inline-block cursor-pointer text-lg font-semibold tracking-[-0.01em] text-[var(--color-primary)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[var(--color-border)]"
          >
            {match.productName}
          </a>

          <div className="mt-3 flex gap-3">
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === 0 ? `인디업 ${baseName} 맞춤 제작 제품` : "인디업 컴퓨터책상 멀티탭 거치대 구성품"}
                width={160}
                height={160}
                loading="lazy"
                className="h-24 w-24 rounded-xl object-cover sm:h-32 sm:w-32"
              />
            ))}
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">이 제품에서 아래 옵션을 선택해주세요.</p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            입력하신 사이즈 · 가로 {inputWidth}mm · 세로 {inputDepth}mm · 높이 {inputHeight}mm
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:gap-8">
        <ColorSwatchGroup title="프레임 색상" swatches={frameSwatches} compact />
        <ColorSwatchGroup title="상판 색상·마감" swatches={topSwatches} compact />
      </div>

      <div className="mt-5 rounded-xl bg-[var(--color-primary)] px-4 py-3.5 sm:px-5 sm:py-4">
        <p className="text-sm font-semibold leading-6 text-white sm:text-base">{buildOrderSummary(match)}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <OptionPill
          label="가로 옵션"
          specLine={match.width.specLine}
          optionLine={match.width.optionLine}
          needsInquiry={match.width.needsInquiry}
          optionAddonAmount={price.status === "ok" ? price.widthAddon : undefined}
        />
        <OptionPill
          label="세로 옵션"
          specLine={match.depth.specLine}
          optionLine={match.depth.optionLine}
          needsInquiry={match.depth.needsInquiry}
          specAddonAmount={price.status === "ok" ? price.depthBaseAddon : undefined}
          optionAddonAmount={price.status === "ok" ? price.depthBridgeAddon : undefined}
        />
        <OptionPill
          label="높이 옵션"
          specLine={match.height.specLine}
          optionLine={match.height.optionLine}
          needsInquiry={match.height.needsInquiry}
          optionAddonAmount={price.status === "ok" ? price.heightAddon : undefined}
        />
      </div>

      <div className="mt-4">
        <PriceBlock price={price} />
      </div>

      <p className="mt-5 text-xs leading-6 text-[var(--color-muted-foreground)] sm:text-sm">
        실제 구매는 네이버 공식 스토어에서 진행되며, 위에 안내된 옵션을 정확히 선택해 주세요.
        {match.anyInquiry &&
          " (별도문의) 표시된 옵션은 스토어에 정확히 같은 값이 등록되어 있지 않아 가장 가까운 옵션을 안내한 것입니다. 실제 제작은 가능하니 주문 전 채널톡이나 고객센터로 정확한 사이즈를 알려주시면 확인해 드립니다. 추가 비용이 발생할 수 있습니다."}
      </p>

      <a
        href={match.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        네이버 스토어에서 구매하기
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}

type FieldErrors = { width?: string; depth?: string; height?: string };
type FieldLabel = "가로" | "세로" | "높이";

function validateField(rawValue: string, label: FieldLabel, bounds: { min: number; max: number }): string | undefined {
  if (!rawValue) return `${label} 사이즈를 입력해주세요.`;
  const n = Number(rawValue);
  if (!(n > 0)) return `${label} 사이즈를 입력해주세요.`;
  if (n % 10 !== 0) return `${label} 사이즈는 10mm 단위로 입력해주세요.`;
  if (n < bounds.min) return `${label} 사이즈는 ${bounds.min}mm 이상 입력해주세요.`;
  if (n > bounds.max) return `${label} 사이즈는 ${bounds.max}mm 이하로 입력해주세요.`;
  return undefined;
}

export default function CustomFitCalculator() {
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [matches, setMatches] = useState<ProductMatch[] | null>(null);
  const [checked, setChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastChecked, setLastChecked] = useState({ width: "", depth: "", height: "" });

  // Only set when a visitor arrives here from the 책상가이드 recommendation
  // (its "맞춤 제작 방법 확인하기" link carries ?width=&depth=&height=) — a
  // direct visit to this page never has these params, so the prompt below
  // never shows for anyone who didn't just get a recommendation there.
  const searchParams = useSearchParams();
  const recommended = (() => {
    const w = Number(searchParams.get("width"));
    const d = Number(searchParams.get("depth"));
    const h = Number(searchParams.get("height"));
    if (!w || !d || !h) return null;
    return { width: w, depth: d, height: h };
  })();
  const [recommendedDismissed, setRecommendedDismissed] = useState(false);

  function acceptRecommended() {
    if (!recommended) return;
    setWidth(String(recommended.width));
    setDepth(String(recommended.depth));
    setHeight(String(recommended.height));
    setRecommendedDismissed(true);
  }

  const resultsRef = useRef<HTMLDivElement>(null);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clearing every field resets the tool back to its idle state.
  useEffect(() => {
    if (!width && !depth && !height) {
      setMatches(null);
      setChecked(false);
      setFieldErrors({});
    }
  }, [width, depth, height]);

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  useEffect(() => {
    if (checked && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  function runCheck() {
    const bounds = getGlobalBounds();
    // Gap diagnosis is a pure per-dimension check (each value against that
    // dimension's own product coverage), so it's safe to run for all three
    // fields unconditionally alongside the basic range/step validation —
    // that way width being in a gap AND height being out of range both
    // surface together, instead of one masking the other.
    const w = Number(width);
    const d = Number(depth);
    const h = Number(height);
    const gaps = diagnoseNoMatch(w || 0, d || 0, h || 0);

    const errors: FieldErrors = {
      width: validateField(width, "가로", bounds.width) ?? (width ? gaps.width : undefined),
      depth: validateField(depth, "세로", bounds.depth) ?? (depth ? gaps.depth : undefined),
      height: validateField(height, "높이", bounds.height) ?? (height ? gaps.height : undefined),
    };
    if (errors.width || errors.depth || errors.height) {
      setFieldErrors(errors);
      setMatches(null);
      setChecked(false);
      return;
    }

    setFieldErrors({});
    setLastChecked({ width, depth, height });
    setMatches(checkAllProducts(w, d, h));
    setChecked(true);
  }

  function handleCheck() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // A brief, deliberate pause so "확인 중..." is readable and rapid
    // double-submits are absorbed — the calculation itself is instant.
    submitTimer.current = setTimeout(() => {
      runCheck();
      setIsSubmitting(false);
    }, 200);
  }

  function handleReset() {
    setWidth("");
    setDepth("");
    setHeight("");
    setMatches(null);
    setChecked(false);
    setFieldErrors({});
  }

  return (
    <div>
      {recommended && !recommendedDismissed && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--color-primary)]">
            책상가이드에서 추천받은 사이즈(가로 {recommended.width}mm · 세로 {recommended.depth}mm · 높이{" "}
            {recommended.height}mm)를 입력할까요?
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={acceptRecommended}
              className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
            >
              네, 입력할게요
            </button>
            <button
              type="button"
              onClick={() => setRecommendedDismissed(true)}
              className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              아니요
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheck();
        }}
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DimensionField label="가로" value={width} onChange={setWidth} error={fieldErrors.width} onEnter={handleCheck} />
          <DimensionField label="세로" value={depth} onChange={setDepth} error={fieldErrors.depth} onEnter={handleCheck} />
          <DimensionField label="높이" value={height} onChange={setHeight} error={fieldErrors.height} onEnter={handleCheck} />
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--color-muted-foreground)]">
          책상을 놓을 공간을 줄자로 측정한 뒤 mm 단위로 입력해주세요.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? "확인 중..." : "제작 가능 여부 확인하기"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            초기화
          </button>
        </div>
      </form>

      <div ref={resultsRef} className="scroll-mt-24" aria-live="polite">
        {checked && matches && matches.length > 0 && (
          <div className="mt-10 flex flex-col gap-5">
            <div>
              <p className="text-base font-semibold tracking-[-0.01em] text-[var(--color-primary)]">
                입력하신 사이즈로 제작할 수 있습니다.
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-muted-foreground)]">
                이 사이즈로 제작 가능한 제품 {matches.length}종
              </p>
            </div>
            {matches.map((match) => (
              <MatchCard
                key={`${match.product}-${match.productName}`}
                match={match}
                inputWidth={lastChecked.width}
                inputDepth={lastChecked.depth}
                inputHeight={lastChecked.height}
              />
            ))}
          </div>
        )}

        {checked && matches && matches.length === 0 && (
          <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xs font-bold text-white"
              >
                !
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[-0.01em] text-[var(--color-primary)]">
                  입력하신 사이즈로 바로 주문 가능한 제품을 찾지 못했습니다.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">
                  사이즈를 조금 조정하거나 프레임 별도 제작이 가능한지 인디업 고객센터에 문의해주세요.
                </p>
                <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
                  입력하신 사이즈 · 가로 {lastChecked.width}mm · 세로 {lastChecked.depth}mm · 높이 {lastChecked.height}mm
                </p>
              </div>
            </div>
            <a
              href={naverTalkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              네이버 톡톡으로 문의하기
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm leading-6 text-[var(--color-muted-foreground)]">
        상판 없이 프레임만 별도로 구성하고 싶으신가요?{" "}
        <a
          href="https://brand.naver.com/indeup/category/70c2008e9ebb43fbb0aaf07f466f9e47?cp=1"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-2"
        >
          이동하기
        </a>
      </p>
    </div>
  );
}
