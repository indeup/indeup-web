import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SizeCta from "@/components/SizeCta";
import GuideExplorer from "@/components/GuideExplorer";
import { guideArticles } from "@/lib/guideArticles";
import { leadTime } from "@/lib/products";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";

const siteUrl = "https://indeup.com";
const pageTitle = "책상 사이즈·배치 가이드 | 원룸·컴퓨터·2인용 책상 | 인디업";
const pageDescription =
  "원룸·서재·홈오피스에 맞는 책상 가로, 깊이, 높이와 배치 방법을 안내합니다. 10mm 단위 맞춤 제작 전 실측법과 1인용·2인용 책상 선택 팁을 확인하세요.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/guide/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/guide/",
    images: [
      {
        url: "/indeup_series.jpg",
        width: 1500,
        height: 1125,
        alt: "인디업 책상 가이드",
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
    q: "좁은 방에는 책상 깊이가 몇 mm가 적당한가요?",
    a: "인디업 책상은 제품에 따라 깊이 200~700mm 사이에서 제작할 수 있습니다. 좁은 방에서는 통로 공간까지 고려해 400~500mm대의 얕은 깊이를 선택하는 경우가 많습니다. 정확한 깊이는 책상 가이드의 '내 공간 책상 사이즈 계산기'나 맞춤 제작 페이지에서 확인할 수 있습니다.",
  },
  {
    q: "맞춤 책상은 몇 mm 단위로 제작할 수 있나요?",
    a: "인디업은 가로·깊이·높이를 모두 10mm 단위로 맞춤 제작합니다. 예를 들어 가로 1230mm를 원한다면 1200mm 기본 사양에 옵션 +30mm를 추가하는 방식으로 주문합니다.",
  },
  {
    q: "책상 기본 높이는 몇 mm인가요?",
    a: "1인용 책상, 2인용 책상, 사이드테이블, 홈바테이블은 기본 높이 720mm를 사용하며 제품별 범위 안에서 10mm 단위로 조정할 수 있습니다. 좌식책상은 좌식 생활에 맞춘 낮은 기본 높이를 사용합니다.",
  },
  {
    q: "책상 공간은 어떻게 측정해야 하나요?",
    a: "책상을 놓을 공간의 가로(좌우 폭), 세로(앞뒤 깊이), 높이(바닥부터 상판까지)를 줄자로 측정해 mm 단위로 기록해 주세요. 벽이나 가구 사이에 놓을 예정이라면 가장 좁은 지점을 기준으로 측정하는 것이 안전합니다.",
  },
  {
    q: "주문 후 제작 기간은 얼마나 걸리나요?",
    a: leadTime,
  },
];

export default function GuidePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "책상 가이드", item: `${siteUrl}/guide/` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/guide/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guideArticles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${siteUrl}/guide/${a.slug}/`,
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
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-[1600px] items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              책상 가이드
            </li>
          </ol>
        </nav>

        <GuideExplorer />

        {/* FAQ */}
        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-16">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">책상 가이드 FAQ</h2>
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

      </main>

      <SizeCta />
      <Footer />
    </div>
  );
}
