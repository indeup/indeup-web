import type { ReactNode } from "react";
import Image from "next/image";

function LegalRow({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {items.map((item, i) => (
        <span key={i} className="whitespace-nowrap">
          {item}
          {i < items.length - 1 && (
            <span className="ml-2 text-white/25">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-primary)] text-white">
      {/* Closing statement — echoes the brand voice one more time before
          handing off to the utility links, instead of ending abruptly. */}
      <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">
          지금, 당신의 공간에 맞는
          <br />
          책상을 만나보세요.
        </h2>
        <a
          href="/support/"
          className="mt-5 inline-flex cursor-pointer items-center gap-2 border-b border-white/50 pb-1 text-base font-medium transition-colors duration-200 hover:border-[var(--color-brand-light)] hover:text-[var(--color-brand-light)]"
        >
          문의하기
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image
              src="/INDEUP_LOGO_WHITE.svg"
              alt="인디업 INDEUP"
              width={98}
              height={35}
            />
            <p className="mt-5 text-sm leading-6 text-white/60">
              오래 앉아 일하는 사람을 위해,
              <br />
              책상을 만듭니다.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://blog.naver.com/indeup_official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 네이버 블로그"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors duration-200 hover:border-white/80 hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h9L20 7.5V19a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                  <path d="M8 12h8M8 15.5h5" />
                </svg>
              </a>
              <a
                href="https://indeup.tistory.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 티스토리"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors duration-200 hover:border-white/80 hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 6h14" />
                  <path d="M12 6v13" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@indeup"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 유튜브"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors duration-200 hover:border-white/80 hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                  <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/indeup.kr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 인스타그램"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors duration-200 hover:border-white/80 hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
              Menu
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm">
              <a href="/brand/" className="cursor-pointer text-white/80 transition-colors hover:text-white">
                브랜드
              </a>
              <a href="/products/" className="cursor-pointer text-white/80 transition-colors hover:text-white">
                제품
              </a>
              <a href="/custom-fit/" className="cursor-pointer text-white/80 transition-colors hover:text-white">
                맞춤 제작
              </a>
              <a href="/guide/" className="cursor-pointer text-white/80 transition-colors hover:text-white">
                책상 가이드
              </a>
              <a href="/support/" className="cursor-pointer text-white/80 transition-colors hover:text-white">
                고객지원
              </a>
              <a
                href="https://brand.naver.com/indeup"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-white/80 transition-colors hover:text-white"
              >
                공식 스토어
              </a>
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
              Contact
            </p>
            <a
              href="tel:16685738"
              className="mt-4 flex cursor-pointer items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C10.5 19.5 4.5 13.5 4.5 6a2 2 0 0 1 2-2z" />
              </svg>
              1668-5738
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-[11px] leading-6 text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:text-xs">
          <div className="space-y-1">
            <LegalRow
              items={[
                "스니처",
                <>
                  인디업 INDEUP<sup className="ml-0.5">&reg;</sup>
                </>,
                "고객센터 1668-5738",
              ]}
            />
            <LegalRow
              items={[
                "대표 하민성",
                "주소 경남 김해시 동북로473번길 385-14",
                <>&copy; {new Date().getFullYear()} INDEUP</>,
              ]}
            />
          </div>
          <div className="flex shrink-0 gap-4">
            <a href="/privacy/" className="cursor-pointer transition-colors hover:text-white/70">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
