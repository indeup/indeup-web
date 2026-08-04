// Pulls "answer didn't land" cases out of the indeup-chat KV log so they can
// be reviewed and turned into prompt/fact fixes — two sources:
//   1. fb: entries where the customer clicked "도움이 안돼요" (not-helpful)
//   2. qa: entries where the model failed to produce a valid structured
//      answer at all (fellBackToDefault: true) — a bot failure even if no
//      customer ever clicked feedback on it.
//
// Reads CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID from .env.local (same
// pattern as deploy-ftp.mjs) and the KV namespace id from worker/wrangler.toml
// so there's a single source of truth for that id.
//
// Usage: node scripts/chat-review.mjs [--limit 50]

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

function readKvNamespaceId() {
  const tomlPath = path.join(rootDir, "worker", "wrangler.toml");
  const text = readFileSync(tomlPath, "utf8");
  const match = text.match(/\[\[kv_namespaces\]\][^[]*id\s*=\s*"([^"]+)"/);
  if (!match) throw new Error("Could not find KV namespace id in worker/wrangler.toml");
  return match[1];
}

loadEnvLocal();

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const NAMESPACE_ID = readKvNamespaceId();
const LIMIT = (() => {
  const idx = process.argv.indexOf("--limit");
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 50;
})();

if (!TOKEN || !ACCOUNT_ID) {
  console.error("Missing CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID in .env.local");
  process.exit(1);
}

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

async function cfFetch(url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Cloudflare API error ${res.status} for ${url}`);
  return res;
}

/** Lists ALL keys under a prefix, following cursor pagination. */
async function listAllKeys(prefix) {
  const keys = [];
  let cursor;
  do {
    const url = new URL(`${API_BASE}/keys`);
    url.searchParams.set("prefix", prefix);
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await cfFetch(url.toString());
    const data = await res.json();
    keys.push(...data.result.map((k) => k.name));
    cursor = data.result_info?.cursor || undefined;
  } while (cursor);
  return keys;
}

async function getValue(key) {
  const res = await cfFetch(`${API_BASE}/values/${encodeURIComponent(key)}`);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function printEntry(reason, entry, extra) {
  console.log(`\n[${reason}] ${entry?.timestamp ?? "(no timestamp)"}`);
  console.log(`  질문: ${entry?.question ?? "(질문 없음)"}`);
  console.log(`  답변: ${entry?.answer ?? "(답변 없음)"}`);
  console.log(`  intent: ${entry?.intent ?? "-"}  needsHumanSupport: ${entry?.needsHumanSupport ?? "-"}  usedWebSearch: ${entry?.usedWebSearch ?? "-"}`);
  if (extra) console.log(`  ${extra}`);
}

console.log("indeup-chat 답변 검토 리포트");
console.log("================================");

// 1. Explicit "not-helpful" customer feedback.
const fbKeys = await listAllKeys("fb:");
const notHelpful = [];
for (const key of fbKeys) {
  const fb = await getValue(key);
  if (fb?.feedback === "not-helpful") notHelpful.push({ key, fb });
}

console.log(`\n총 피드백 ${fbKeys.length}건 중 "도움이 안돼요": ${notHelpful.length}건`);
const coveredLogKeys = new Set();
for (const { fb } of notHelpful.sort((a, b) => (a.fb.timestamp < b.fb.timestamp ? 1 : -1))) {
  const qa = await getValue(fb.refKey);
  coveredLogKeys.add(fb.refKey);
  printEntry("고객이 도움 안됨 표시", qa, `참조 로그: ${fb.refKey}`);
}

// Fetch each recent qa: entry once, then classify into two more buckets from
// the same data (avoids fetching the same key twice).
const qaKeys = (await listAllKeys("qa:")).sort().reverse().slice(0, LIMIT);
const fellBack = [];
const humanSupportTopics = new Map(); // question -> [{key, qa}]
for (const key of qaKeys) {
  if (coveredLogKeys.has(key)) continue; // already shown in the not-helpful section
  const qa = await getValue(key);
  if (!qa) continue;
  if (qa.fellBackToDefault) fellBack.push({ key, qa });
  if (qa.needsHumanSupport) {
    const list = humanSupportTopics.get(qa.question) || [];
    list.push({ key, qa });
    humanSupportTopics.set(qa.question, list);
  }
}

// 2. Cases where the model failed to produce a valid structured answer at
// all — a real bot failure even without any customer feedback.
console.log(`\n최근 qa: 로그 ${qaKeys.length}건 중 모델이 유효한 답을 만들지 못한 경우(fellBackToDefault): ${fellBack.length}건`);
for (const { key, qa } of fellBack) {
  printEntry("모델이 답변 생성 실패", qa, `로그 키: ${key}`);
}

// 3. needsHumanSupport는 실패가 아니라 설계상 정상 동작(주문 상태, 정확한
// 배송비 등 확인 불가한 내용)이지만, 같은 질문이 반복해서 사람에게
// 넘겨지고 있다면 그건 "공통 사실"에 추가해서 챗봇이 직접 답하게 만들 수
// 있다는 신호이므로 별도로 모아 보여줍니다(1회성 문의는 표시하지 않음).
const repeatedHumanSupportTopics = [...humanSupportTopics.entries()].filter(([, list]) => list.length >= 2);
console.log(
  `\n최근 qa: 로그 ${qaKeys.length}건 중 같은 질문이 반복적으로 사람 상담(needsHumanSupport)으로 넘어간 경우: ${repeatedHumanSupportTopics.length}개 주제`
);
for (const [question, list] of repeatedHumanSupportTopics.sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n[반복 상담 이관] "${question}" — ${list.length}회`);
  console.log(`  답변 예시: ${list[0].qa.answer}`);
}

console.log("\n================================");
console.log(
  `요약: 고객 불만족 ${notHelpful.length}건, 모델 실패 ${fellBack.length}건, 반복 상담 이관 ${repeatedHumanSupportTopics.length}개 주제 (최근 ${LIMIT}건 중)`
);
