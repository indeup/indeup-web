import type { ReactNode } from "react";
import Image from "next/image";
import {
  legalName,
  representativeName,
  supportPhone,
  supportPhoneDisplay,
  supportEmail,
  businessAddress,
  businessRegistrationNumber,
  mailOrderSalesNumber,
  naverStoreUrl,
  naverBlogUrl,
  tistoryUrl,
  youtubeUrl,
  instagramUrl,
} from "@/lib/brand";

function LegalRow({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {items.map((item, i) => (
        <span key={i} className="whitespace-nowrap">
          {item}
          {i < items.length - 1 && (
            <span className="ml-2 text-[var(--color-muted-foreground)]/50">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-white text-[var(--color-primary)]">
      {/* SizeCta (rendered by every page just above Footer) already closes
          with the same "found your size? ask us" nudge — this block used to
          repeat it almost verbatim, stacking two near-identical CTAs right
          on top of each other on every single page. Removed; Footer now
          starts straight into the utility content. */}
      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image
              src="/INDEUP_LOGO.svg"
              alt="인디업 INDEUP"
              width={98}
              height={35}
            />
            <p className="mt-5 text-sm leading-6 text-[var(--color-muted-foreground)]">
              오래 앉아 일하는 사람을 위해,
              <br />
              책상을 만듭니다.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 네이버 블로그"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h9L20 7.5V19a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                  <path d="M8 12h8M8 15.5h5" />
                </svg>
              </a>
              <a
                href={tistoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 티스토리"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 6h14" />
                  <path d="M12 6v13" />
                </svg>
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 유튜브"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                  <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인디업 인스타그램"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
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
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
              Menu
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm">
              <a href="/brand/" className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                브랜드
              </a>
              <a href="/products/" className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                제품
              </a>
              <a href="/custom-fit/" className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                맞춤 제작
              </a>
              <a href="/guide/" className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                책상 가이드
              </a>
              <a href="/support/" className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                고객지원
              </a>
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
              >
                공식 스토어
              </a>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
              Contact
            </p>
            <a
              href={`tel:${supportPhone.replace(/-/g, "")}`}
              className="mt-4 flex cursor-pointer items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-primary)] transition-opacity hover:opacity-70"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C10.5 19.5 4.5 13.5 4.5 6a2 2 0 0 1 2-2z" />
              </svg>
              {supportPhone}
            </a>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-primary)]"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {supportEmail}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-5 text-[11px] leading-6 text-[var(--color-muted-foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:text-xs">
          <div className="space-y-1">
            <LegalRow
              items={[
                legalName,
                <>
                  인디업 INDEUP<sup className="ml-0.5">&reg;</sup>
                </>,
                supportPhoneDisplay,
              ]}
            />
            <LegalRow
              items={[
                `대표 ${representativeName}`,
                `주소 ${businessAddress.addressRegion} ${businessAddress.addressLocality} ${businessAddress.streetAddress}`,
                <>&copy; {new Date().getFullYear()} INDEUP</>,
              ]}
            />
            <LegalRow
              items={[
                `사업자등록번호 ${businessRegistrationNumber}`,
                `통신판매업신고번호 ${mailOrderSalesNumber}`,
                "호스팅 제공자 카페24(주)",
              ]}
            />
          </div>
          <div className="flex shrink-0 gap-4">
            <a href="/terms/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
              이용약관
            </a>
            <a href="/privacy/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
