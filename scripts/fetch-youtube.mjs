// Fetches indeup's two curated YouTube playlists and writes
// public/data/youtube.json — long-form videos from the "인디업 맞춤 데스크"
// playlist, Shorts from the "인디업 쇼츠" playlist. Using these specific,
// channel-owner-curated playlists (rather than "everything the channel ever
// uploaded") keeps unrelated uploads (stock/reference clips, etc.) out of
// the site's feed.
//
// Playlist RSS is the same official, public, no-API-key mechanism as the
// channel feed, just scoped with ?playlist_id= instead of ?channel_id=.
//
// Same failure contract as fetch-naver-blog.mjs: any error, or zero items
// parsed from a feed, leaves the existing JSON file untouched instead of
// overwriting it with a partial/empty result.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PLAYLISTS = {
  longform: "PL1OpYFUPf80FaFynOO1g0MCOptVM5HzNm", // "인디업 맞춤 데스크"
  shorts: "PL1OpYFUPf80Hftiq_7t9v24x2QojnGVRW", // "인디업 쇼츠"
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "public", "data", "youtube.json");

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

function extractFirst(block, regex) {
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

function parseEntries(xml) {
  const blocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const posts = [];

  for (const block of blocks) {
    const videoId = extractFirst(block, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
    const title = decodeEntities(extractFirst(block, /<title>([\s\S]*?)<\/title>/));
    const link = extractFirst(block, /<link rel="alternate" href="([^"]*)"/);
    const publishedRaw = extractFirst(block, /<published>([\s\S]*?)<\/published>/);
    const thumbnail = extractFirst(block, /<media:thumbnail url="([^"]*)"/);
    const viewsRaw = extractFirst(block, /<media:statistics views="([^"]*)"/);

    const published = publishedRaw ? new Date(publishedRaw) : null;
    if (!videoId || !title || !link || !published || Number.isNaN(published.getTime())) continue;

    posts.push({
      id: videoId,
      title,
      link,
      publishedAt: published.toISOString(),
      thumbnail: thumbnail || null,
      viewCount: viewsRaw ? Number(viewsRaw) : null,
    });
  }

  return posts;
}

async function fetchPlaylist(playlistId) {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  if (!url.startsWith("https://")) {
    throw new Error("playlist feed URL must use HTTPS");
  }

  const res = await fetch(url, {
    headers: { "User-Agent": "indeup-site-rss-fetch/1.0" },
  });

  if (!res.ok) {
    throw new Error(`YouTube playlist feed fetch failed (${playlistId}): ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  return parseEntries(xml);
}

async function main() {
  const [longform, shorts] = await Promise.all([
    fetchPlaylist(PLAYLISTS.longform),
    fetchPlaylist(PLAYLISTS.shorts),
  ]);

  if (longform.length === 0 && shorts.length === 0) {
    throw new Error("Parsed 0 videos from both YouTube playlists — refusing to overwrite existing data");
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    source: {
      longform: `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLISTS.longform}`,
      shorts: `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLISTS.shorts}`,
    },
    longform,
    shorts,
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${longform.length} long-form + ${shorts.length} shorts to ${OUTPUT_PATH}`);
}

main().catch(async (err) => {
  console.error("youtube feed refresh failed:", err.message);
  try {
    await readFile(OUTPUT_PATH, "utf-8");
    console.error("Existing public/data/youtube.json left untouched.");
  } catch {
    console.error("No existing public/data/youtube.json was found either.");
  }
  process.exit(1);
});
