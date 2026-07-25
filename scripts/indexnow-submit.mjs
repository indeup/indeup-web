// Submits specific changed URLs to IndexNow (Bing + participating engines
// pick this up; Naver/Google do not currently consume IndexNow, so this is
// one signal among several, not a replacement for sitemap/RSS submission).
//
// Usage:
//   node scripts/indexnow-submit.mjs https://indeup.com/guide/ https://indeup.com/guide/some-article/
//
// Deliberately takes an explicit URL list rather than "submit everything" —
// resubmitting the whole sitemap on every deploy is exactly what IndexNow's
// own guidelines ask sites not to do.

const KEY = "46a0a0be398a58ed1e9f600d2283a7da";
const HOST = "indeup.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Usage: node scripts/indexnow-submit.mjs <url> [url...]");
  process.exit(1);
}

const invalid = urls.filter((u) => {
  try {
    return new URL(u).host !== HOST;
  } catch {
    return true;
  }
});
if (invalid.length > 0) {
  console.error("Refusing to submit URLs outside this site:", invalid);
  process.exit(1);
}

async function main() {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  console.log(`IndexNow submit: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("IndexNow response body:", text);
    process.exit(1);
  }
  console.log(`Submitted ${urls.length} URL(s):`, urls.join(", "));
}

main().catch((err) => {
  console.error("IndexNow submit failed:", err.message);
  process.exit(1);
});
