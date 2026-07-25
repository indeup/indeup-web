import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";

export const dynamic = "force-static";

// Every real search-facing crawler gets the same blanket allow as the
// wildcard rule — there is no admin/private/API area on this static site to
// carve out, so listing them by name doesn't change behavior, it just makes
// the intent explicit: this site wants to be found by search engines and by
// the AI services that answer questions about indeup, not just "whatever
// matches *". Model-training crawlers (GPTBot, ClaudeBot, Google-Extended)
// are deliberately left unblocked too — see /docs/SEARCH-REGISTRATION-CHECKLIST.md
// for the reasoning and how to revisit that choice later.
const searchAndAiCrawlers = [
  "Googlebot",
  "Bingbot",
  "Yeti", // Naver
  "OAI-SearchBot", // ChatGPT search
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...searchAndAiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
