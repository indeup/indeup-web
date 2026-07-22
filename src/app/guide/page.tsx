import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import NaverBlogFeed from "@/components/NaverBlogFeed";
import YoutubeFeed from "@/components/YoutubeFeed";

const siteUrl = "https://indeup.com";
const pageTitle = "책상 가이드 | 인디업";
const pageDescription =
  "공간 활용, 사이즈 선택, 배치 아이디어까지 인디업 네이버 블로그와 유튜브 콘텐츠를 한곳에서 확인할 수 있습니다.";

function FeedSection({
  id,
  title,
  sourceLabel,
  sourceHref,
  children,
}: {
  id: string;
  title: string;
  sourceLabel: string;
  sourceHref: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">{title}</h2>
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 cursor-pointer border-b border-[var(--color-border)] pb-0.5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {sourceLabel}
          </a>
        </div>
        {children}
      </div>
    </section>
  );
}

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

export default function GuidePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "책상 가이드", item: `${siteUrl}/guide/` },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/guide/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
  };

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
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

        {/* Hero */}
        <section className="px-6 pb-10 pt-10 sm:px-12 sm:pt-14">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
              Guide
            </p>
            <h1 className="mt-3 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              책상 가이드
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
              공간 활용, 사이즈 선택, 배치 아이디어까지
              <br />
              인디업 네이버 블로그와 유튜브의 이야기를 이곳에서 바로 확인할 수 있습니다.
            </p>
          </div>
        </section>

        <FeedSection
          id="blog"
          title="네이버 블로그"
          sourceLabel="블로그 전체글 보기"
          sourceHref="https://blog.naver.com/indeup_official"
        >
          <Reveal>
            <NaverBlogFeed />
          </Reveal>
        </FeedSection>

        <FeedSection
          id="youtube-longform"
          title="유튜브 롱폼"
          sourceLabel="유튜브 채널 보기"
          sourceHref="https://www.youtube.com/@indeup"
        >
          <Reveal>
            <YoutubeFeed kind="longform" />
          </Reveal>
        </FeedSection>

        <FeedSection
          id="youtube-shorts"
          title="유튜브 쇼츠"
          sourceLabel="유튜브 채널 보기"
          sourceHref="https://www.youtube.com/@indeup"
        >
          <Reveal>
            <YoutubeFeed kind="shorts" />
          </Reveal>
        </FeedSection>
      </main>

      <Footer />
    </div>
  );
}
