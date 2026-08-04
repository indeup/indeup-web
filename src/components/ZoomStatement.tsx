import Image from "next/image";
import Reveal from "@/components/Reveal";

const captionLines = [
  ["매일 앉는 자리일수록,", "더 정확해야 합니다."],
  ["공간과 사용 방식에 맞춰", "인디업이 책상의 크기를 다시 정합니다."],
];

/** Brand statement — text + photo side by side in a contained card, matching
 *  the same "white card with inset media" language as DimensionShowcase and
 *  FrameDetail instead of a full-bleed scroll-jacked zoom. */
export default function ZoomStatement() {
  return (
    <section id="brand" className="mx-3 bg-white px-6 py-14 text-[var(--color-primary)] sm:mx-0 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-center sm:gap-12">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
              <span className="text-[var(--color-primary)]">03</span> · Indeup Design Principle
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
              Made in Korea
            </div>
            <h2
              className="mt-6 font-semibold leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: "var(--type-hero)" }}
            >
              당신의 공간이,
              <br />
              기준이 됩니다.
            </h2>
            <div className="mt-8 flex max-w-xl flex-col gap-2">
              {captionLines.map((block) => (
                <p key={block[0]} className="text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
                  {block.join(" ")}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.15)]">
            <Image
              src="/indeup_series.jpg"
              alt="인디업 책상 시리즈"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
