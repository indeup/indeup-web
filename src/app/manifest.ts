import type { MetadataRoute } from "next";
import { brandNameKo } from "@/lib/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Both fields deliberately just "인디업" (no " INDEUP" suffix) — mobile
    // "Add to Home Screen" home-screen icon labels have very little width,
    // and a longer name gets ellipsis-truncated into something like
    // "인디업 INDEUP…" instead of showing cleanly.
    name: brandNameKo,
    short_name: brandNameKo,
    description: "공간에 맞춰 가로·세로·높이를 10mm 단위로 제작하는 인디업 맞춤 책상",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
