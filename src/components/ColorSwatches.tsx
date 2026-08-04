import type { CSSProperties } from "react";

// Frame colors are flat, solid finishes — rendered as plain color chips
// rather than photos. The available frame photos are whole-product shots
// (a full desk frame on a white background), so cropping them down to a
// small swatch tile only ever shows a sliver of thin metal line against
// mostly-white background, which reads as scattered noise/dots at small
// sizes instead of a clean color reference.
export const frameSwatches = [
  { label: "화이트 (반광)", color: "#f5f5f3" },
  { label: "블랙 (무광)", color: "#1a1a1a" },
];

export const topSwatches = [
  // Same flat white/black as the frame swatches above — one consistent
  // color reference for a customer picking a white or black finish,
  // instead of two slightly different-looking "whites"/"blacks" depending
  // on which part of the desk they're looking at.
  { label: "화이트", color: "#f5f5f3" },
  { label: "블랙", color: "#1a1a1a" },
  { label: "그레이", src: "/board_gra.jpg" },
  { label: "나무무늬(마인파인츠)", src: "/board_woo.jpg" },
  { label: "멀바우", src: "/board_mul.jpg" },
];

type Swatch = { label: string; src?: string; color?: string };

// The tabletop photos are all shot as a diagonal desk-corner perspective
// (tabletop + a bit of leg + floor) — a plain `object-fit: cover` still
// squeezes that whole diagonal composition into the tile, which at a small
// size reads as busy/broken rather than a clean material reference. Zooming
// the background image in on a purely flat patch of the tabletop (away from
// the front bevel edge, the leg, and the floor) crops out the geometry and
// leaves just the material's actual color/texture — every source photo
// shares the same framing, so one shared zoom works across all of them.
const SWATCH_PHOTO_ZOOM: CSSProperties = {
  backgroundSize: "280%",
  backgroundPosition: "72% 18%",
};

function SwatchTile({ swatch, className }: { swatch: Swatch; className: string }) {
  if (swatch.color) {
    return (
      <div
        className={className}
        style={{ backgroundColor: swatch.color }}
        role="img"
        aria-label={swatch.label}
        title={swatch.label}
      />
    );
  }
  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${swatch.src})`, ...SWATCH_PHOTO_ZOOM }}
      role="img"
      aria-label={swatch.label}
      title={swatch.label}
    />
  );
}

/** Full-size swatch grid — product detail pages, where color is the actual
 *  subject of the section. Use `compact` inside recommendation/result cards
 *  (custom-fit matches, chat cards) so the swatches read as a secondary
 *  detail, not the visual focal point of the card. */
export function ColorSwatchGroup({
  title,
  swatches,
  compact,
}: {
  title: string;
  swatches: Swatch[];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex-1">
        <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">{title}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {swatches.map((s) => (
            <SwatchTile key={s.label} swatch={s} className="h-11 w-14 rounded-md border border-[var(--color-border)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="text-base font-semibold text-[var(--color-primary)]">{title}</p>
      {/* auto-fit + minmax instead of a fixed column count — a 2-swatch
          group (frame) and a 5-swatch group (top) both get consistently
          sized tiles this way (~120px+ each, growing to fill leftover
          space), instead of a fixed grid-cols making a small group's tiles
          shrink to match an unrelated larger group's column count. */}
      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        {swatches.map((s) => (
          <div key={s.label} className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)]" style={{ aspectRatio: "4 / 3" }}>
              <SwatchTile swatch={s} className="h-full w-full" />
            </div>
            <span className="text-sm leading-5 text-[var(--color-muted-foreground)]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact two-row version — chat recommendation cards and other tight
 *  spaces. Frame and top are kept as two separately-labeled rows (not
 *  merged into one) so a customer can tell which swatch belongs to which
 *  part, at a size that's actually visible without dominating the card.
 *  `showTop` defaults to true; the frame product card passes false since a
 *  frame-only purchase has no tabletop to color. */
export function ColorDotsRow({ className, showTop = true }: { className?: string; showTop?: boolean }) {
  return (
    <div className={className}>
      <ColorSwatchGroup title="프레임 색상" swatches={frameSwatches} compact />
      {showTop && (
        <div className="mt-2.5">
          <ColorSwatchGroup title="상판 색상·마감" swatches={topSwatches} compact />
        </div>
      )}
    </div>
  );
}
