import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";
import {
  siteUrl,
  brandNameKo,
  brandNameEn,
  legalName,
  supportPhone,
  businessAddress,
  logoUrl,
  officialChannels,
} from "@/lib/brand";

// Pretendard covers Hangul + Latin in one variable file (weight 45–920);
// Outfit/Work Sans have no Hangul glyphs, so Korean text was silently
// falling back to a system font the whole time — this fixes that.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

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
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: brandNameKo,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    // Real desk-size numbers throughout the site ("720mm", "1200mm") were
    // getting linkified as tap-to-call phone numbers on iOS Safari.
    telephone: false,
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

// Analytics IDs, same "only render when a real value is set via env"
// discipline as the search-console verification tags above — no fake IDs
// shipped in the static HTML.
const gaId = process.env.GA_MEASUREMENT_ID;
const clarityId = process.env.CLARITY_PROJECT_ID;
const naverAnalyticsId = process.env.NAVER_ANALYTICS_ID;

// Explicit rather than relying on the Next.js default: sets a real
// device-width viewport for every phone/tablet, keeps pinch-zoom available
// (never disable it — it's an accessibility requirement), and colors the
// mobile browser's own address bar / status bar with the brand red so the
// chrome doesn't read as a plain default-gray browser window.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b32a2a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandNameKo,
    alternateName: brandNameEn,
    legalName,
    url: siteUrl,
    logo: logoUrl,
    telephone: supportPhone,
    address: {
      "@type": "PostalAddress",
      ...businessAddress,
    },
    sameAs: [...officialChannels],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandNameKo,
    alternateName: brandNameEn,
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

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        )}

        {clarityId && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}

        {naverAnalyticsId && (
          <>
            <Script src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
            <Script id="naver-analytics-init" strategy="afterInteractive">
              {`if (!window.wcs_add) window.wcs_add = {};
                window.wcs_add["wa"] = "${naverAnalyticsId}";
                if (window.wcs) { wcs.inflow(); wcs_do(); }`}
            </Script>
          </>
        )}
      </head>
      <body className="flex min-h-dvh flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
