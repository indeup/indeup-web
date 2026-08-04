import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import ProductsHero from "@/components/ProductsHero";
import { products, leadTime } from "@/lib/products";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";

const siteUrl = "https://indeup.com";
const pageTitle = "인디업 제품 소개 | 공간에 맞는 맞춤 책상 8종";
const pageDescription =
  "인디업(INDEUP)은 1인용 책상, 1인용 컴퓨터책상, 2인용 책상, 2인용 컴퓨터책상, 좌식 책상, 사이드테이블, 홈바테이블, 프레임까지 여덟 가지 제품을 제작합니다. 공간과 사용 방식에 맞춰 10mm 단위로 맞춤 제작하며, 실제 구매는 네이버 공식 브랜드스토어에서 진행됩니다.";

// Cross-product questions (product-specific FAQs already live per-product
// on each /products/[slug]/ page via product.faqs) — these answer the
// "which one do I pick" question this listing page itself raises.
const faqs = [
  {
    q: "1인용 책상과 1인용 컴퓨터책상은 뭐가 다른가요?",
    a: "일반 사양은 깊이 500·600·700mm 중에서 선택하고, 컴퓨터책상 사양은 PC 본체 거치를 고려해 깊이 300mm부터 제작하며 멀티탭거치대가 기본 포함됩니다. 나머지 구조와 마감은 동일합니다.",
  },
  {
    q: "좌식책상과 사이드테이블은 뭐가 다른가요?",
    a: "좌식책상은 바닥 생활에 맞춘 낮은 기본 높이로 제작되고, 사이드테이블은 소파나 침대 옆 틈새 공간에 맞춘 작은 사이즈입니다. 용도와 배치 공간이 다릅니다.",
  },
  {
    q: "제작 기간은 얼마나 걸리나요?",
    a: leadTime,
  },
  {
    q: "실제 구매는 어디서 하나요?",
    a: "인디업 공식 네이버 브랜드스토어에서 구매할 수 있습니다. 각 제품 페이지의 '네이버 스토어에서 구매하기' 버튼으로 바로 이동합니다.",
  },
  {
    q: "내 공간에 맞는 사이즈를 모르겠어요.",
    a: "책상 가이드 페이지의 '내 공간 책상 사이즈 계산기' 또는 맞춤 제작 페이지에서 공간 정보를 입력하면 제작 가능한 사이즈를 확인할 수 있습니다.",
  },
];

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/products/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/products/",
    images: [
      {
        url: "/indeup_series.jpg",
        width: 1500,
        height: 1125,
        alt: "인디업 책상 8종 라인업",
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

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] ${
        dark ? "text-white/50" : "text-[var(--color-muted-foreground)]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
      {children}
    </p>
  );
}

function ArrowLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

export default function ProductsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "제품", item: `${siteUrl}/products/` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/products/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${siteUrl}/products/${p.slug}/`,
    })),
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
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(faqJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-3 sm:px-12">
          <ol className="mx-auto flex max-w-[1600px] items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              제품
            </li>
          </ol>
        </nav>

        {/* Hero — dark, jump.gif-backed opening statement that stages in
            (badge, then headline, then subtitle, then trust chips) as the
            user scrolls, instead of showing everything at once. */}
        <ProductsHero />

        {/* Intro text — real crawlable copy for search engines and AI answers,
            laid out as the same split-editorial (label left / copy right)
            pattern used throughout /brand/, instead of floating as an
            isolated centered block. */}
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:gap-16">
              <div>
                <Eyebrow>Overview</Eyebrow>
                <h2 className="mt-4 font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                  공간마다
                  <br />
                  다른 책상.
                </h2>
              </div>
              <TextReveal
                text="인디업(INDEUP)은 사용하는 사람과 공간에 맞춰 책상을 직접 제작합니다. 1인용 책상은 원룸과 홈오피스에, 2인용 책상은 부부와 커플이 함께 쓰는 자리에 어울립니다. 컴퓨터·모니터·주변기기를 두고 쓴다면 멀티탭거치대가 기본 포함된 1인용·2인용 컴퓨터책상을 선택할 수 있습니다. 좌식 책상은 바닥 생활에 맞춘 낮은 높이로, 사이드테이블은 소파나 침대 옆 틈새 공간에 맞게 제작합니다. 모든 제품은 가로와 높이를 10mm 단위로 조정하는 맞춤 제작 방식으로 만듭니다."
                highlight="인디업(INDEUP)은"
                className="text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg"
              />
            </div>
          </Reveal>
        </section>

        {/* Product list — clean white image-grid, referencing WAYBLE's WORK listing page */}
        <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-white px-6 py-16 text-[var(--color-primary)] sm:px-12 sm:py-24">
          <Reveal className="relative mx-auto max-w-[1600px]">
            <div className="mb-10 flex flex-col gap-3 sm:mb-14">
              <Eyebrow>Products</Eyebrow>
              <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                인디업 제품 라인업
              </h2>
              <p className="max-w-xl text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
                원하는 제품을 선택하면 상세 정보와 제작 가능 사이즈를 확인할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.slug}>
                  <a
                    href={`/products/${p.slug}/`}
                    className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                        grid thumbnail photo, not a next/image layout fit. */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  </a>
                  <div className="mt-4">
                    <a
                      href={`/products/${p.slug}/`}
                      className="cursor-pointer text-lg font-semibold tracking-[-0.01em] text-[var(--color-primary)] transition-colors duration-200 hover:text-[var(--color-primary)] sm:text-xl"
                    >
                      {p.title}
                    </a>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted-foreground)] sm:text-base">{p.listSummary}</p>
                    <a
                      href={p.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-3 inline-flex cursor-pointer items-center gap-1.5 border-b border-[var(--color-border)] pb-0.5 text-xs font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      네이버 스토어에서 구매하기
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-200 group-hover/link:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-16">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">제품 관련 자주 묻는 질문</h2>
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-[var(--color-border)] px-5 py-4 open:border-[var(--color-primary)]/30 sm:px-6 sm:py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                    <h3 className="text-sm font-semibold tracking-[-0.01em] sm:text-base">{f.q}</h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-light text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-primary)]"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Brand tie-in */}
        <section className="px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto flex max-w-[1600px] flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Our Process</Eyebrow>
              <h2 className="mt-4 font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                제품을 만드는 방식이
                <br />
                궁금하다면
              </h2>
              <p className="mt-3 text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
                상담부터 제작, 도장, 검수까지 인디업이 직접 관리하는 과정을 소개합니다.
              </p>
            </div>
            <ArrowLink href="/brand/">브랜드 소개 보기</ArrowLink>
          </Reveal>
        </section>

      </main>

      {/* SizeCta closes every page with the same nudge — this page no
          longer duplicates it with its own bespoke final CTA. */}
      <SizeCta />
      <Footer />
    </div>
  );
}
