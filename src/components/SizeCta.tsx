import Reveal from "@/components/Reveal";

/** Shared bottom CTA nudging visitors toward the size-recommendation flow —
 *  rendered on every page, just above the Footer. */
export default function SizeCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-muted)] px-6 py-14 text-center sm:px-12 sm:py-20">
      <Reveal className="relative mx-auto max-w-2xl">
        <h2 className="font-semibold leading-tight tracking-[-0.02em] text-[var(--color-primary)]" style={{ fontSize: "var(--type-h2)" }}>
          내 공간에 맞는 책상 사이즈를 찾으셨나요?
        </h2>
        <p className="mt-4 text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
          인디업은 줄자로 잰 사이즈에 맞춰 10mm 단위로 책상을 제작합니다.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/guide/"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
          >
            내 방에 맞는 책상 추천받기
          </a>
          <a
            href="https://brand.naver.com/indeup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/25 px-6 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]"
          >
            공식 스토어에서 구매하기
          </a>
        </div>
      </Reveal>
    </section>
  );
}
