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

// A manual Route Handler instead of the typed `robots.ts` metadata file:
// that file's `MetadataRoute.Robots` type only supports
// {userAgent, allow, disallow, crawlDelay} rules plus `sitemap`/`host` — it
// has no field for an arbitrary raw line, and Daum's site-verification step
// requires pasting one exact `#DaumWebMasterTool:...` comment line at the
// bottom of the file. This still generates the same rules from the same
// crawler list above, just as plain text we fully control.
function buildRobotsTxt(): string {
  const lines: string[] = [];
  lines.push("User-Agent: *", "Allow: /", "");
  for (const userAgent of searchAndAiCrawlers) {
    lines.push(`User-Agent: ${userAgent}`, "Allow: /", "");
  }
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`, "");
  // Daum 웹마스터도구 사이트 소유 확인 — 2026-08-02 PIN 발급분.
  lines.push(
    "#DaumWebMasterTool:8a04141e0b7112679b3f8f5932a53ce3452c7b4139670d2953a9586e840190fe:A3uSyGyxIa3vX2ooVu+pjg=="
  );
  return lines.join("\n");
}

export async function GET() {
  return new Response(buildRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
