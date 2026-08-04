import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import SizeCheckLink from "@/components/SizeCheckLink";
import Reveal from "@/components/Reveal";
import { products, getProduct, naverStoreUrl, safetyUsageNotice } from "@/lib/products";
import { policyData } from "@/lib/policy";
import { getStartingPrice, getPriceRange } from "@/lib/pricing";
import { ColorSwatchGroup, frameSwatches, topSwatches } from "@/components/ColorSwatches";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";

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
      <dd className="mt-1.5 text-sm leading-6 font-medium text-[var(--color-secondary)] sm:mt-0 sm:text-base sm:leading-[1.3]">
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

  // Only fields backed by real, verifiable facts are included. `offers` uses
  // the same confirmed basePrices table src/lib/pricing.ts feeds into
  // PriceBlock on /custom-fit/ (2026-07-28 real Naver export) — this used to
  // be omitted because no real price lived on this site at all, but now that
  // it does, showing the lowest confirmed 즉시할인가 here lets Google/Naver
  // AI answers cite a real "OOO원부터" instead of having no price signal.
  // `url` still points at the Naver store (that's where the transaction
  // actually happens, per naverStoreUrl/product.purchaseUrl elsewhere on this
  // page) — indeup.com never claims to sell directly. No `review` (individual
  // Review objects need real review text, which we don't have access to —
  // only the aggregate star/count shown on the Naver listing). `aggregateRating`
  // IS included below, from that same real Naver listing data.
  // `hasMerchantReturnPolicy` reflects the real policy (no change-of-mind
  // returns; only defect/measurement-error exchanges, handled outside this
  // schema) — maps cleanly onto MerchantReturnNotPermitted. `shippingDetails`
  // reflects the operator-confirmed rule: free nationwide base rate, plus a
  // real Jeju surcharge — see project_indeup_return_policy memory. "기타
  // 도서산간" (other remote islands) isn't included: it's a courier-defined
  // delivery zone scattered across many provinces with no single clean
  // schema.org region to attach a rate to, unlike Jeju (KR-49).
  //
  // "frame" has no basePrices row (price on inquiry) — Google Search Console
  // (2026-07-30) flagged exactly this: a Product entry needs at least one of
  // offers/review/aggregateRating to be rich-result eligible, and we have
  // none of the three for frame and won't fabricate one. So `productJsonLd`
  // for frame is skipped entirely below (see the script tag) rather than
  // emitted as an incomplete/invalid Product.
  const startingPrice = getStartingPrice(product.slug);
  const priceRange = getPriceRange(product.slug);

  // Real aggregate rating/review-count per catalog line, read directly off
  // the operator's own Naver Smart Store category listings (2026-07-30
  // screenshots) and pooled (weighted average) across every width/option in
  // that line — never estimated or invented. Re-pull from Naver and update
  // here if it goes stale; don't let this silently drift into a fabricated
  // number.
  const reviewData: Record<string, { ratingValue: number; reviewCount: number }> = {
    "single-desk-computer": { ratingValue: 4.93, reviewCount: 719 },
    "double-desk-computer": { ratingValue: 4.92, reviewCount: 241 },
    "single-desk": { ratingValue: 4.91, reviewCount: 411 },
    "double-desk": { ratingValue: 4.84, reviewCount: 19 },
    "floor-desk": { ratingValue: 4.94, reviewCount: 178 },
    "side-table": { ratingValue: 4.93, reviewCount: 46 },
    "home-bar-table": { ratingValue: 4.96, reviewCount: 25 },
  };
  const rating = reviewData[product.slug];

  // Confirmed Jeju surcharge (제주도, 제품 1개 기준) — 2인용 계열은 24,000원,
  // 그 외 전 라인은 18,000원. See project_indeup_return_policy memory.
  const jejuFee = product.slug.startsWith("double-desk") ? 24000 : 18000;
  // handlingTime = order → shipment (7~8영업일 production fact, sitewide).
  // transitTime = shipment → arrival (평일 업무일 평균 1~2일, operator-confirmed
  // 2026-08-04). Together they give Google the full order-to-doorstep window.
  const deliveryTime = {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: policyData.productionDaysMin,
      maxValue: policyData.productionDaysMax,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: policyData.transitDaysMin,
      maxValue: policyData.transitDaysMax,
      unitCode: "DAY",
    },
    // No confirmed order-cutoff-time policy exists (operatingHours is store
    // contact hours, not an order-cutoff rule), so cutoffTime is deliberately
    // omitted rather than guessed. businessDays mirrors the confirmed
    // "평일(월~금)" fact (policyData.operatingDays).
    businessDays: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
      ],
    },
  };
  const shippingDetails = [
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "KRW" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "KR" },
      deliveryTime,
    },
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: jejuFee, currency: "KRW" },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "KR",
        addressRegion: "제주특별자치도",
      },
      deliveryTime,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `인디업 ${product.title}`,
    description: product.metaDescription,
    image: `${siteUrl}${product.image}`,
    url: `${siteUrl}/products/${product.slug}/`,
    brand: {
      "@type": "Brand",
      name: "인디업",
      alternateName: "INDEUP",
      url: siteUrl,
    },
    // Machine-readable versions of the same real facts already shown in the
    // on-page spec table (SpecRow) below — lets AI answer engines (Google AI
    // Overview, Naver AI 브리핑 등) cite warranty/material precisely instead
    // of parsing prose, without adding any offers/rating claim we can't back.
    additionalProperty: [
      { "@type": "PropertyValue", name: "소재", value: product.material },
      { "@type": "PropertyValue", name: "무상보증", value: product.warranty },
    ],
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
      },
    }),
    ...(priceRange && priceRange.count > 1 && {
      offers: {
        "@type": "AggregateOffer",
        lowPrice: priceRange.low,
        highPrice: priceRange.high,
        offerCount: priceRange.count,
        priceCurrency: "KRW",
        // Google's Product/Merchant-listing structured data only recognizes a
        // fixed subset of schema.org's ItemAvailability enum, and "MadeToOrder"
        // (though a real schema.org value) isn't in that subset — GSC flagged
        // it as an invalid enum (2026-07-30). "InStock" is the standard stand-in
        // Google itself expects for always-orderable made-to-order goods.
        availability: "https://schema.org/InStock",
        url: product.purchaseUrl,
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "KR",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
        shippingDetails,
      },
    }),
    ...(priceRange && priceRange.count === 1 && startingPrice && {
      offers: {
        "@type": "Offer",
        price: startingPrice.discountPrice,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
        url: product.purchaseUrl,
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "KR",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
        shippingDetails,
      },
    }),
  };

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(breadcrumbJsonLd) }} />
      {priceRange && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(productJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(faqJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-3 sm:px-12">
          <ol className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
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
        <section className="px-6 py-16 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
                {product.eyebrow}
              </p>
              <h1
                className="mt-4 font-semibold leading-tight tracking-[-0.02em]"
                style={{ fontSize: "var(--type-h2)" }}
              >
                인디업 {product.title}
              </h1>
              <p className="mt-4 text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
                {product.listSummary}
              </p>
              {rating && (
                // Same real, verified rating/count already in the Product
                // JSON-LD above (aggregateRating) — surfaced here as visible
                // text too, not just schema, so it's part of the page's
                // actual readable content for AI answer engines and humans
                // alike, not something only a crawler parsing <script> tags
                // would ever see.
                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--color-secondary)]">
                  <span aria-hidden="true" className="text-[var(--color-accent)]">★</span>
                  {rating.ratingValue} · 실구매 후기 {rating.reviewCount.toLocaleString("ko-KR")}건 (네이버 스마트스토어)
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
                >
                  네이버 스토어에서 구매하기
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <Suspense
                  fallback={
                    <a
                      href="/custom-fit/"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-primary)]/25 px-6 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]"
                    >
                      사이즈 제작 가능 여부 확인
                    </a>
                  }
                >
                  <SizeCheckLink className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-primary)]/25 px-6 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]" />
                </Suspense>
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
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
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
              <SpecRow label="하중 및 안전 사용 안내" value={safetyUsageNotice} />
            </dl>
            <div className="mt-8 flex flex-col gap-8 border-t border-[var(--color-border)] pt-8">
              <ColorSwatchGroup title="프레임 색상" swatches={frameSwatches} />
              {product.slug !== "frame" && <ColorSwatchGroup title="상판 색상·마감" swatches={topSwatches} />}
            </div>
          </Reveal>
        </section>

        {/* Reviews — honest framing: no fabricated testimonials or ratings. */}
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              고객 후기
            </h2>
            <p className="mt-4 text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
              실제 구매 고객의 후기는 인디업 공식 홈페이지가 아닌 네이버 공식 브랜드스토어의 상품 페이지에서
              확인할 수 있습니다. 후기에서 확인된 실제 사용 환경과 의견은 다음 제품을 개선하는 자료로
              활용됩니다.
            </p>
            <div className="mt-6">
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
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
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              {product.title}에 대해 자주 묻는 질문
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {product.faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 transition-colors duration-300 open:border-[var(--color-primary)]/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-primary)] marker:content-none">
                    <h3 className="text-base sm:text-lg">{item.q}</h3>
                    <span
                      className="shrink-0 text-xl font-normal text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-primary)]"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Related products */}
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-[1600px]">
            <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              다른 제품도 살펴보세요
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}/`}
                  className="group overflow-hidden rounded-2xl border border-[var(--color-border)] transition-colors duration-300 hover:border-[var(--color-primary)]/40"
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
                    <p className="font-semibold tracking-[-0.01em] text-[var(--color-primary)]">{p.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-secondary)]">{p.listSummary}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="/products/"
                className="group inline-flex cursor-pointer items-center gap-2 border-b border-[var(--color-primary)]/30 pb-1 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
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

      <SizeCta />
      <Footer />
    </div>
  );
}
