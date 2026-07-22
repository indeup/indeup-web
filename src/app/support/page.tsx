import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { naverStoreUrl } from "@/lib/products";

const siteUrl = "https://indeup.com";
const naverTalkUrl = "https://talk.naver.com/profile/wcs0s3";
const pageTitle = "고객지원 | 인디업";
const pageDescription =
  "주문·배송 확인, 디지털 보증서, 파손·누락·A/S 문의까지 인디업 고객지원 안내입니다. 네이버 톡톡과 네이버 쇼핑 주문내역을 통해 빠르게 안내받을 수 있습니다.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/support/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/support/",
    images: [
      {
        url: "/indeup_series.jpg",
        width: 1500,
        height: 1125,
        alt: "인디업 고객지원",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/indeup_series.jpg"],
  },
};

const faqs = [
  {
    q: "주문한 제품은 언제 출고되나요?",
    a: "주문 내용 확인 후 제작에 들어가며, 일반적으로 7~8영업일이 필요합니다. 주말과 공휴일은 제작 기간에서 제외되고, 주문량과 제품 사양에 따라 일정이 달라질 수 있습니다.",
  },
  {
    q: "여러 박스가 따로 도착할 수 있나요?",
    a: "상판과 프레임 등 부피가 큰 구성품이 나뉘어 개별 박스로 배송될 수 있습니다. 박스가 순차적으로 도착하더라도 정상 배송인 경우가 많으니 박스에 표기된 주문정보를 확인해 주시고, 도착 간격이 많이 벌어져 걱정되시면 네이버 톡톡으로 문의해 주세요.",
  },
  {
    q: "배송 중 파손되면 어떻게 하나요?",
    a: "포장 박스와 제품 파손 부위를 사진으로 남겨주신 뒤, 주문자명 또는 주문번호와 함께 네이버 톡톡으로 보내주세요. 사진은 빠른 확인을 위한 절차일 뿐, 파손이 확인되면 예외 없이 무료로 교환해 드립니다.",
  },
  {
    q: "부품이 누락되었어요.",
    a: "빠진 부품 내역과 함께 받으신 부품 전체 사진을 네이버 톡톡으로 보내주시면 확인 후 무료로 보내드립니다.",
  },
  {
    q: "디지털 보증서는 언제 발급되나요?",
    a: "구매가 완료되면 네이버 N컬렉션 디지털 보증서가 자동으로 발급되며, 네이버 앱 알림으로 안내됩니다. 별도의 회원가입이나 종이 보증서 등록은 필요하지 않습니다.",
  },
  {
    q: "교환·반품은 어디에서 신청하나요?",
    a: "네이버 앱 → 쇼핑 MY → 주문·배송에서 해당 주문을 선택하면 교환·반품을 신청할 수 있습니다.",
  },
  {
    q: "A/S는 어떻게 접수하나요?",
    a: "인디업 책상은 3년 무상보증을 제공합니다. 주문자명 또는 주문번호와 문제가 발생한 부분의 사진을 준비해 네이버 톡톡으로 문의해 주시면 확인 후 안내해 드립니다.",
  },
];

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[var(--color-brand-light)]">
      {children}
    </span>
  );
}

function IconPackage() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 7.5 12 3 3 7.5l9 4.5 9-4.5Z" />
      <path d="M3 7.5v9L12 21l9-4.5v-9" />
      <path d="M12 12v9" />
    </svg>
  );
}

function IconShieldCheck() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 5 6v5.5C5 16 8 19.5 12 21c4-1.5 7-5 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconTool() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2.4-2.4 2.2-2.8Z" />
    </svg>
  );
}

function TalkTalkIcon() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-[3px]">
      <Image
        src="/naver_talktalk.jpg"
        alt=""
        aria-hidden="true"
        width={22}
        height={22}
        className="h-full w-full rounded-full"
      />
    </span>
  );
}

function IntentCard({
  number,
  title,
  description,
  href,
  external,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex h-full cursor-pointer flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-brand-light)]/40 hover:bg-white/[0.07] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] sm:p-7"
    >
      <div>
        <span className="text-xs font-semibold tracking-[0.15em] text-[var(--color-brand-light)]">{number}</span>
        <h3 className="mt-2 text-lg font-bold tracking-[-0.01em] text-white sm:text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/50 sm:text-base">{description}</p>
      </div>
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center self-end rounded-full border border-white/20 text-white transition-all duration-200 group-hover:translate-x-1 group-hover:border-[var(--color-brand-light)]/60 group-hover:text-[var(--color-brand-light)]"
      >
        &rarr;
      </span>
    </a>
  );
}

function ChecklistItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-6 text-white/70 sm:text-base">
      <span
        aria-hidden="true"
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-light)]"
      />
      {children}
    </li>
  );
}

export default function SupportPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "고객지원", item: `${siteUrl}/support/` },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/support/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-1 flex-col bg-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="flex-1 text-white">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-white/10 px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-white/40">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-white">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/80">
              고객지원
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="grain relative overflow-hidden px-6 pb-10 pt-10 sm:px-12 sm:pt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[var(--color-brand)]/[0.14] blur-[130px]"
          />
          <Reveal className="relative mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-light)]" aria-hidden="true" />
              Support
            </p>
            <h1 className="mt-3 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              고객지원
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              제품 상담부터 배송 후 문제까지
              <br />
              네이버를 통해 편리하게 안내받을 수 있습니다.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={naverTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-white px-6 text-base font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                <TalkTalkIcon />
                네이버 톡톡 상담하기
              </a>
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-base font-medium text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                인디업 공식 스마트스토어
              </a>
            </div>
          </Reveal>
        </section>

        {/* 문의 유형 선택 — 무엇으로 왔는지 먼저 고르면 해당 안내로 바로 이동 */}
        <section className="grain relative overflow-hidden border-t border-white/10 px-6 py-14 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-[var(--color-brand)]/10 blur-[120px]"
          />
          <div className="relative mx-auto max-w-6xl">
            <Reveal>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-light)]" aria-hidden="true" />
                Step 01
              </p>
              <h2 className="mt-3 max-w-xl font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                어떤 문의로 방문해주셨나요?
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Reveal className="h-full" delay={0}>
                <IntentCard
                  number="01"
                  title="주문·배송 확인"
                  description="주문 상태와 배송 정보, 교환·반품 방법을 확인해보세요."
                  href="#order-shipping"
                />
              </Reveal>
              <Reveal className="h-full" delay={80}>
                <IntentCard
                  number="02"
                  title="디지털 보증서"
                  description="구매 시 발급되는 N컬렉션 디지털 보증서를 안내해드립니다."
                  href="#digital-warranty"
                />
              </Reveal>
              <Reveal className="h-full" delay={160}>
                <IntentCard
                  number="03"
                  title="파손·누락·A/S 문의"
                  description="제품 파손, 부품 누락, A/S 접수에 필요한 정보를 확인해보세요."
                  href="#damage-as"
                />
              </Reveal>
              <Reveal className="h-full" delay={240}>
                <IntentCard
                  number="04"
                  title="기타 문의"
                  description="위 항목에 없는 내용은 네이버 톡톡으로 바로 문의해주세요."
                  href={naverTalkUrl}
                  external
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 주문·배송 확인 + 디지털 보증서 — 짧고 상호보완적인 두 안내를 나란히 배치 */}
        <section className="grain relative overflow-hidden border-t border-white/10 px-6 py-14 sm:px-12 sm:py-16">
          <Reveal className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              id="order-shipping"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-200 hover:border-[var(--color-brand-light)]/30 hover:bg-white/[0.06] sm:p-8"
            >
              <div className="flex items-center gap-3">
                <IconBadge>
                  <IconPackage />
                </IconBadge>
                <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">주문·배송 확인</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                주문 상태와 배송 정보는 네이버 쇼핑 주문내역에서 확인해 주세요.
              </p>
              <p className="mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white sm:text-base">
                네이버 앱
                <span aria-hidden="true" className="text-white/40">
                  &rarr;
                </span>
                쇼핑 MY
                <span aria-hidden="true" className="text-white/40">
                  &rarr;
                </span>
                주문·배송
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                교환·반품 신청도 해당 주문내역에서 진행할 수 있습니다.
              </p>
            </div>

            <div
              id="digital-warranty"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-200 hover:border-[var(--color-brand-light)]/30 hover:bg-white/[0.06] sm:p-8"
            >
              <div className="flex items-center gap-3">
                <IconBadge>
                  <IconShieldCheck />
                </IconBadge>
                <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">디지털 보증서</h2>
              </div>
              <div className="mt-4 flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white p-1.5">
                  <Image
                    src="/genuine_guaranteed.png"
                    alt="네이버 N컬렉션 디지털 보증서 - Genuine Guaranteed"
                    width={48}
                    height={48}
                    className="h-full w-full rounded-md object-contain saturate-[0.65] contrast-[0.95]"
                  />
                </span>
                <p className="text-sm leading-7 text-white/70 sm:text-base">
                  구매가 완료되면 네이버 N컬렉션 디지털 보증서가 발급됩니다. 네이버 앱 알림으로 안내되며, 제품 보증 정보를 디지털로 확인할 수 있습니다.
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                별도의 회원가입이나 종이 보증서 등록은 필요하지 않습니다.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 파손·누락·A/S 문의 */}
        <section id="damage-as" className="grain relative scroll-mt-24 overflow-hidden border-t border-white/10 px-6 py-14 sm:px-12 sm:py-16">
          <Reveal className="relative mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <IconBadge>
                <IconTool />
              </IconBadge>
              <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">파손·누락·A/S 문의</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
              제품 파손, 부품 누락 또는 A/S가 필요한 경우 주문정보와 사진을 준비해 네이버 톡톡으로 문의해 주세요.
            </p>

            <div className="mt-5 flex items-start gap-3.5 rounded-2xl border border-[var(--color-brand-light)]/30 bg-[var(--color-brand)]/[0.12] p-5 sm:p-6">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-light)]/20 text-[var(--color-brand-light)]"
              >
                <IconShieldCheck />
              </span>
              <div>
                <p className="text-base font-bold text-white sm:text-lg">확인 후, 무조건 무료교환</p>
                <p className="mt-1.5 text-sm leading-6 text-white/70 sm:text-base">
                  사진은 빠르고 정확한 확인을 위한 절차일 뿐입니다. 파손이나 하자가 확인되면 예외 없이 무료로
                  교환해 드리니 안심하고 문의해 주세요.
                </p>
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-2.5 rounded-2xl border border-white/15 p-5 sm:p-6">
              <ChecklistItem>주문자명 또는 주문번호</ChecklistItem>
              <ChecklistItem>문제가 발생한 부분의 사진</ChecklistItem>
              <ChecklistItem>제품 전체 사진</ChecklistItem>
              <ChecklistItem>배송 파손 시 포장 박스 사진</ChecklistItem>
            </ul>
            <a
              href={naverTalkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-white px-6 text-base font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              <TalkTalkIcon />
              네이버 톡톡으로 문의하기
            </a>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="grain relative overflow-hidden border-t border-white/10 px-6 py-14 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/4 h-[380px] w-[380px] translate-y-1/3 rounded-full bg-[var(--color-brand)]/[0.08] blur-[120px]"
          />
          <Reveal className="relative mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">자주 묻는 질문</h2>
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-white/15 px-5 py-4 transition-colors duration-200 open:border-[var(--color-brand-light)]/40 hover:border-[var(--color-brand-light)]/30 sm:px-6 sm:py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                    <h3 className="text-sm font-semibold tracking-[-0.01em] text-white sm:text-base">{f.q}</h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-light text-white/40 transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-brand-light)]"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
