"use client";

import { useState } from "react";
import {
  checkFit,
  productFitConfigs,
  type DepthVariant,
  type ProductSlug,
  type ResolvedDimension,
} from "@/lib/customFit";

type Users = "1" | "2";
/**
 * Purpose directly picks the product category (and, for desks, the
 * construction type) — there's no separate "PC 본체 위치" control anymore.
 * interior: 사이드테이블/좌식책상, auxiliary: 홈바테이블/사이드테이블,
 * reading: 일반책상(1·2인용), computer: 컴퓨터책상(1·2인용), floor: 좌식책상.
 */
type Purpose = "interior" | "auxiliary" | "reading" | "computer" | "floor";
/** Which sides of the installation space are actual walls. Back is a wall
 *  in every option here — the picker only varies the left/right sides. */
type WallConfig = "left-right-back" | "left-back" | "right-back" | "back-only";

const PURPOSE_OPTIONS: { value: Purpose; label: string }[] = [
  { value: "interior", label: "인테리어용" },
  { value: "auxiliary", label: "보조용" },
  { value: "reading", label: "독서용" },
  { value: "computer", label: "컴퓨터용" },
  { value: "floor", label: "좌식용" },
];

/** Only 독서용/컴퓨터용 land on single-desk/double-desk, where 사용 인원
 *  actually changes anything — every other purpose maps to a fixed,
 *  single-size-family product line. */
function usesDeskSizingInputs(purpose: Purpose): boolean {
  return purpose === "reading" || purpose === "computer";
}

/** Rounds a physical-space ceiling down to the nearest 10mm — never up,
 *  since real desks only come in 10mm increments and a size that fits the
 *  room can't become a size that doesn't. */
function floorTo10(mm: number): number {
  return Math.floor(mm / 10) * 10;
}

/**
 * Typical Korean residential 걸레받이(baseboard) protrusion from the wall —
 * the only real obstruction a desk placed against a wall actually meets,
 * whether it's pushed straight back or slid in from the side. Applied once
 * per wall the desk actually touches; a side with no wall loses nothing.
 */
const BASEBOARD_ALLOWANCE_MM = 15;

function sideWallCount(config: WallConfig): number {
  if (config === "left-right-back") return 2;
  if (config === "left-back" || config === "right-back") return 1;
  return 0;
}

const WALL_CONFIG_OPTIONS: { value: WallConfig; label: string; left: boolean; right: boolean }[] = [
  { value: "left-right-back", label: "좌·우·뒤 벽", left: true, right: true },
  { value: "left-back", label: "좌·뒤 벽", left: true, right: false },
  { value: "right-back", label: "우·뒤 벽", left: false, right: true },
  { value: "back-only", label: "뒤 벽만", left: false, right: false },
];

/** Names the actual side(s) with a wall instead of a generic "옆면 N곳". */
function describeSpaceAdjustment(spaceWidth: number, spaceDepth: number, wallConfig: WallConfig): string {
  const option = WALL_CONFIG_OPTIONS.find((o) => o.value === wallConfig)!;
  const sideNames: string[] = [];
  if (option.left) sideNames.push("좌측면");
  if (option.right) sideNames.push("우측면");

  const sideClause =
    sideNames.length > 0
      ? `${sideNames.join("과 ")}에 걸레받이(${BASEBOARD_ALLOWANCE_MM}mm)를 가로에서 제외했고`
      : "옆면은 벽이 없어 가로에서는 제외한 공간이 없고";

  return `입력하신 공간 ${spaceWidth} × ${spaceDepth}mm(${option.label} 기준)에서, ${sideClause}, 뒤쪽면에 걸레받이(${BASEBOARD_ALLOWANCE_MM}mm)를 세로에서 제외했습니다.`;
}

/** Simple top-down diagram: thick solid = wall, thin dashed = open side. */
function WallDiagramIcon({ left, right }: { left: boolean; right: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
      <rect x="8" y="10" width="16" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <line x1="4" y1="6" x2="28" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line
        x1="4"
        y1="6"
        x2="4"
        y2="27"
        stroke="currentColor"
        strokeWidth={left ? 2.5 : 1}
        strokeDasharray={left ? undefined : "2 2"}
        opacity={left ? 1 : 0.35}
        strokeLinecap="round"
      />
      <line
        x1="28"
        y1="6"
        x2="28"
        y2="27"
        stroke="currentColor"
        strokeWidth={right ? 2.5 : 1}
        strokeDasharray={right ? undefined : "2 2"}
        opacity={right ? 1 : 0.35}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Desk-height basis: indeup's own published formula (already live on its
 * Naver store product pages) — "최적의 책상 높이 = 신장 × 0.41", sourced
 * there to 국가기술표준원(KATS) 인체치수 데이터 및 인체공학적 설계표준
 * (ISO/TC 159) 권고안, with indeup's own stated tolerance of ±1~2cm for
 * individual body proportions and usage environment. Reused verbatim here
 * rather than any separately-derived formula, since it's the figure indeup
 * itself already stands behind.
 */
const HEIGHT_RATIO = 0.41;
const HEIGHT_TOLERANCE_CM = "1~2";
const DEFAULT_SEATED_HEIGHT_MM = 720;

function recommendedHeightFromStature(heightCm: number | null): number | null {
  if (!heightCm) return null;
  const raw = heightCm * HEIGHT_RATIO * 10; // cm -> mm
  return Math.round(raw / 10) * 10;
}

type MatchedResult = {
  status: "matched";
  isFallback: boolean;
  requestedLabel: string;
  requestedReason?: string;
  productSlug: ProductSlug;
  productLabel: string;
  productName: string;
  displayLabel: string;
  buyUrl: string;
  width: ResolvedDimension;
  depth: ResolvedDimension;
  height: ResolvedDimension;
  anyInquiry: boolean;
};

type NoFitResult = {
  status: "no-fit";
  requestedLabel: string;
  reason?: string;
};

type Recommendation = MatchedResult | NoFitResult;

/**
 * Every real (non-inquiry-only) product line, ordered by its own smallest
 * real depth (side-table 200mm < the rest at 300mm < single-desk's 일반책상
 * line at 500mm). Appended as a last-resort tier after the purpose-specific
 * choices — if none of those actually fit the room's depth, this is what
 * "recommend whatever smallest-depth product we actually sell" falls back
 * to, rather than giving up immediately.
 */
const ALL_CATEGORIES_BY_DEPTH: ProductSlug[] = [
  "side-table",
  "double-desk",
  "floor-desk",
  "home-bar-table",
  "single-desk",
];

/**
 * Purpose picks the category outright, per the operator's own mapping:
 * interior -> side-table then floor-desk, auxiliary -> home-bar-table then
 * side-table, reading/computer -> single- or double-desk depending on 사용
 * 인원, floor -> floor-desk only. Every other real product line is appended
 * after that as a last-resort fallback (see ALL_CATEGORIES_BY_DEPTH) — not
 * a substitute for the user's stated purpose, only used if nothing in the
 * purpose's own list actually fits the room.
 */
function categoryOrderFor(purpose: Purpose, users: Users): ProductSlug[] {
  const primary: ProductSlug[] = (() => {
    switch (purpose) {
      case "interior":
        return ["side-table", "floor-desk"];
      case "auxiliary":
        return ["home-bar-table", "side-table"];
      case "reading":
      case "computer":
        return users === "2" ? ["double-desk", "single-desk"] : ["single-desk"];
      case "floor":
        return ["floor-desk"];
    }
  })();
  const rest = ALL_CATEGORIES_BY_DEPTH.filter((slug) => !primary.includes(slug));
  return [...primary, ...rest];
}

/**
 * Depth only comes in a sparse set of real values (each variant's listed
 * bases, plus base+bridge for the one extra step past each base) — unlike
 * width, there's no smooth 10mm stepping, so checkFit()/resolveDepth() will
 * round up to the nearest real depth when asked for something in a gap
 * (e.g. asking for 235mm can resolve to 250mm = 200+bridge). That's correct
 * for /custom-fit/ (customer wants at least X), but wrong when the target
 * is a physical ceiling: this instead finds the largest real depth that is
 * still <= that ceiling, so checkFit() only ever gets an exact, valid
 * value it can resolve without rounding past the room.
 */
function largestBuildableDepth(variant: DepthVariant, bridge: number, ceilingMm: number): number | null {
  let best: number | null = null;
  for (const base of variant.bases) {
    if (base <= variant.hardMax && base <= ceilingMm) best = best === null ? base : Math.max(best, base);
    const withBridge = base + bridge;
    if (withBridge <= variant.hardMax && withBridge <= ceilingMm) best = best === null ? withBridge : Math.max(best, withBridge);
  }
  return best;
}

/** The depth variant (일반책상 vs 컴퓨터책상) matching whether a PC tower
 *  was declared, for whichever product line is being tried. */
function preferredDepthVariant(depth: { variants: DepthVariant[] } | null, hasTower: boolean): DepthVariant | null {
  if (!depth) return null;
  return depth.variants.find((v) => (hasTower ? v.key === "computer" : v.key !== "computer")) ?? null;
}

/**
 * Requires a real measured space — spaceWidth/spaceDepth are mandatory here
 * (validated before this is ever called). A recommendation with no actual
 * space input isn't a recommendation, it's a guess, so this function no
 * longer has a "no space given" heuristic branch at all.
 *
 * Every number this returns is validated through the same checkFit() engine
 * /custom-fit/ uses — it will never claim a size fits when it doesn't (e.g.
 * a 2인용 책상 needs >=1600mm wide; a space smaller than that simply won't
 * resolve as feasible, so we fall back to a realistic alternative and say
 * so, instead of forcing the requested category into a space it can't use).
 */
function recommend(input: {
  spaceWidth: number;
  spaceDepth: number;
  users: Users;
  purpose: Purpose;
  heightCm: number | null;
  wallConfig: WallConfig;
}): Recommendation {
  // 컴퓨터용 is the only purpose that implies a PC tower sharing the desk —
  // it alone decides 일반책상 vs 컴퓨터책상 now that there's no separate
  // "PC 본체 위치" control.
  const hasTower = input.purpose === "computer";
  const usableWidth = Math.max(input.spaceWidth - sideWallCount(input.wallConfig) * BASEBOARD_ALLOWANCE_MM, 0);
  const usableDepth = Math.max(input.spaceDepth - BASEBOARD_ALLOWANCE_MM, 0);

  const order = categoryOrderFor(input.purpose, input.users);
  const requestedLabel = productFitConfigs[order[0]].label;
  let requestedReason: string | undefined;

  for (let i = 0; i < order.length; i++) {
    const slug = order[i];
    const config = productFitConfigs[slug];

    // floor-desk uses its own low, floor-sitting height range — never the
    // chair-height formula — regardless of which purpose led here (e.g.
    // 인테리어용 falling back from side-table to floor-desk).
    const desiredHeight =
      slug === "floor-desk"
        ? config.height!.defaultHeight
        : (recommendedHeightFromStature(input.heightCm) ?? DEFAULT_SEATED_HEIGHT_MM);

    // Width maximizes to fill the usable space, capped at what this
    // product line can build — a room bigger than the max is never a
    // problem, only a room smaller than the min is. checkFit()/
    // resolveWidth() would otherwise round a non-10mm-aligned request UP
    // to the nearest buildable size (correct for /custom-fit/, where a
    // slightly bigger desk than requested is fine) — here candidateWidth
    // is a physical ceiling, so floor to 10mm first to guarantee the
    // result never exceeds the room.
    const maxWidth = config.width ? Math.max(...config.width.bases) : 0;
    const candidateWidth = floorTo10(Math.min(usableWidth, maxWidth));

    // Depth doesn't have width's smooth 10mm stepping — it only comes in
    // each variant's listed bases plus one further bridge step, so
    // resolveDepth() rounds up to the nearest real depth when asked for a
    // value in a gap. Pre-picking the largest real depth <= the ceiling
    // avoids that: checkFit() below then only ever resolves it exactly,
    // never past the room. If nothing in this product line's matching
    // construction type (일반책상 vs 컴퓨터책상) fits at all, this is null
    // and the slug is skipped rather than silently building the *other*
    // construction type or a size bigger than the room.
    const depthVariant = preferredDepthVariant(config.depth, hasTower);
    const depthCeiling = config.depth
      ? Math.min(usableDepth, Math.max(...config.depth.variants.map((v) => v.hardMax)))
      : 0;
    const candidateDepth = depthVariant ? largestBuildableDepth(depthVariant, config.depth!.bridge, depthCeiling) : null;

    if (candidateDepth == null) {
      if (i === 0) {
        requestedReason = `이 공간에서는 ${hasTower ? "PC 본체 구성(컴퓨터책상)" : "일반책상 구성"}으로 제작 가능한 깊이를 찾지 못했습니다.`;
      }
      continue;
    }

    const outcome = checkFit({ product: slug, width: candidateWidth, depth: candidateDepth, height: desiredHeight });

    if (outcome.kind === "feasible") {
      const variant = outcome.products.find((p) => (hasTower ? p.variantKey === "computer" : p.variantKey !== "computer"));
      if (variant) {
        return {
          status: "matched",
          isFallback: i > 0,
          requestedLabel,
          requestedReason,
          productSlug: slug,
          productLabel: productFitConfigs[slug].label,
          productName: variant.name,
          displayLabel: variant.displayLabel,
          buyUrl: variant.buyUrl,
          width: outcome.width,
          depth: outcome.depth,
          height: outcome.height,
          anyInquiry: outcome.anyInquiry,
        };
      }
      // Only the other construction type is buildable at this size — don't
      // substitute it silently; treat this as not a real match and move on.
      if (i === 0) {
        requestedReason = `이 공간에서는 ${hasTower ? "PC 본체 구성(컴퓨터책상)" : "일반책상 구성"}으로 제작 가능한 사이즈를 찾지 못했습니다.`;
      }
      continue;
    }

    if (i === 0) {
      if (outcome.kind === "infeasible") requestedReason = outcome.reason;
      else if (outcome.kind === "redirect") requestedReason = outcome.message;
    }
  }

  return { status: "no-fit", requestedLabel, reason: requestedReason };
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-sm font-semibold text-[var(--color-primary)]">{children}</span>;
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`min-h-[40px] cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200 ${
            value === opt.value
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
              : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SizeField({
  id,
  label,
  unit,
  value,
  onChange,
  placeholder,
  error,
  muted,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  muted?: boolean;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>
        <FieldLabel>{label}</FieldLabel>
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`h-12 w-full rounded-xl border px-4 pr-11 text-base outline-none transition-colors ${
            muted ? "bg-[var(--color-muted)]" : "bg-white"
          } ${
            error
              ? "border-[var(--color-brand)] focus:border-[var(--color-brand)]"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
          }`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted-foreground)]"
        >
          {unit}
        </span>
      </div>
      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-[var(--color-brand)]">
          {error}
        </span>
      )}
    </div>
  );
}

function WallConfigPicker({ value, onChange }: { value: WallConfig; onChange: (v: WallConfig) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {WALL_CONFIG_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex min-h-[72px] w-[84px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-medium transition-colors duration-200 ${
            value === opt.value
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
              : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          <WallDiagramIcon left={opt.left} right={opt.right} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SpecRow({ label, spec }: { label: string; spec: ResolvedDimension }) {
  // Base and any add-on option are summed into one final mm figure here —
  // this page shows the buildable total, not the store's "기본사양 + 옵션"
  // breakdown (that split matters on /custom-fit/, where it maps to real
  // store options to select; here it would just be visual noise).
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3">
      <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--color-primary)]">
        {spec.resolvedValue}mm
        {spec.needsInquiry && <span className="ml-1 font-semibold">(별도문의)</span>}
      </p>
    </div>
  );
}

export default function QuickSizeFinder() {
  const [spaceWidth, setSpaceWidth] = useState("");
  const [spaceDepth, setSpaceDepth] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [users, setUsers] = useState<Users>("1");
  const [purpose, setPurpose] = useState<Purpose>("reading");
  const [wallConfig, setWallConfig] = useState<WallConfig>("back-only");
  const [result, setResult] = useState<Recommendation | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ width?: string; depth?: string }>({});
  const [usedInputs, setUsedInputs] = useState<{ spaceWidth: number; spaceDepth: number; wallConfig: WallConfig } | null>(
    null
  );

  function handleSubmit() {
    const errors: { width?: string; depth?: string } = {};
    if (!spaceWidth) errors.width = "설치공간 가로를 입력해 주세요.";
    if (!spaceDepth) errors.depth = "설치공간 깊이를 입력해 주세요.";
    setFieldErrors(errors);
    if (errors.width || errors.depth) {
      setResult(null);
      return;
    }

    const parsedWidth = Number(spaceWidth);
    const parsedDepth = Number(spaceDepth);
    setUsedInputs({ spaceWidth: parsedWidth, spaceDepth: parsedDepth, wallConfig });
    setResult(
      recommend({
        spaceWidth: parsedWidth,
        spaceDepth: parsedDepth,
        wallConfig,
        users,
        purpose,
        heightCm: heightCm ? Number(heightCm) : null,
      })
    );
  }

  function handleReset() {
    setSpaceWidth("");
    setSpaceDepth("");
    setHeightCm("");
    setUsers("1");
    setPurpose("reading");
    setWallConfig("back-only");
    setResult(null);
    setUsedInputs(null);
    setFieldErrors({});
  }

  const usedSideWalls = usedInputs ? sideWallCount(usedInputs.wallConfig) : 0;
  const usableWidth = usedInputs ? Math.max(usedInputs.spaceWidth - usedSideWalls * BASEBOARD_ALLOWANCE_MM, 0) : null;
  const usableDepth = usedInputs ? Math.max(usedInputs.spaceDepth - BASEBOARD_ALLOWANCE_MM, 0) : null;

  return (
    <div id="quick-size-finder" className="scroll-mt-24 rounded-2xl border border-[var(--color-border)] p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <SizeField
          id="qsf-width"
          label="설치공간 가로"
          unit="mm"
          value={spaceWidth}
          onChange={setSpaceWidth}
          placeholder="예: 1200"
          error={fieldErrors.width}
        />
        <SizeField
          id="qsf-depth"
          label="설치공간 깊이"
          unit="mm"
          value={spaceDepth}
          onChange={setSpaceDepth}
          placeholder="예: 600"
          error={fieldErrors.depth}
        />
        <SizeField
          id="qsf-height"
          label="사용자의 키"
          unit="cm"
          value={heightCm}
          onChange={setHeightCm}
          placeholder="예: 170"
          muted
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--color-muted-foreground)]">
        가로·깊이는 줄자로 잰 실측 길이를 입력해 주세요. 설치 여유 공간과 걸레받이 두께는 아래 벽면 구성에 맞춰
        자동으로 감안합니다. 키는 입력하지 않아도 추천을 볼 수 있습니다.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <FieldLabel>벽면 구성</FieldLabel>
        <WallConfigPicker value={wallConfig} onChange={setWallConfig} />
        <p className="text-xs leading-5 text-[var(--color-muted-foreground)]">
          책상을 놓을 자리를 위에서 내려다봤을 때, 뒤쪽 외에 좌우 어느 쪽에 벽이 있는지 선택해 주세요. 벽이 있는
          쪽마다 걸레받이 두께를 가로 폭에서 제외합니다.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <FieldLabel>사용 목적</FieldLabel>
        <SegmentedControl value={purpose} onChange={setPurpose} options={PURPOSE_OPTIONS} />
      </div>

      {usesDeskSizingInputs(purpose) && (
        <div className="mt-6 flex flex-col gap-2">
          <FieldLabel>사용 인원</FieldLabel>
          <SegmentedControl
            value={users}
            onChange={setUsers}
            options={[
              { value: "1", label: "1명" },
              { value: "2", label: "2명" },
            ]}
          />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85 sm:flex-none"
        >
          추천 사이즈 확인하기
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          초기화
        </button>
      </div>

      {result && usedInputs && (
        <div className="mt-8 flex flex-col gap-4">
          <div className="rounded-xl bg-[var(--color-muted)] p-4 text-xs leading-6 text-[var(--color-muted-foreground)]">
            <p className="font-semibold text-[var(--color-secondary)]">설치 여유 공간 계산</p>
            <p className="mt-1">
              {describeSpaceAdjustment(usedInputs.spaceWidth, usedInputs.spaceDepth, usedInputs.wallConfig)} 실제로
              책상이 들어갈 수 있는 공간은{" "}
              <strong className="font-bold text-[var(--color-primary)]">
                약 {usableWidth} × {usableDepth}mm
              </strong>
              입니다. 아래 추천 사이즈는 이 실사용 공간을 기준으로 계산했습니다.
            </p>
          </div>

          {result.status === "no-fit" ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center sm:p-8">
              <p className="text-base font-semibold text-[var(--color-primary)]">
                죄송합니다. 이 공간에는 추천해 드릴 수 있는 제품이 없습니다.
              </p>
              {result.reason && (
                <p className="mt-2 text-sm leading-6 text-[var(--color-secondary)]">{result.reason}</p>
              )}
              <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)]">
                벽 사이 거리를 다시 실측해 보시거나 다른 벽면을 검토해 주세요. 정확한 실측값으로 직접 옵션을
                조정해 보고 싶다면 맞춤 제작 페이지를 이용하실 수 있습니다.
              </p>
              <a
                href="/custom-fit/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                맞춤 제작 방법 확인하기
              </a>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--color-muted)] p-6 sm:p-8">
              {result.isFallback && (
                <div className="mb-5 rounded-xl border border-[var(--color-brand)]/30 bg-white p-4">
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {result.requestedLabel} 설치는 권장하지 않습니다.
                  </p>
                  {result.requestedReason && (
                    <p className="mt-1 text-xs leading-5 text-[var(--color-muted-foreground)]">
                      {result.requestedReason}
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-5 text-[var(--color-secondary)]">
                    대신 이 공간에 실제로 들어갈 수 있는 현실적인 대안을 아래에 안내합니다.
                  </p>
                </div>
              )}

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
                {result.isFallback ? "현실적인 대안" : "추천 사이즈"}
              </p>
              <p className="mt-1 text-xl font-bold tracking-[-0.01em] text-[var(--color-primary)] sm:text-2xl">
                {result.productName}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SpecRow label="가로" spec={result.width} />
                <SpecRow label="깊이" spec={result.depth} />
                <SpecRow label="높이" spec={result.height} />
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[var(--color-brand)] bg-white p-4">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-brand)]"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-xs font-semibold leading-5 text-[var(--color-primary)]">
                  이 사이즈는 책상이 들어가는 공간만 계산한 값입니다. 공간이 좁으면 의자 팔걸이가 벽이나 책상
                  옆면에 걸려 의자가 책상 안까지 완전히 들어가지 않을 수 있고, 출입문이 책상 쪽으로 열리는
                  구조라면 문이 열리는 범위와 겹쳐 문을 다 열지 못하거나 의자를 빼기 어려울 수 있습니다. 사용하실
                  의자의 팔걸이 폭과 출입문 위치는 고객님께서 직접 확인하고 판단해 주세요.
                </p>
              </div>

              {usesDeskSizingInputs(purpose) && (
                <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-white p-4 text-xs leading-6 text-[var(--color-muted-foreground)]">
                  <p className="font-semibold text-[var(--color-secondary)]">사용 목적에 맞는 안내</p>
                  {purpose === "reading" ? (
                    <p className="mt-1">
                      독서용으로 사용하신다면 PC 본체용 배선 정리 없이도 깔끔한 일반책상 구성으로 충분합니다. 나중에
                      PC를 두실 계획이 있다면 위 &quot;사용 목적&quot;을 &quot;컴퓨터용&quot;으로 바꿔 다시 확인해
                      주세요.
                    </p>
                  ) : (
                    <p className="mt-1">
                      컴퓨터용에서는 PC 본체 배선 정리가 되는 컴퓨터책상 구성을 우선 추천합니다. 모니터암을 함께
                      쓰시거나 모니터·노트북을 같이 올려두실 경우에는 깊이 600mm 이상이 여유롭습니다 — 현재 추천
                      깊이는 {result.depth.resolvedValue}mm입니다.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-white p-4 text-xs leading-6 text-[var(--color-muted-foreground)]">
                <p className="font-semibold text-[var(--color-secondary)]">높이 계산 기준</p>
                {result.productSlug === "floor-desk" ? (
                  <p className="mt-1">
                    좌식 책상은 신장 기반의 공식 기준 자료를 확인하지 못해, 제품 기본 높이(
                    {productFitConfigs["floor-desk"].height!.defaultHeight}mm)를 기준으로 안내했습니다.
                  </p>
                ) : (
                  <p className="mt-1">
                    인디업은 책상 높이를 &quot;신장 × {HEIGHT_RATIO}&quot; 공식으로 계산합니다. 국가기술표준원
                    (KATS) 인체치수 데이터와 인체공학적 설계표준(ISO/TC 159) 권고안을 근거로 한 값으로, 앉은
                    자세에서 팔꿈치 내각이 약 90도를 유지할 수 있는 높이입니다.{" "}
                    {heightCm
                      ? `입력하신 키 ${heightCm}cm 기준 권장 높이는 약 ${(Number(heightCm) * HEIGHT_RATIO).toFixed(1)}cm입니다.`
                      : `키를 입력하지 않아 제품 기본 높이(${DEFAULT_SEATED_HEIGHT_MM}mm)를 기준으로 안내했습니다 — 위 입력란에 키를 넣으면 이 공식으로 다시 계산됩니다.`}{" "}
                    인디업 책상은 사용 중 높이를 바꾸는 전동/가스실린더 승강식 책상이 아니라, 주문 시 선택한 높이
                    그대로 제작되는 고정형 책상입니다. 개인의 신체 비율과 사용 환경에 따라 ±{HEIGHT_TOLERANCE_CM}
                    cm의 차이가 있을 수 있습니다.
                  </p>
                )}
                <p className="mt-2">
                  모든 사이즈는 10mm 단위로 제작되며, 실측·설치 환경에 따라 ±10mm 내외의 공차가 있을 수 있습니다.
                </p>
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[var(--color-primary)]/15 bg-white p-4">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <p className="text-xs font-semibold leading-5 text-[var(--color-primary)]">
                  고객님, 저희는 이 사이즈의 제품이 제작 가능합니다. 제작 방법이 궁금하다면 아래 &quot;맞춤 제작
                  방법 확인하기&quot;를 눌러 주문 방법을 참고해 주세요.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`/products/${result.productSlug}/`}
                  className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
                >
                  추천 사이즈 제품 확인하기
                </a>
                <a
                  href="/custom-fit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  맞춤 제작 방법 확인하기
                </a>
              </div>

              <p className="mt-4 text-xs text-[var(--color-muted-foreground)]">
                이 결과는 참고용 추천 사이즈입니다. 정확한 제작 가능 여부와 옵션은 맞춤 제작 페이지에서 확인해
                주세요.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
