// Read-only check of Workers KV daily operation counts via Cloudflare's
// GraphQL Analytics API. Credentials load from .env.local the same way
// scripts/deploy-ftp.mjs does — never printed, never passed on the CLI.
//
// Usage: node scripts/check-kv-usage.mjs

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = trimmed.slice(eq + 1).trim();
  }
}

loadEnvLocal();

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!token || !accountId) {
  console.error("Missing CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID in .env.local");
  process.exit(1);
}

const today = new Date();
const since = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const sinceStr = since.toISOString().slice(0, 10);
const untilStr = today.toISOString().slice(0, 10);

const query = `
  query KvUsage($accountTag: String!, $since: Date!, $until: Date!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        kvOperationsAdaptiveGroups(
          limit: 1000
          filter: { date_geq: $since, date_leq: $until }
          orderBy: [date_ASC]
        ) {
          dimensions {
            date
            actionType
          }
          sum {
            requests
          }
        }
      }
    }
  }
`;

const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { accountTag: accountId, since: sinceStr, until: untilStr },
  }),
});

const json = await res.json();

if (json.errors?.length) {
  console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
  process.exit(1);
}

const groups = json?.data?.viewer?.accounts?.[0]?.kvOperationsAdaptiveGroups ?? [];
if (groups.length === 0) {
  console.log("No KV operation data returned for the queried range.");
} else {
  const byDate = {};
  for (const g of groups) {
    const d = g.dimensions.date;
    const action = g.dimensions.actionType;
    byDate[d] ??= {};
    byDate[d][action] = (byDate[d][action] ?? 0) + g.sum.requests;
  }
  console.log(JSON.stringify(byDate, null, 2));
}
