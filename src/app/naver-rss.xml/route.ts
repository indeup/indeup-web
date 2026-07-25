import { siteUrl, brandNameKo, brandNameEn } from "@/lib/brand";
import { guideArticles } from "@/lib/guideArticles";
import { escapeXml } from "@/lib/feedUtils";

export const dynamic = "force-static";

/**
 * Naver Search Advisor's RSS submission requires every URL in the feed to
 * be on the same domain as the verified site — the main /rss.xml feed
 * mixes in real Naver Blog and YouTube links (by design, for readers/other
 * RSS consumers), which Naver's own submission tool rejects outright. This
 * is the same guide-article content, filtered to indeup.com URLs only, for
 * that one submission target.
 */
export function GET() {
  const items = [...guideArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((article) => ({
      title: article.title,
      link: `${siteUrl}/guide/${article.slug}/`,
      description: article.description,
      pubDate: new Date(article.publishedAt).toUTCString(),
      guid: `${siteUrl}/guide/${article.slug}/`,
    }));

  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${brandNameKo} ${brandNameEn} 책상 가이드`)}</title>
    <link>${siteUrl}/guide/</link>
    <description>${escapeXml("공간에 맞는 책상 사이즈·배치 가이드를 전하는 인디업 공식 콘텐츠 피드입니다.")}</description>
    <language>ko-kr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
