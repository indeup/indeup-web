import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { products, getProduct, naverStoreUrl } from "@/lib/products";

const siteUrl = "https://indeup.com";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `인디업 ${product.title} | ${product.eyebrow} 맞춤 제작`;

  return {
    title: { absolute: title },
    description: product.metaDescription,
    alternates: {
      canonical: `/products/${product.slug}/`,
    },
    openGraph: {
      type: "website",
      title,
      description: product.metaDescription,
      url: `/products/${product.slug}/`,
      images: [
        {
          url: product.image,
          width: 1920,
          height: 1281,
          alt: `인디업 ${product.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.metaDescription,
      images: [product.image],
    },
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[var(--color-border)] py-5 sm:grid sm:grid-cols-[160px_1fr] sm:gap-8 sm:py-6">
      <dt className="text-sm font-semibold text-[var(--color-primary)] sm:text-base">{label}</dt>
      <dd className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)] sm:mt-0 sm:text-base sm:leading-7">
        {value}
      </dd>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "제품", item: `${siteUrl}/products/` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${siteUrl}/products/${product.slug}/`,
      },
    ],
  };

  // Only fields backed by real, verifiable facts are included. No `offers`
  // (price/availability isn't hosted on this site — it lives on the Naver
  // store and would go stale here) and no `review`/`aggregateRating` (there
  // is no real review data behind this page; inventing star ratings would
  // be fake-review structured data, which is exactly what this project's
  // own content rules prohibit).
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `인디업 ${product.title}`,
    description: product.metaDescription,
    image: `${siteUrl}${product.image}`,
    url: `${siteUrl}/products/${product.slug}/`,
    brand: {
      "@type": "Organization",
      name: "인디업",
      alternateName: "INDEUP",
      url: siteUrl,
    },
  };

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-3 sm:px-12">
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/products/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                제품
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="px-6 py-14 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
                {product.eyebrow}
              </p>
              <h1
                className="mt-4 font-bold leading-tight tracking-[-0.02em]"
                style={{ fontSize: "var(--type-h2)" }}
              >
                인디업 {product.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                {product.listSummary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={naverStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-brand)] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
                >
                  네이버 스토어에서 구매하기
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <a
                  href="/#custom"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-primary)]/25 px-6 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]"
                >
                  맞춤 제작 문의
                </a>
              </div>
            </div>

            <Reveal className="mt-10 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                  editorial product photo, not a next/image layout fit. */}
              <img
                src={product.image}
                alt={`인디업 ${product.title}`}
                className="h-full w-full object-cover"
                style={{ aspectRatio: "16 / 9" }}
              />
            </Reveal>
          </div>
        </section>

        {/* Spec sheet */}
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              제품 정보
            </h2>
            <dl className="mt-6">
              <SpecRow label="추천 공간" value={product.recommendedSpace} />
              <SpecRow label="제작 가능 사이즈" value={product.sizeInfo} />
              <SpecRow label="소재" value={product.material} />
              <SpecRow label="구조" value={product.structure} />
              <SpecRow label="색상" value={product.colorInfo} />
              <SpecRow label="옵션" value={product.optionInfo} />
              <SpecRow label="제작 기간" value={product.leadTime} />
              <SpecRow label="배송" value={product.shipping} />
              <SpecRow label="조립" value={product.assembly} />
              <SpecRow label="무상보증" value={product.warranty} />
            </dl>
          </Reveal>
        </section>

        {/* WAYBLE-style dark showcase — real brand photography, honestly
            captioned (not claimed as customer-submitted installation
            photos, since they aren't). */}
        <section className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-14 text-white sm:px-12 sm:py-20">
          <Reveal className="relative mx-auto max-w-6xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              인디업이 만드는 방식
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                    editorial photo, not a next/image layout fit. */}
                <img
                  src="/indeup_series.jpg"
                  alt="인디업 책상과 프레임 라인업"
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "4 / 3" }}
                />
                <div className="mt-4">
                  <p className="font-bold tracking-[-0.01em]">인디업 제품 라인업</p>
                  <p className="mt-1 text-sm text-white/60">
                    공간에 맞춰 제작하는 책상과 프레임을 함께 소개합니다.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                    editorial photo, not a next/image layout fit. */}
                <img
                  src="/indeup_desk.jpg"
                  alt="인디업 책상 마감 디테일"
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "4 / 3" }}
                />
                <div className="mt-4">
                  <p className="font-bold tracking-[-0.01em]">마감과 디테일</p>
                  <p className="mt-1 text-sm text-white/60">
                    아연도금 프레임과 분체도장으로 표면을 마감합니다.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Reviews — honest framing: no fabricated testimonials or ratings. */}
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              고객 후기
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
              실제 구매 고객의 후기는 인디업 공식 홈페이지가 아닌 네이버 공식 브랜드스토어의 상품 페이지에서
              확인할 수 있습니다. 후기에서 확인된 실제 사용 환경과 의견은 다음 제품을 개선하는 자료로
              활용됩니다.
            </p>
            <div className="mt-6">
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                네이버 스토어에서 후기 보기
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              {product.title}에 대해 자주 묻는 질문
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {product.faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 transition-colors duration-300 open:border-[var(--color-brand)]/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-primary)] marker:content-none">
                    <h3 className="text-base sm:text-lg">{item.q}</h3>
                    <span
                      className="shrink-0 text-xl font-normal text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-brand)]"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-secondary)] sm:text-base">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Related products */}
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              다른 제품도 살펴보세요
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}/`}
                  className="group overflow-hidden rounded-2xl border border-[var(--color-border)] transition-colors duration-300 hover:border-[var(--color-brand)]/40"
                >
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                        editorial product photo, not a next/image layout fit. */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold tracking-[-0.01em] text-[var(--color-primary)]">{p.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-secondary)]">{p.listSummary}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="/products/"
                className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                전체 제품 보기
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
