// Fetches the indeup Naver Blog RSS feed and writes public/data/naver-blog.json.
//
// Run by .github/workflows/naver-blog-rss.yml on a schedule. Never fetched
// directly from the browser — the site only ever reads the JSON file this
// script produces (see src/components/NaverBlogFeed.tsx).
//
// On any failure (network error, malformed feed, zero items parsed) the
// script exits non-zero WITHOUT touching the existing JSON file, so a bad
// or unreachable RSS response never wipes out the last known-good post list.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RSS_URL = "https://rss.blog.naver.com/indeup_official.xml";
const MAX_POSTS = 12;
const FALLBACK_THUMBNAIL = "/indeup_series.jpg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "data", "naver-blog.json");

function decodeEntities(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return plain ? plain[1].trim() : "";
}

function extractThumbnail(descriptionHtml) {
  const match = descriptionHtml.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function extractSummary(descriptionHtml) {
  const text = decodeEntities(descriptionHtml.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\.{3,}\s*$/, "")
    .trim();
  const MAX_LEN = 110;
  return text.length > MAX_LEN ? `${text.slice(0, MAX_LEN).trim()}…` : text;
}

function parseItems(xml) {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return blocks
    .map((block) => {
      const title = decodeEntities(extractTag(block, "title"));
      const link = extractTag(block, "link");
      const guid = extractTag(block, "guid") || link;
      const pubDateRaw = extractTag(block, "pubDate");
      const description = extractTag(block, "description");

      const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;

      if (!title || !link || !pubDate || Number.isNaN(pubDate.getTime())) return null;

      return {
        id: guid,
        title,
        link,
        pubDate: pubDate.toISOString(),
        summary: extractSummary(description),
        thumbnail: extractThumbnail(description) || FALLBACK_THUMBNAIL,
      };
    })
    .filter((item) => item !== null);
}

async function main() {
  if (!RSS_URL.startsWith("https://")) {
    throw new Error("RSS_URL must use HTTPS");
  }

  // Node's built-in fetch (undici) issues plain fetch() calls over HTTP/1.1
  // by default for https:// targets, satisfying the HTTPS + HTTP/1.1-or-above
  // requirement without any extra client configuration.
  const res = await fetch(RSS_URL, {
    headers: { "User-Agent": "indeup-site-rss-fetch/1.0" },
  });

  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const items = parseItems(xml).slice(0, MAX_POSTS);

  if (items.length === 0) {
    throw new Error("Parsed 0 posts from RSS feed — refusing to overwrite existing data");
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    source: RSS_URL,
    posts: items,
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${items.length} posts to ${OUTPUT_PATH}`);
}

main().catch(async (err) => {
  console.error("naver-blog RSS refresh failed:", err.message);
  try {
    await readFile(OUTPUT_PATH, "utf-8");
    console.error("Existing public/data/naver-blog.json left untouched.");
  } catch {
    console.error("No existing public/data/naver-blog.json was found either.");
  }
  process.exit(1);
});
