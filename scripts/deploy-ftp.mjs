// Uploads the static export (out/) to Cafe24 over FTP.
//
// This site has no CI/CD — Cafe24 hosting only accepts plain FTP uploads,
// so redeploying the frontend is always this one manual step. Credentials
// live in .env.local (gitignored via `.env*` in .gitignore, never
// committed) rather than being passed on the command line, since a
// password in a CLI argument would land in shell history.
//
// CAFE24_FTP_REMOTE_ROOT matters: Cafe24 FTP logs you in with your account
// home directory as "/", but that is NOT the same as the actual Apache
// document root — the real webroot for this account is nested one level
// down, at /www. Uploading to bare "/" silently creates an unrelated
// sibling copy that Apache never serves, while the live site keeps
// showing whatever was last correctly uploaded to /www. If a redeploy
// ever again "succeeds" but the live site doesn't change, re-check this
// value before assuming it's a cache problem.
//
// Usage: npm run build && node scripts/deploy-ftp.mjs

import { Client } from "basic-ftp";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// 2026-08-02 incident: 5 real customer-review xlsx files sat in public/,
// got copied into out/ by `next build`, and were live-downloadable for
// hours before anyone noticed — see feedback_public_folder_deploy_exposure
// memory. This scan is the automated guardrail so that class of mistake
// can't ship silently again: any file with one of these extensions
// anywhere in out/ blocks the deploy outright. If a legitimate use case
// ever needs one of these types served publicly, add an explicit,
// narrowly-scoped exception here — never widen this by removing an
// extension wholesale.
const BLOCKED_EXTENSIONS = [
  ".xlsx", ".xls", ".xlsm", ".csv", ".tsv",
  ".sql", ".db", ".sqlite",
  ".env", ".pem", ".key", ".p12", ".pfx",
  ".doc", ".docx", ".bak", ".zip", ".7z", ".tar", ".gz",
  // CAD source files (2026-08-03: onedesk.stp/twodesk.stp/1인용책상.dwg/
  // 2인용책상.dwg landed in public/ the same way the review xlsx did) —
  // proprietary engineering files, never meant to be publicly downloadable.
  ".stp", ".step", ".dwg", ".dxf", ".sldprt", ".sldasm", ".iges", ".igs",
];

function findBlockedFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      findBlockedFiles(full, found);
    } else if (BLOCKED_EXTENSIONS.includes(path.extname(entry).toLowerCase())) {
      found.push(full);
    }
  }
  return found;
}

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

const host = process.env.CAFE24_FTP_HOST;
const user = process.env.CAFE24_FTP_USER;
const password = process.env.CAFE24_FTP_PASSWORD;
const remoteRoot = process.env.CAFE24_FTP_REMOTE_ROOT || "/www";
const localDir = path.join(rootDir, "out");

if (!host || !user || !password) {
  console.error("Missing CAFE24_FTP_HOST / CAFE24_FTP_USER / CAFE24_FTP_PASSWORD in .env.local");
  process.exit(1);
}
if (!existsSync(localDir)) {
  console.error(`${localDir} does not exist — run "npm run build" first.`);
  process.exit(1);
}

const blocked = findBlockedFiles(localDir);
if (blocked.length > 0) {
  console.error("Deploy blocked — found file type(s) that should never be public in out/:");
  for (const f of blocked) console.error(`  ${path.relative(rootDir, f)}`);
  console.error(
    "\nThese likely leaked in from public/. Move the real source file to data/ instead " +
      "(never public/), remove it from public/, rebuild, and try again."
  );
  process.exit(1);
}

const client = new Client(30000);
let uploaded = 0;
client.trackProgress((info) => {
  if (info.type === "upload" && info.bytesOverall === info.bytes) uploaded += 1;
});

try {
  await client.access({ host, user, password, secure: false });
  console.log(`Connected to ${host} as ${user}. Uploading ${localDir} -> ${remoteRoot} ...`);
  await client.uploadFromDir(localDir, remoteRoot);
  console.log(`Done. (uploadFromDir completed without error; ${uploaded} progress events observed)`);
} catch (err) {
  console.error("FTP deploy failed:", err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
