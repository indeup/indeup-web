import fs from "node:fs";
import path from "node:path";
import { siteUrl, brandNameKo, brandNameEn } from "@/lib/brand";
import { guideArticles } from "@/lib/guideArticles";
import { escapeXml } from "@/lib/feedUtils";

export const dynamic = "force-static";

type FeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
};

type BlogPost = { id: string; title: string; link: string; pubDate: string; summary: string };
type YoutubePost = { id: string; title: string; link: string; publishedAt: string; description: string };

function readBuildTimeData<T>(filename: string): T | null {
  try {
    const filePath = path.join(process.cwd(), "public", "data", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * One unified feed across every content source the site already maintains
 * (자체 가이드, 네이버 블로그, 유튜브) — real content only, sorted by real
 * publish date, no synthetic/placeholder entries. This is a content feed
 * for search engines and readers, not a per-option product-change log (per
 * the brief's own guidance not to spam RSS with minor updates).
 */
function collectItems(): FeedItem[] {
  const items: FeedItem[] = [];

  for (const article of guideArticles) {
    items.push({
      title: article.title,
      link: `${siteUrl}/guide/${article.slug}/`,
      description: article.description,
      pubDate: new Date(article.publishedAt).toUTCString(),
      guid: `${siteUrl}/guide/${article.slug}/`,
    });
  }

  const blogData = readBuildTimeData<{ posts: BlogPost[] }>("naver-blog.json");
  for (const post of blogData?.posts ?? []) {
    const date = new Date(post.pubDate);
    if (Number.isNaN(date.getTime())) continue;
    items.push({
      title: post.title,
      link: post.link,
      description: post.summary,
      pubDate: date.toUTCString(),
      guid: post.link,
    });
  }

  const ytData = readBuildTimeData<{ longform: YoutubePost[]; shorts: YoutubePost[] }>("youtube.json");
  for (const post of [...(ytData?.longform ?? []), ...(ytData?.shorts ?? [])]) {
    const date = new Date(post.publishedAt);
    if (Number.isNaN(date.getTime())) continue;
    items.push({
      title: post.title,
      link: post.link,
      description: post.description || post.title,
      pubDate: date.toUTCString(),
      guid: post.link,
    });
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return items.slice(0, 50);
}

export function GET() {
  const items = collectItems();
  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${brandNameKo} ${brandNameEn} 책상 가이드`)}</title>
    <link>${siteUrl}/guide/</link>
    <description>${escapeXml("공간에 맞는 책상 사이즈·배치 가이드, 제작 이야기, 설치 사례를 전하는 인디업 공식 콘텐츠 피드입니다.")}</description>
    <language>ko-kr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
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
