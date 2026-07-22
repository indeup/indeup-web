/**
 * Custom-size feasibility rules, encoded exactly as provided by the store
 * operator (not inferred/estimated). Every base size, option increment,
 * ceiling and redirect threshold below is a literal business rule — do not
 * "clean up" or round any of these numbers without re-confirming with the
 * operator, since customers act on this result directly.
 */

export type DepthVariant = {
  key: string;
  /** Product-name fragment, e.g. "책상" or "컴퓨터책상". */
  label: string;
  /** Small eyebrow label shown above the product name in a result card, e.g. "일자형책상" or "컴퓨터책상". */
  displayLabel: string;
  bases: number[];
  /** Largest depth reachable for this variant (base, or base + bridge if the bridge is allowed past the last base). */
  hardMax: number;
  /** Extra parenthetical appended to the product name, e.g. "(책상 + 멀티탭거치대 기본 1개 포함 구성)" or "(양면사용가능 제품)". */
  nameSuffix?: string;
};

export type WidthRule =
  | { kind: "continuous"; step: number; maxOption: number }
  | { kind: "fixed"; options: number[] };

export type HeightRule = {
  /** The height the product ships with by default — matching this needs no option selected at all. */
  defaultHeight: number;
  min: number;
  max: number;
  step: number;
  /** Above `max` but below this, still buildable — capped at `max` and flagged for manual confirmation (extra cost likely). */
  deadZoneCeiling?: number;
  /** At or above this raw height, redirect to a different product line entirely instead of resolving in-place. */
  redirectAtOrAbove?: { threshold: number; toProduct: ProductSlug; message: string };
};

export type ProductSlug =
  | "single-desk"
  | "double-desk"
  | "floor-desk"
  | "side-table"
  | "home-bar-table"
  | "frame";

export type ProductFitConfig = {
  slug: ProductSlug;
  label: string;
  /** Prefix used when building the recommended product name, e.g. "1인용". Empty for products that don't take one. */
  namePrefix: string;
  width: { bases: number[]; rule: WidthRule } | null;
  depth: {
    variants: DepthVariant[];
    bridge: number;
    /** At or above this raw depth, redirect to a different product line instead of resolving in-place. */
    redirectAtOrAbove?: { threshold: number; toProduct: ProductSlug; message: string };
  } | null;
  height: HeightRule | null;
  inquiryOnly?: boolean;
  /** When true, the width number is left out of the product name (e.g. home-bar-table's name doesn't vary by width the way desks do) — the width option pill states the size explicitly instead. */
  hideWidthInName?: boolean;
};

export const productFitConfigs: Record<ProductSlug, ProductFitConfig> = {
  "single-desk": {
    slug: "single-desk",
    label: "1인용 책상",
    namePrefix: "1인용",
    width: {
      bases: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
      rule: { kind: "continuous", step: 10, maxOption: 90 },
    },
    depth: {
      bridge: 50,
      variants: [
        {
          key: "general",
          label: "책상",
          displayLabel: "일자형책상",
          bases: [500, 600, 700],
          hardMax: 700,
          nameSuffix: "(책상 단품)",
        },
        {
          key: "computer",
          label: "컴퓨터책상",
          displayLabel: "컴퓨터책상",
          bases: [300, 400, 500, 600, 700],
          hardMax: 700,
          nameSuffix: "(책상 + 멀티탭거치대 기본 1개 포함 구성)",
        },
      ],
    },
    height: { defaultHeight: 720, min: 500, max: 1000, step: 10 },
  },
  "double-desk": {
    slug: "double-desk",
    label: "2인용 책상",
    namePrefix: "2인용",
    width: {
      bases: [1600, 1800, 2000, 2200, 2400, 2600],
      rule: { kind: "fixed", options: [50, 100, 150] },
    },
    depth: {
      bridge: 50,
      variants: [
        {
          key: "general",
          label: "책상",
          displayLabel: "2인용 이상 책상",
          bases: [300, 400, 500, 600, 700],
          hardMax: 700,
          nameSuffix: "(책상 단품)",
        },
        {
          key: "computer",
          label: "컴퓨터책상",
          displayLabel: "컴퓨터책상",
          bases: [300, 400, 500, 600, 700],
          hardMax: 700,
          nameSuffix: "(책상 + 멀티탭거치대 기본 2개 포함 구성)",
        },
      ],
    },
    height: {
      defaultHeight: 720,
      min: 500,
      max: 750,
      step: 10,
      deadZoneCeiling: 1000,
    },
  },
  "floor-desk": {
    slug: "floor-desk",
    label: "좌식 책상",
    namePrefix: "",
    width: {
      bases: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
      rule: { kind: "continuous", step: 10, maxOption: 90 },
    },
    depth: {
      bridge: 50,
      variants: [
        {
          key: "default",
          label: "좌식 책상",
          displayLabel: "좌식책상",
          bases: [300, 400, 500, 600, 700],
          hardMax: 700,
          nameSuffix: "(책상 단품)",
        },
      ],
    },
    height: {
      defaultHeight: 320,
      min: 300,
      max: 500,
      step: 10,
      redirectAtOrAbove: {
        threshold: 510,
        toProduct: "single-desk",
        message: "이 높이는 좌식 책상 범위를 넘어섭니다. 1인용 책상으로 다시 확인해 보세요.",
      },
    },
  },
  "side-table": {
    slug: "side-table",
    label: "사이드테이블",
    namePrefix: "",
    width: {
      bases: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
      rule: { kind: "continuous", step: 10, maxOption: 90 },
    },
    depth: {
      bridge: 50,
      variants: [
        {
          key: "default",
          label: "사이드테이블",
          displayLabel: "보조책상",
          bases: [200, 300, 400],
          hardMax: 400,
          nameSuffix: "(책상 단품)",
        },
      ],
      redirectAtOrAbove: {
        threshold: 410,
        toProduct: "single-desk",
        message: "이 세로 길이는 사이드테이블 범위를 넘어섭니다. 1인용 책상으로 다시 확인해 보세요.",
      },
    },
    height: { defaultHeight: 720, min: 500, max: 1000, step: 10 },
  },
  "home-bar-table": {
    slug: "home-bar-table",
    label: "홈바테이블",
    namePrefix: "",
    width: {
      bases: [800, 900, 1000, 1100, 1200, 1300],
      rule: { kind: "continuous", step: 10, maxOption: 90 },
    },
    depth: {
      bridge: 50,
      variants: [
        {
          key: "default",
          label: "홈바테이블",
          displayLabel: "보조식탁",
          bases: [300, 400],
          hardMax: 450,
          nameSuffix: "(양면사용가능 제품)",
        },
      ],
    },
    height: { defaultHeight: 720, min: 500, max: 1000, step: 10 },
    hideWidthInName: true,
  },
  frame: {
    slug: "frame",
    label: "프레임",
    namePrefix: "",
    width: null,
    depth: null,
    height: null,
    inquiryOnly: true,
  },
};

// ---------------------------------------------------------------------------

/** Generic storefront, used whenever no exact product-page match exists below. */
export const naverStoreUrl = "https://brand.naver.com/indeup";

const naverProductIdBase = "https://brand.naver.com/indeup/products/";

/**
 * Per-(product, variant, width) Naver product-page ids, as given by the
 * store operator. Not every width is listed for every variant (e.g. the
 * 1인용 컴퓨터책상 line has no separate 400/500mm listing yet) — those fall
 * back to the generic storefront rather than guessing a URL.
 */
const naverProductIds: Partial<Record<ProductSlug, Partial<Record<string, Partial<Record<number, string>>>>>> = {
  "floor-desk": {
    default: {
      400: "13591736942",
      500: "13591720708",
      600: "10763968729",
      700: "10763987835",
      800: "10764000907",
      900: "10764015121",
      1000: "5956103448",
      1100: "10764025221",
      1200: "10764053245",
      1300: "10764064982",
    },
  },
  "single-desk": {
    general: {
      400: "12427035543",
      500: "12426984725",
      600: "10763492000",
      700: "10763507391",
      800: "10763521696",
      900: "10763565398",
      1000: "10763591655",
      1100: "10763606757",
      1200: "6842063718",
      1300: "10763627145",
    },
    computer: {
      600: "10755183749",
      700: "10755205695",
      800: "10755221384",
      900: "10755235725",
      1000: "10755246207",
      1100: "10755257998",
      1200: "5432796127",
      1300: "10755271658",
    },
  },
  "double-desk": {
    general: {
      1600: "10785325091",
      1800: "10785333375",
      2000: "9608922718",
      2200: "10785348331",
      2400: "10785356425",
      2600: "10785364610",
    },
    computer: {
      1600: "10756749885",
      1800: "10756844114",
      2000: "10756855929",
      2200: "10756871606",
      2400: "5455666705",
      2600: "10756915799",
    },
  },
  "side-table": {
    default: {
      400: "12426919807",
      500: "12426856163",
      600: "10738507492",
      700: "10749409409",
      800: "10749426324",
      900: "10749434777",
      1000: "10749441970",
      1100: "10749448032",
      1200: "10749452093",
      1300: "10749473445",
    },
  },
  "home-bar-table": {
    // A single listing regardless of width — the same product page covers every size.
    default: { 0: "11914922638" },
  },
};

export function resolveNaverProductUrl(product: ProductSlug, variantKey: string, width: number): string {
  const variantMap = naverProductIds[product]?.[variantKey];
  if (!variantMap) return naverStoreUrl;
  const id = variantMap[width] ?? variantMap[0];
  return id ? `${naverProductIdBase}${id}` : naverStoreUrl;
}

export type DimensionResult =
  | { status: "exact"; base: number; option: number | null; resolvedValue: number }
  | { status: "rounded-up"; base: number; option: number; resolvedValue: number }
  | { status: "infeasible"; reason?: string }
  | { status: "redirect"; toProduct: ProductSlug; message: string };

/**
 * Always anchors to the largest base <= desired, then extends upward within
 * that single base's own option ladder (never jumps to a different base row)
 * — this matches the store's real dropdown structure, where an option is
 * only ever added on top of the specific size product you're viewing.
 * Anything below the smallest sold size is a hard reject, same as anything
 * above the ceiling — there is no "just give me the minimum" fallback.
 */
function resolveBaseAndOption(
  bases: number[],
  desired: number,
  hardMax: number,
  getOptionForDiff: (diff: number) => { option: number; exact: boolean } | null
): DimensionResult {
  const sorted = [...bases].sort((a, b) => a - b);
  const min = sorted[0];

  if (desired > hardMax) {
    return { status: "infeasible", reason: `최대 ${hardMax}mm까지 제작 가능합니다.` };
  }
  if (desired < min) {
    return { status: "infeasible", reason: `최소 ${min}mm부터 제작 가능합니다.` };
  }
  if (desired === min) return { status: "exact", base: min, option: null, resolvedValue: min };

  const base = Math.max(...sorted.filter((b) => b <= desired));
  const diff = desired - base;
  if (diff === 0) return { status: "exact", base, option: null, resolvedValue: base };

  const found = getOptionForDiff(diff);
  if (!found) return { status: "infeasible" };
  if (found.exact) return { status: "exact", base, option: found.option, resolvedValue: base + found.option };
  return { status: "rounded-up", base, option: found.option, resolvedValue: base + found.option };
}

export function resolveWidth(config: ProductFitConfig, desiredRaw: number): DimensionResult | null {
  if (!config.width) return null;
  const { bases, rule } = config.width;
  const hardMax = Math.max(...bases);

  if (rule.kind === "continuous") {
    const desired = Math.ceil(desiredRaw / 10) * 10; // finest real granularity is 10mm
    return resolveBaseAndOption(bases, desired, hardMax, (diff) => {
      const rounded = Math.ceil(diff / rule.step) * rule.step;
      if (rounded > rule.maxOption) return null;
      return { option: rounded, exact: rounded === diff };
    });
  }

  return resolveBaseAndOption(bases, desiredRaw, hardMax, (diff) => {
    const sortedOptions = [...rule.options].sort((a, b) => a - b);
    const chosen = sortedOptions.find((o) => o >= diff);
    if (chosen != null) return { option: chosen, exact: chosen === diff };
    // Exceeds the largest option for this base — cap there and flag for manual confirmation.
    const capped = sortedOptions[sortedOptions.length - 1];
    return { option: capped, exact: false };
  });
}

export function resolveDepthForVariant(
  variant: DepthVariant,
  bridge: number,
  desired: number
): DimensionResult | null {
  // The bridge is the only depth option that exists — same as width's
  // fixed-option ladder, always cap at it and flag for manual confirmation
  // when it's not an exact match, rather than rejecting outright.
  return resolveBaseAndOption(variant.bases, desired, variant.hardMax, (diff) => {
    return { option: bridge, exact: diff === bridge };
  });
}

export function resolveHeight(rule: HeightRule, desiredRaw: number): DimensionResult {
  if (rule.redirectAtOrAbove && desiredRaw >= rule.redirectAtOrAbove.threshold) {
    return { status: "redirect", toProduct: rule.redirectAtOrAbove.toProduct, message: rule.redirectAtOrAbove.message };
  }
  if (desiredRaw < rule.min) {
    return { status: "infeasible", reason: `최소 ${rule.min}mm부터 제작 가능합니다.` };
  }
  if (desiredRaw === rule.min) {
    return { status: "exact", base: rule.min, option: null, resolvedValue: rule.min };
  }
  const rounded = Math.ceil(desiredRaw / rule.step) * rule.step;
  if (rounded <= rule.max) {
    return { status: "exact", base: rounded, option: null, resolvedValue: rounded };
  }
  if (rule.deadZoneCeiling && desiredRaw < rule.deadZoneCeiling) {
    return { status: "rounded-up", base: rule.max, option: 0, resolvedValue: rule.max };
  }
  return { status: "infeasible" };
}

export type DepthResolution =
  | { status: "redirect"; toProduct: ProductSlug; message: string }
  | { status: "infeasible"; reason?: string }
  | { status: "ok"; result: DimensionResult; applicableVariants: DepthVariant[] };

/**
 * Depth is special: single/double-desk sell the same depth as two separate
 * product lines (plain vs. multi-tap-holder "computer" type). Whichever
 * line(s) actually cover the requested depth get recommended together,
 * since their resolved size is identical wherever their ranges overlap.
 */
export function resolveDepth(config: ProductFitConfig, desiredRaw: number): DepthResolution | null {
  if (!config.depth) return null;
  const { variants, bridge, redirectAtOrAbove } = config.depth;

  if (redirectAtOrAbove && desiredRaw >= redirectAtOrAbove.threshold) {
    return { status: "redirect", toProduct: redirectAtOrAbove.toProduct, message: redirectAtOrAbove.message };
  }

  const overallMin = Math.min(...variants.flatMap((v) => v.bases));
  const overallMax = Math.max(...variants.map((v) => v.hardMax));
  if (desiredRaw < overallMin) {
    return { status: "infeasible", reason: `최소 ${overallMin}mm부터 제작 가능합니다.` };
  }
  if (desiredRaw > overallMax) {
    return { status: "infeasible", reason: `최대 ${overallMax}mm까지 제작 가능합니다.` };
  }

  const applicable: DepthVariant[] = [];
  let sharedResult: DimensionResult | null = null;
  for (const variant of variants) {
    const variantMin = Math.min(...variant.bases);
    if (desiredRaw < variantMin) continue;
    const result = resolveDepthForVariant(variant, bridge, desiredRaw);
    if (!result || result.status === "infeasible") continue;
    applicable.push(variant);
    if (!sharedResult) sharedResult = result;
  }

  if (!sharedResult || applicable.length === 0) {
    return { status: "infeasible", reason: `최소 ${overallMin}mm ~ 최대 ${overallMax}mm 사이에서 제작 가능합니다.` };
  }
  return { status: "ok", result: sharedResult, applicableVariants: applicable };
}

// ---------------------------------------------------------------------------

export type FitCheckInput = {
  product: ProductSlug;
  width: number;
  depth: number;
  height: number;
};

export type ResolvedDimension = {
  /** Main line: "기본사양", or the size to select e.g. "500mm 선택". Absent for width when only an add-on applies (the base is already in the product name). */
  specLine?: string;
  /** Second line, only present when an extra option needs adding on top, e.g. "옵션추가 +50mm". */
  optionLine?: string;
  /** Final buildable size in mm after rounding/clamping. */
  resolvedValue: number;
  needsInquiry: boolean;
};

export type MatchedProduct = { name: string; variantKey: string; displayLabel: string; buyUrl: string };

export type FitCheckOutcome =
  | { kind: "inquiry-only" }
  | { kind: "redirect"; toProduct: ProductSlug; toProductLabel: string; message: string }
  | { kind: "infeasible"; reason: string }
  | {
      kind: "feasible";
      products: MatchedProduct[];
      width: ResolvedDimension;
      depth: ResolvedDimension;
      height: ResolvedDimension;
      anyInquiry: boolean;
    };

type SpecDisplay = { specLine?: string; optionLine?: string };

/**
 * Width IS normally the product's identity — every named width counts as
 * "기본사양" regardless of which size it is, since there's no smaller
 * "default" width to upgrade from. When a bridged/stepped addition is
 * needed on top, that add-on is shown as its own second line.
 *
 * The one exception is a product whose name doesn't carry the width (e.g.
 * home-bar-table, where the same name covers every size) — there the width
 * pill has to state the size explicitly instead, same as depth's wording.
 */
function formatWidthSpec(result: DimensionResult, stateValue: boolean): SpecDisplay {
  if (result.status === "infeasible" || result.status === "redirect") return { specLine: "-" };
  if (result.option == null) {
    return stateValue ? { specLine: `${result.base}mm 선택` } : { specLine: "기본사양" };
  }
  const base = stateValue ? { specLine: `${result.base}mm 선택` } : { specLine: "기본사양" };
  return { ...base, optionLine: `옵션추가 +${result.option}mm` };
}

/**
 * Depth is a true add-on dimension that isn't spelled out in the product
 * name, so its base always needs stating explicitly: only the smallest
 * depth a product line offers ships as-is ("기본사양"); any larger base is
 * a deliberate pick ("OOOmm 선택"); and if reaching the desired size needs
 * the bridge/step option on top of that base, the add-on gets its own line
 * (kept relative to the base, not the already-stated final total).
 */
function formatDepthSpec(result: DimensionResult, smallestBase: number): SpecDisplay {
  if (result.status === "infeasible" || result.status === "redirect") return { specLine: "-" };
  if (result.option == null) {
    if (result.base === smallestBase) return { specLine: "기본사양" };
    return { specLine: `${result.base}mm 선택` };
  }
  return { specLine: `${result.base}mm 선택`, optionLine: `옵션추가 +${result.option}mm` };
}

function formatHeightSpec(result: DimensionResult, defaultHeight: number): SpecDisplay {
  if (result.status === "infeasible" || result.status === "redirect") return { specLine: "-" };
  if (result.resolvedValue === defaultHeight) return { specLine: "기본사양" };
  return { optionLine: `+${result.resolvedValue}mm 옵션추가` };
}

export function checkFit(input: FitCheckInput): FitCheckOutcome {
  const config = productFitConfigs[input.product];
  if (config.inquiryOnly) return { kind: "inquiry-only" };

  const widthResult = resolveWidth(config, input.width);
  if (!widthResult || widthResult.status === "infeasible" || widthResult.status === "redirect") {
    const detail = widthResult && widthResult.status === "infeasible" ? widthResult.reason : undefined;
    return { kind: "infeasible", reason: `가로 사이즈가 제작 가능 범위를 벗어났습니다.${detail ? ` (${detail})` : ""}` };
  }

  const depthResolution = resolveDepth(config, input.depth);
  if (!depthResolution || depthResolution.status === "infeasible") {
    const detail = depthResolution?.status === "infeasible" ? depthResolution.reason : undefined;
    return { kind: "infeasible", reason: `세로 사이즈가 제작 가능 범위를 벗어났습니다.${detail ? ` (${detail})` : ""}` };
  }
  if (depthResolution.status === "redirect") {
    return {
      kind: "redirect",
      toProduct: depthResolution.toProduct,
      toProductLabel: productFitConfigs[depthResolution.toProduct].label,
      message: depthResolution.message,
    };
  }

  if (!config.height) {
    return { kind: "infeasible", reason: "높이 정보를 확인할 수 없습니다." };
  }
  const heightResult = resolveHeight(config.height, input.height);
  if (heightResult.status === "infeasible") {
    const detail = heightResult.reason;
    return { kind: "infeasible", reason: `높이가 제작 가능 범위를 벗어났습니다.${detail ? ` (${detail})` : ""}` };
  }
  if (heightResult.status === "redirect") {
    return {
      kind: "redirect",
      toProduct: heightResult.toProduct,
      toProductLabel: productFitConfigs[heightResult.toProduct].label,
      message: heightResult.message,
    };
  }

  const depthResult = depthResolution.result;
  const products: MatchedProduct[] = depthResolution.applicableVariants.map((variant) => {
    const widthPart = config.hideWidthInName ? null : String(widthResult.base);
    const parts = [config.namePrefix, variant.label, widthPart, variant.nameSuffix].filter(Boolean);
    return {
      name: parts.join(" "),
      variantKey: variant.key,
      displayLabel: variant.displayLabel,
      buyUrl: resolveNaverProductUrl(config.slug, variant.key, widthResult.base),
    };
  });

  // "rounded-up" only ever occurs for the fixed-option (double-desk) width
  // rule — continuous widths always land exactly on a 10mm option.
  const widthNeedsInquiry = widthResult.status === "rounded-up";
  const depthNeedsInquiry = depthResult.status === "rounded-up";
  const heightNeedsInquiry = heightResult.status === "rounded-up";

  const smallestDepth = config.depth ? Math.min(...config.depth.variants.flatMap((v) => v.bases)) : 0;

  return {
    kind: "feasible",
    products,
    width: {
      ...formatWidthSpec(widthResult, !!config.hideWidthInName),
      resolvedValue: widthResult.resolvedValue,
      needsInquiry: !!widthNeedsInquiry,
    },
    depth: {
      ...formatDepthSpec(depthResult, smallestDepth),
      resolvedValue: depthResult.status === "infeasible" || depthResult.status === "redirect" ? input.depth : depthResult.resolvedValue,
      needsInquiry: depthNeedsInquiry,
    },
    height: {
      ...formatHeightSpec(heightResult, config.height.defaultHeight),
      resolvedValue: heightResult.resolvedValue,
      needsInquiry: heightNeedsInquiry,
    },
    anyInquiry: !!widthNeedsInquiry || depthNeedsInquiry || heightNeedsInquiry,
  };
}

export type ProductMatch = {
  product: ProductSlug;
  productLabel: string;
  /** Small eyebrow label shown above the product name, e.g. "일자형책상" or "컴퓨터책상". */
  displayLabel: string;
  /** Singular resolved SKU name, e.g. "1인용 컴퓨터책상 1200" — each matching type gets its own card. */
  productName: string;
  /** "general" | "computer" | "default" — identifies which product photo(s) to show. */
  variantKey: string;
  /** Naver product-page link for this exact size/variant, falling back to the general storefront when no specific listing exists. */
  buyUrl: string;
  width: ResolvedDimension;
  depth: ResolvedDimension;
  height: ResolvedDimension;
  anyInquiry: boolean;
};

/**
 * Checks the given size against every real (non-inquiry-only) product line
 * and returns the ones it actually fits — used by the size-first flow where
 * the customer doesn't pick a product up front, only a size. A product that
 * would otherwise redirect (e.g. a side-table depth better suited to a
 * single-desk) is simply left out here rather than surfaced as a redirect,
 * since the target product gets checked directly in the same sweep anyway.
 * When a product resolves to more than one type (plain vs. multi-tap-holder
 * "computer" desk), each type becomes its own separate match/card rather
 * than being merged into one "A 또는 B" line.
 */
export function checkAllProducts(width: number, depth: number, height: number): ProductMatch[] {
  const matches: ProductMatch[] = [];
  for (const slug of Object.keys(productFitConfigs) as ProductSlug[]) {
    const config = productFitConfigs[slug];
    if (config.inquiryOnly) continue;
    const outcome = checkFit({ product: slug, width, depth, height });
    if (outcome.kind === "feasible") {
      for (const matchedProduct of outcome.products) {
        matches.push({
          product: slug,
          productLabel: config.label,
          displayLabel: matchedProduct.displayLabel,
          productName: matchedProduct.name,
          variantKey: matchedProduct.variantKey,
          buyUrl: matchedProduct.buyUrl,
          width: outcome.width,
          depth: outcome.depth,
          height: outcome.height,
          anyInquiry: outcome.anyInquiry,
        });
      }
    }
  }
  return matches;
}

export type DimensionBounds = { min: number; max: number };

/**
 * The widest range any single product could possibly accept for each
 * dimension — used purely for quick client-side input validation (flagging
 * "that field is out of range" before running the full per-product check),
 * not as a feasibility guarantee by itself.
 */
export function getGlobalBounds(): { width: DimensionBounds; depth: DimensionBounds; height: DimensionBounds } {
  let widthMin = Infinity;
  let widthMax = -Infinity;
  let depthMin = Infinity;
  let depthMax = -Infinity;
  let heightMin = Infinity;
  let heightMax = -Infinity;

  for (const slug of Object.keys(productFitConfigs) as ProductSlug[]) {
    const config = productFitConfigs[slug];
    if (config.width) {
      widthMin = Math.min(widthMin, Math.min(...config.width.bases));
      widthMax = Math.max(widthMax, Math.max(...config.width.bases));
    }
    if (config.depth) {
      for (const variant of config.depth.variants) {
        depthMin = Math.min(depthMin, Math.min(...variant.bases));
        depthMax = Math.max(depthMax, variant.hardMax);
      }
    }
    if (config.height) {
      heightMin = Math.min(heightMin, config.height.min);
      const effectiveMax = config.height.deadZoneCeiling
        ? config.height.deadZoneCeiling - 10
        : config.height.max;
      heightMax = Math.max(heightMax, effectiveMax);
    }
  }

  return {
    width: { min: widthMin, max: widthMax },
    depth: { min: depthMin, max: depthMax },
    height: { min: heightMin, max: heightMax },
  };
}

type CoverageRange = { genericLabel: string; min: number; max: number };

/** Short category name for gap messages, e.g. "2인용 제품" instead of the full "2인용 책상". */
function genericLabelFor(config: ProductFitConfig): string {
  return config.namePrefix ? `${config.namePrefix} 제품` : config.label;
}

function getWidthCoverage(): CoverageRange[] {
  const list: CoverageRange[] = [];
  for (const slug of Object.keys(productFitConfigs) as ProductSlug[]) {
    const config = productFitConfigs[slug];
    if (!config.width) continue;
    list.push({
      genericLabel: genericLabelFor(config),
      min: Math.min(...config.width.bases),
      max: Math.max(...config.width.bases),
    });
  }
  return list;
}

function getDepthCoverage(): CoverageRange[] {
  const list: CoverageRange[] = [];
  for (const slug of Object.keys(productFitConfigs) as ProductSlug[]) {
    const config = productFitConfigs[slug];
    if (!config.depth) continue;
    for (const variant of config.depth.variants) {
      list.push({ genericLabel: genericLabelFor(config), min: Math.min(...variant.bases), max: variant.hardMax });
    }
  }
  return list;
}

function getHeightCoverage(): CoverageRange[] {
  const list: CoverageRange[] = [];
  for (const slug of Object.keys(productFitConfigs) as ProductSlug[]) {
    const config = productFitConfigs[slug];
    if (!config.height) continue;
    const effectiveMax = config.height.deadZoneCeiling ? config.height.deadZoneCeiling - 10 : config.height.max;
    list.push({ genericLabel: genericLabelFor(config), min: config.height.min, max: effectiveMax });
  }
  return list;
}

/**
 * When a value falls between two products' ranges (e.g. a width larger than
 * every single-desk-family product's max but smaller than the double-desk's
 * min), explain the gap in plain terms instead of a generic "out of range."
 * Returns undefined when the value is covered by at least one product, or
 * when it can't be pinned to a specific gap (a genuine multi-dimension
 * combination mismatch, which the caller should explain more generally).
 */
function describeGap(value: number, coverage: CoverageRange[], dimensionLabel: string): string | undefined {
  if (coverage.some((c) => value >= c.min && value <= c.max)) return undefined;

  const below = coverage.filter((c) => c.max < value);
  const above = coverage.filter((c) => c.min > value);

  const belowMax = below.length > 0 ? Math.max(...below.map((c) => c.max)) : undefined;
  const aboveMin = above.length > 0 ? Math.min(...above.map((c) => c.min)) : undefined;
  const aboveLabels =
    aboveMin != null ? [...new Set(above.filter((c) => c.min === aboveMin).map((c) => c.genericLabel))] : [];

  if (belowMax != null && aboveLabels.length > 0) {
    return `${dimensionLabel} ${belowMax}mm까지 제작 가능하며, ${aboveMin}mm부터는 ${aboveLabels.join(", ")}으로 제작됩니다.`;
  }
  if (belowMax != null) {
    return `${dimensionLabel} ${belowMax}mm까지 제작 가능합니다.`;
  }
  if (aboveMin != null) {
    return `${dimensionLabel} ${aboveMin}mm부터 제작 가능합니다.`;
  }
  return undefined;
}

export type NoMatchDiagnosis = { width?: string; depth?: string; height?: string };

/**
 * Called only after `checkAllProducts` comes back empty for an
 * already-in-global-range size, to figure out whether one specific
 * dimension is the reason (a gap between products) so the UI can point at
 * that field alone instead of asking the customer to re-check everything.
 */
export function diagnoseNoMatch(width: number, depth: number, height: number): NoMatchDiagnosis {
  return {
    width: describeGap(width, getWidthCoverage(), "가로"),
    depth: describeGap(depth, getDepthCoverage(), "세로"),
    height: describeGap(height, getHeightCoverage(), "높이"),
  };
}
