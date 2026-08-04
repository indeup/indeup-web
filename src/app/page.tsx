import fs from "node:fs";
import path from "node:path";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";
import { leadTime, warranty } from "@/lib/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import HeroSlider, { CollectionQuickNav } from "@/components/HeroSlider";
import HeroIntroOverlay from "@/components/HeroIntroOverlay";
import DimensionShowcase from "@/components/DimensionShowcase";
import ZoomStatement from "@/components/ZoomStatement";
import FrameDetail from "@/components/FrameDetail";
import WarrantyBadge from "@/components/WarrantyBadge";
import InstagramReels from "@/components/InstagramReels";
import ContentPreview from "@/components/ContentPreview";
import type { BlogFeedData } from "@/components/NaverBlogFeed";
import type { YoutubeFeedData } from "@/components/YoutubeFeed";

const faqs = [
  {
    q: "인디업은 어떤 회사인가요?",
    a: "인디업(INDEUP)은 공간과 사용 목적에 맞춰 가로·세로·높이를 10mm 단위로 조정해 책상을 제작하는 국내 맞춤 데스크 브랜드입니다. 아연도금 철제 프레임과 무상보증으로 오래 쓰는 책상을 만듭니다.",
  },
  {
    q: "제작 기간은 얼마나 걸리나요?",
    a: leadTime,
  },
  {
    q: "보증은 어떻게 되나요?",
    a: warranty,
  },
  {
    q: "실제 구매는 어디서 하나요?",
    a: "인디업 공식 네이버 브랜드스토어에서 구매할 수 있습니다.",
  },
  {
    q: "어떤 제품들이 있나요?",
    a: "1인용 책상, 1인용 컴퓨터책상, 2인용 책상, 2인용 컴퓨터책상, 좌식 책상, 사이드테이블, 홈바테이블, 프레임까지 총 여덟 가지 제품을 제작합니다.",
  },
];

function readBuildTimeData<T>(filename: string): T | null {
  try {
    const filePath = path.join(process.cwd(), "public", "data", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

export default function Home() {
  const initialBlogData = readBuildTimeData<BlogFeedData>("naver-blog.json");
  const initialYoutubeData = readBuildTimeData<YoutubeFeedData>("youtube.json");

  // Real, published videos shown on this page (see ContentPreview/YoutubeFeed)
  // — VideoObject markup so search engines can recognize and potentially
  // rich-result them. Capped and sorted by real publish date; skipped
  // entirely when the feed hasn't loaded (no placeholder/fabricated entries).
  const allVideos = [...(initialYoutubeData?.longform ?? []), ...(initialYoutubeData?.shorts ?? [])]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);
  const videoJsonLd =
    allVideos.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: allVideos.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "VideoObject",
              name: v.title,
              description: v.description || v.title,
              thumbnailUrl: v.thumbnail ? [v.thumbnail] : undefined,
              uploadDate: v.publishedAt,
              contentUrl: v.link,
              embedUrl: `https://www.youtube.com/embed/${v.id}`,
              ...(v.viewCount != null && {
                interactionStatistic: {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/WatchAction",
                  userInteractionCount: v.viewCount,
                },
              }),
            },
          })),
        }
      : null;

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
      {videoJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(videoJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(faqJsonLd) }} />
      <HeroIntroOverlay />
      <Header />

      <main className="flex-1 space-y-3 bg-[var(--color-muted)] sm:space-y-0 sm:bg-transparent">
        <HeroSlider />

        {/* Structure/material proof — sits right under the wordmark+CTA
            moment (still part of the hero's first impression) rather than
            after the collection grid, so credibility claims land before the
            visitor even reaches product browsing. */}
        <FrameDetail />

        {/* Dimension showcase — autoplaying width/depth/height video. Right
            after FrameDetail so the two functional "how it's built / how
            it's sized" proofs sit back to back, before the collection grid
            and the more emotional brand statement. */}
        <DimensionShowcase />

        {/* Collection quick-nav — moved out of HeroSlider so FrameDetail
            could be inserted between the wordmark and this grid; see
            HeroSlider.tsx's exported CollectionQuickNav. */}
        <CollectionQuickNav />

        {/* Brand statement — scroll-driven zoom through the headline into a
            material texture. See ZoomStatement.tsx for the pin/scale
            mechanics. */}
        <ZoomStatement />

        {/* Warranty trust badge — big count-up statement bridging the
            material detail section and the content proof section. */}
        <WarrantyBadge />

        {/* FAQ — home page had no crawlable Q&A content at all; this gives
            search engines and AI answer engines a direct, structured entry
            point for the most basic "what is this / how does it work"
            questions before the visitor ever reaches a product page. */}
        <section className="border-t border-[var(--color-border)] bg-white px-6 py-16 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">자주 묻는 질문</h2>
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
          </div>
        </section>

        {/* Content preview — a few cards each from the blog/유튜브 TV/쇼츠
            feeds, with a "더보기" link out to the real channel. This is now
            the only place on-site these show (they used to also live on
            /guide, which was redundant once this section existed here). */}
        <ContentPreview initialBlogData={initialBlogData} initialYoutubeData={initialYoutubeData} />

        {/* Instagram reels — official oEmbed widget, real posts from
            instagram.com/indeup.kr. */}
        <InstagramReels />
      </main>

      <SizeCta />
      <Footer />
    </div>
  );
}
