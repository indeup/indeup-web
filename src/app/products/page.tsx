import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import ProductsHero from "@/components/ProductsHero";
import { products, naverStoreUrl } from "@/lib/products";

const siteUrl = "https://indeup.com";
const pageTitle = "인디업 제품 소개 | 공간에 맞는 맞춤 책상 5종";
const pageDescription =
  "인디업(INDEUP)은 1인용 책상, 2인용 책상, 좌식 책상, 사이드테이블, 홈바테이블까지 다섯 가지 책상을 제작합니다. 공간과 사용 방식에 맞춰 10mm 단위로 맞춤 제작하며, 실제 구매는 네이버 공식 브랜드스토어에서 진행됩니다.";

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
        alt: "인디업 책상 5종 라인업",
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
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
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
      className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
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

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-3 sm:px-12">
          <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
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
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:gap-16">
              <div>
                <Eyebrow>Overview</Eyebrow>
                <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                  공간마다
                  <br />
                  다른 책상.
                </h2>
              </div>
              <TextReveal
                text="인디업(INDEUP)은 사용하는 사람과 공간에 맞춰 책상을 직접 제작합니다. 1인용 책상은 원룸과 홈오피스에, 2인용 책상은 부부와 커플이 함께 쓰는 자리에 어울립니다. 좌식 책상은 바닥 생활에 맞춘 낮은 높이로, 사이드테이블은 소파나 침대 옆 틈새 공간에 맞게 제작합니다. 모든 제품은 가로와 높이를 10mm 단위로 조정하는 맞춤 제작 방식으로 만듭니다."
                highlight="인디업(INDEUP)은"
                className="text-base leading-7 text-[var(--color-secondary)] sm:text-lg"
              />
            </div>
          </Reveal>
        </section>

        {/* Product list — dark image-grid, referencing WAYBLE's WORK listing page */}
        <section className="grain relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-primary)] px-6 py-16 text-white sm:px-12 sm:py-24">
          {/* Ambient brand-red glow — ties the near-black backdrop to the
              warm-toned lifestyle photos instead of leaving them looking
              like bright cutouts dropped on flat black. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[var(--color-brand)]/10 blur-[140px]"
          />

          <Reveal className="relative mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3 sm:mb-14">
              <Eyebrow dark>Products</Eyebrow>
              <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                인디업 제품 라인업
              </h2>
              <p className="max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                원하는 제품을 선택하면 상세 정보와 제작 가능 사이즈를 확인할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.slug}>
                  <a
                    href={`/products/${p.slug}/`}
                    className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                        grid thumbnail photo, not a next/image layout fit. */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-[transform,filter] duration-500 ease-out [filter:brightness(0.92)_saturate(0.92)] group-hover:scale-105 group-hover:[filter:brightness(1)_saturate(1)]"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
                  </a>
                  <div className="mt-4">
                    <a
                      href={`/products/${p.slug}/`}
                      className="cursor-pointer text-lg font-bold tracking-[-0.01em] text-white transition-colors duration-200 hover:text-white/75 sm:text-xl"
                    >
                      {p.title}
                    </a>
                    <p className="mt-1.5 text-sm leading-6 text-white/50 sm:text-base">{p.listSummary}</p>
                    <a
                      href={naverStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-3 inline-flex cursor-pointer items-center gap-1.5 border-b border-white/20 pb-0.5 text-xs font-medium text-white/70 transition-colors duration-200 hover:border-white hover:text-white"
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

        {/* Brand tie-in */}
        <section className="px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Our Process</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                제품을 만드는 방식이
                <br />
                궁금하다면
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                상담부터 제작, 도장, 검수까지 인디업이 직접 관리하는 과정을 소개합니다.
              </p>
            </div>
            <ArrowLink href="/brand/">브랜드 소개 보기</ArrowLink>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <Reveal className="relative mx-auto max-w-2xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              공간을 재셨다면,
              <br />
              이제 책상을 맞출 차례입니다.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
              공식 판매처에서 제품 정보와 판매자 정보를 확인한 뒤 구매해 주세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-brand)] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
              >
                공식 스토어 방문하기
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="/#custom"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white"
              >
                맞춤 제작 알아보기
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
