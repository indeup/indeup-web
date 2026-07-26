// One-off correction pass: re-evaluates already-collected rows in
// reports/chatbot-live-results.csv and flips any row whose actualAnswer is
// the SERVICE_UNAVAILABLE_RESPONSE fallback text from "pass" to "fail",
// then rewrites both the all-results and failed-results CSVs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const ALL_CSV = path.join(root, "reports/chatbot-live-results.csv");
const FAILED_CSV = path.join(root, "reports/chatbot-failed-results.csv");
const SERVICE_UNAVAILABLE_TEXT = "현재 베타 서비스 개선을 위해 업데이트 중입니다";

const HEADER_COLS = [
  "questionId", "category", "question", "actualAnswer", "intentPass", "factualAccuracyPass",
  "contextMemoryPass", "productRecommendationPass", "linkPass", "tonePass", "safetyPass",
  "privacyPass", "copyrightPass", "responseTimeMs", "finalStatus", "failureReason",
];

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; }
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
function csvEscape(v) {
  const s = String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${s}"`;
}
function rowToCsv(row) {
  return HEADER_COLS.map((c) => csvEscape(row[c])).join(",");
}

const raw = fs.readFileSync(ALL_CSV, "utf8");
const lines = raw.split("\n").filter(Boolean);
const dataLines = lines.slice(1);

let correctedCount = 0;
const correctedRows = [];
for (const line of dataLines) {
  const fields = parseCsvLine(line);
  const row = {};
  HEADER_COLS.forEach((col, i) => (row[col] = fields[i]));

  const wasPass = row.finalStatus === "true" || row.finalStatus === "pass";
  const isFallback = (row.actualAnswer || "").includes(SERVICE_UNAVAILABLE_TEXT);

  if (isFallback && row.finalStatus !== "fail") {
    correctedCount += 1;
    row.finalStatus = "fail";
    row.failureReason = "service_unavailable";
    row.intentPass = "false";
    row.factualAccuracyPass = "false";
  }
  correctedRows.push(row);
}

fs.writeFileSync(ALL_CSV, HEADER_COLS.join(",") + "\n" + correctedRows.map(rowToCsv).join("\n") + "\n", "utf8");

const failedRows = correctedRows.filter((r) => r.finalStatus !== "pass" && r.finalStatus !== "true");
fs.writeFileSync(FAILED_CSV, HEADER_COLS.join(",") + "\n" + failedRows.map(rowToCsv).join("\n") + "\n", "utf8");

const totalPass = correctedRows.filter((r) => r.finalStatus === "pass").length;
const totalFail = correctedRows.filter((r) => r.finalStatus === "fail").length;
const totalBlocked = correctedRows.filter((r) => r.finalStatus === "blocked").length;

console.log("Total rows:", correctedRows.length);
console.log("Corrected from pass->fail (service_unavailable):", correctedCount);
console.log("Final: pass =", totalPass, "fail =", totalFail, "blocked =", totalBlocked);
