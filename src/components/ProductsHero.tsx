const chips = ["국내 제조·판매", "10mm 맞춤 제작", "3년 무상보증"];

/** Products page hero — full-bleed image, consistent with the home page's
 *  own hero, no scroll-jacked reveal. */
export default function ProductsHero() {
  return (
    <section className="grain relative flex min-h-[70dvh] items-center justify-center overflow-hidden bg-[var(--color-primary)] px-6 py-24 text-center text-white sm:px-12">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed
          full-bleed hero background, not a next/image layout fit. */}
      <img
        src="/jump.gif"
        alt="아연도금 철제 프레임과 풀용접 구조의 인디업 책상"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        style={{ objectPosition: "center 65%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/70 to-[var(--color-primary)]/45" />

      <div className="relative flex flex-col items-center">
        <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Our Collection
        </span>
        <h1
          className="mt-6 max-w-3xl font-semibold leading-[1.15] tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          공간에 맞는
          <br />
          인디업 맞춤책상
        </h1>
        <p className="mt-5 max-w-lg text-base leading-[1.3] font-medium text-white/70 sm:text-lg">
          1인용부터 2인용, 좌식, 사이드테이블과 홈바테이블까지.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {chips.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold tracking-[-0.01em] text-white/80"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
