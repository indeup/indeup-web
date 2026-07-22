import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Pretendard covers Hangul + Latin in one variable file (weight 45–920);
// Outfit/Work Sans have no Hangul glyphs, so Korean text was silently
// falling back to a system font the whole time — this fixes that.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const siteUrl = "https://indeup.com";
const title = "인디업 INDEUP 공식 홈페이지 | 10mm 맞춤 책상";
// Describes only what's actually on the page today (hero, sizing video,
// structure/warranty section) — no mention of guide/product pages that
// don't exist yet, so this stays accurate as the site grows.
const description =
  "인디업(INDEUP)은 공간과 사용 목적에 맞춰 가로·세로·높이를 10mm 단위로 조정해 책상을 제작하는 국내 맞춤 데스크 브랜드입니다. 아연도금 철제 프레임과 3년 무상보증으로 오래 쓰는 책상을 만듭니다.";

// Only rendered when the real value is set via env — an empty/placeholder
// verification string in the shipped HTML would fail the actual site
// ownership check anyway, so there's no reason to leak a fake one.
const otherVerification: Record<string, string> = {
  ...(process.env.BING_SITE_VERIFICATION && {
    "msvalidate.01": process.env.BING_SITE_VERIFICATION,
  }),
  ...(process.env.NAVER_SITE_VERIFICATION && {
    "naver-site-verification": process.env.NAVER_SITE_VERIFICATION,
  }),
};

const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  }),
  ...(Object.keys(otherVerification).length > 0 && {
    other: otherVerification,
  }),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | 인디업 INDEUP",
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "인디업 INDEUP",
    title,
    description,
    url: siteUrl,
    images: [
      {
        url: "/indeup_desk.jpg",
        width: 2752,
        height: 2000,
        alt: "공간에 맞춰 제작한 인디업 책상",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/indeup_desk.jpg"],
  },
  ...(Object.keys(verification).length > 0 && { verification }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "인디업",
    alternateName: "INDEUP",
    legalName: "스니처",
    url: siteUrl,
    logo: `${siteUrl}/INDEUP_LOGO.svg`,
    telephone: "1668-5738",
    address: {
      "@type": "PostalAddress",
      streetAddress: "동북로473번길 385-14",
      addressLocality: "김해시",
      addressRegion: "경남",
      addressCountry: "KR",
    },
    sameAs: [
      "https://brand.naver.com/indeup",
      "https://blog.naver.com/indeup_official",
      "https://indeup.tistory.com/",
      "https://www.youtube.com/@indeup",
      "https://www.instagram.com/indeup.kr",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "인디업",
    alternateName: "INDEUP",
    url: siteUrl,
  };

  return (
    <html lang="ko" className={`${pretendard.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
