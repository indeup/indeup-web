import Reveal from "@/components/Reveal";

/** Shared bottom CTA nudging visitors toward the size-recommendation flow —
 *  rendered on every page, just above the Footer. */
export default function SizeCta() {
  return (
    <section className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
      <Reveal className="relative mx-auto max-w-2xl">
        <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
          내 공간에 맞는 책상 사이즈를 찾으셨나요?
        </h2>
        <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
          인디업은 줄자로 잰 사이즈에 맞춰 10mm 단위로 책상을 제작합니다.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/guide/"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:bg-white/85"
          >
            내 방에 맞는 책상 추천받기
          </a>
          <a
            href="https://brand.naver.com/indeup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white hover:text-white"
          >
            공식 스토어에서 구매하기
          </a>
        </div>
      </Reveal>
    </section>
  );
}
