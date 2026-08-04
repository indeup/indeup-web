import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import Reveal from "@/components/Reveal";
import { naverStoreUrl } from "@/lib/products";
import { policyData } from "@/lib/policy";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";

const siteUrl = "https://indeup.com";
const naverTalkUrl = "https://talk.naver.com/profile/wcs0s3";
const pageTitle = "고객지원 | 인디업";
const pageDescription =
  "주문·배송 확인, 디지털 보증서, 파손·누락·A/S 문의까지 인디업 고객지원 안내입니다. 네이버 톡톡과 네이버 쇼핑 주문내역을 통해 빠르게 안내받을 수 있습니다.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/support/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/support/",
    images: [
      {
        url: "/indeup_series.jpg",
        width: 1500,
        height: 1125,
        alt: "인디업 고객지원",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/indeup_series.jpg"],
  },
};

const faqs = [
  {
    q: "주문한 제품은 언제 출고되나요?",
    a: "주문 내용 확인 후 제작에 들어가며, 일반적으로 7~8영업일이 필요합니다. 주말과 공휴일은 제작 기간에서 제외되고, 주문량과 제품 사양에 따라 일정이 달라질 수 있습니다.",
  },
  {
    q: "여러 박스가 따로 도착할 수 있나요?",
    a: "무거운 제품은 상판과 프레임 등을 나눠 여러 박스로 분할 배송해, 혼자서도 옮기기 쉽고 엘리베이터가 없는 공간까지 이동이 수월합니다. 박스가 순차적으로 도착하더라도 정상 배송인 경우가 많으니 박스에 표기된 주문정보를 확인해 주시고, 도착 간격이 많이 벌어져 걱정되시면 네이버 톡톡으로 문의해 주세요.",
  },
  {
    q: "배송 중 파손되면 어떻게 하나요?",
    a: "포장 박스와 제품 파손 부위를 사진으로 남겨주신 뒤, 주문자명 또는 주문번호와 함께 네이버 톡톡으로 보내주세요. 배송 중 파손이나 제작 오류로 확인되면 무료로 교환해 드립니다.",
  },
  {
    q: "부품이 누락되었어요.",
    a: "빠진 부품 내역과 함께 받으신 부품 전체 사진을 네이버 톡톡으로 보내주시면 확인 후 무료로 보내드립니다.",
  },
  {
    q: "디지털 보증서는 언제 발급되나요?",
    a: "구매가 완료되면 네이버 N컬렉션 디지털 보증서가 자동으로 발급되며, 네이버 앱 알림으로 안내됩니다. 별도의 회원가입이나 종이 보증서 등록은 필요하지 않습니다.",
  },
  {
    q: "교환·반품은 어디에서 신청하나요?",
    a: "네이버 톡톡으로 고객센터에 문의해 주세요. 가장 빠르게 확인해 드립니다. 배송 파손이나 제작 오류로 확인되면 무료로 교환해 드립니다. 재신 치수와 실제 공간이 맞지 않는 경우에도 최초 1회에 한해 사이즈를 다시 확인한 뒤 무상으로 교환해 드리니 편하게 문의해 주세요. 인디업 책상은 고객님만을 위한 사이즈로 제작하는 맞춤형 상품이라, 단순 변심이나 사용 흔적이 있는 경우의 반품은 어려운 점 양해 부탁드립니다.",
  },
  {
    q: "A/S는 어떻게 접수하나요?",
    a: "인디업 책상은 3년 무상보증을 제공합니다. 주문자명 또는 주문번호와 문제가 발생한 부분의 사진을 준비해 네이버 톡톡으로 문의해 주시면 확인 후 안내해 드립니다.",
  },
];

function TalkTalkIcon() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-[3px]">
      <Image
        src="/naver_talktalk.jpg"
        alt=""
        aria-hidden="true"
        width={22}
        height={22}
        className="h-full w-full rounded-full"
      />
    </span>
  );
}

/** Tap-to-expand intent item — replaces the old "card that scrolls you to
 *  a section further down" pattern. Everything a visitor needs for that
 *  intent now lives right here, so there's nothing to jump to. */
function IntentAccordion({
  id,
  number,
  title,
  description,
  children,
}: {
  id?: string;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-24 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 transition-colors duration-200 open:border-[var(--color-primary)]/40 hover:border-[var(--color-primary)]/30 sm:px-6 sm:py-5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
        <div>
          <span className="text-xs font-semibold tracking-[0.15em] text-[var(--color-primary)]">{number}</span>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em] text-[var(--color-primary)] sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted-foreground)] sm:text-base">{description}</p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 text-xl font-light text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-primary)]"
        >
          +
        </span>
      </summary>
      <div className="mt-4 border-t border-[var(--color-border)] pt-4">{children}</div>
    </details>
  );
}

/** Item 04 has no extra content to expand — it just sends the visitor
 *  straight to Naver Talk Talk, so it stays a plain link row instead of
 *  an accordion with nothing inside it. */
function IntentLinkRow({
  number,
  title,
  description,
  href,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 transition-colors duration-200 hover:border-[var(--color-primary)]/30 sm:px-6 sm:py-5"
    >
      <div>
        <span className="text-xs font-semibold tracking-[0.15em] text-[var(--color-primary)]">{number}</span>
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em] text-[var(--color-primary)] sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-muted-foreground)] sm:text-base">{description}</p>
      </div>
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-primary)] transition-all duration-200 group-hover:translate-x-1 group-hover:border-[var(--color-primary)]/60"
      >
        &rarr;
      </span>
    </a>
  );
}

function ChecklistItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-6 font-medium text-[var(--color-secondary)] sm:text-base">
      <span
        aria-hidden="true"
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
      />
      {children}
    </li>
  );
}

export default function SupportPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "고객지원", item: `${siteUrl}/support/` },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/support/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(contactPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(faqJsonLd) }} />

      <main className="flex-1 text-[var(--color-primary)]">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-[1600px] items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[var(--color-secondary)]">
              고객지원
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-10 pt-10 sm:px-12 sm:pt-14">
          <Reveal className="relative mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
              Support
            </p>
            <h1 className="mt-3 font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              고객지원
            </h1>
            <p className="mt-4 max-w-xl text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
              제품 상담부터 배송 후 문제까지
              <br />
              네이버를 통해 편리하게 안내받을 수 있습니다.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={naverTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--color-primary)] px-6 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-85 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:w-auto"
              >
                <TalkTalkIcon />
                네이버 톡톡 상담하기
              </a>
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/25 px-6 text-base font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:w-auto"
              >
                인디업 공식 스마트스토어
              </a>
            </div>
            <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
              고객센터 상담 가능 시간: {policyData.operatingHours} ({policyData.operatingDays})
            </p>
          </Reveal>
        </section>

        {/* Card sequence — muted canvas with white module cards on mobile
            (matches the home page's own module treatment), reverts to the
            original bordered bands on desktop where this was never the
            complaint. */}
        <div className="space-y-3 bg-[var(--color-muted)] pb-3 pt-3 sm:space-y-0 sm:bg-transparent sm:pb-0 sm:pt-0">
        {/* 문의 유형 — 눌러서 바로 그 자리에서 펼쳐지는 방식. 예전엔 카드를
            누르면 페이지 아래 섹션으로 스크롤 이동했는데, 고객지원 페이지는
            정보를 빨리 찾는 게 전부라 그 이동 자체가 불필요한 마찰이었다. */}
        <section className="relative mx-3 overflow-hidden bg-white px-6 py-10 sm:mx-0 sm:border-t sm:border-[var(--color-border)] sm:px-12 sm:py-16">
          <div className="relative mx-auto max-w-3xl">
            <Reveal>
              <h2 className="font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)" }}>
                어떤 문의로 방문해주셨나요?
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-col gap-3">
              <Reveal delay={0}>
                <IntentAccordion
                  id="order-shipping"
                  number="01"
                  title="주문·배송 확인"
                  description="주문 상태와 배송 정보, 교환·반품 방법을 확인해보세요."
                >
                  <p className="text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">
                    주문 상태와 배송 정보는 네이버 쇼핑 주문내역에서 확인해 주세요.
                  </p>
                  <p className="mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-primary)] sm:text-base">
                    네이버 앱
                    <span aria-hidden="true" className="text-[var(--color-muted-foreground)]">
                      &rarr;
                    </span>
                    쇼핑 MY
                    <span aria-hidden="true" className="text-[var(--color-muted-foreground)]">
                      &rarr;
                    </span>
                    주문·배송
                  </p>
                  <p className="mt-4 text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">
                    배송 파손·제작 오류가 있다면 네이버 톡톡으로 고객센터에 문의해 주세요. 가장 빠르게 안내받으실 수 있습니다. 치수를 잘못 재어 사이즈가 맞지 않는 경우에도 최초 1회에 한해 무상으로 교환해 드리니 문의해 주세요. 인디업 책상은 고객님만을 위한 사이즈로 제작하는 맞춤형 상품이라, 단순 변심이나 사용 흔적이 있는 경우의 반품은 어려운 점 양해 부탁드립니다.
                  </p>
                </IntentAccordion>
              </Reveal>

              <Reveal delay={40}>
                <IntentAccordion
                  id="digital-warranty"
                  number="02"
                  title="디지털 보증서"
                  description="구매 시 발급되는 N컬렉션 디지털 보증서를 안내해드립니다."
                >
                  <p className="text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">
                    구매가 완료되면 네이버 N컬렉션 디지털 보증서가 발급됩니다. 네이버 앱 알림으로 안내되며, 제품 보증 정보를 디지털로 확인할 수 있습니다. 별도의 회원가입이나 종이 보증서 등록은 필요하지 않습니다.
                  </p>
                </IntentAccordion>
              </Reveal>

              <Reveal delay={80}>
                <IntentAccordion
                  id="damage-as"
                  number="03"
                  title="파손·누락·A/S 문의"
                  description="제품 파손, 부품 누락, A/S 접수에 필요한 정보를 확인해보세요."
                >
                  <p className="text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">
                    제품 파손, 부품 누락 또는 A/S가 필요한 경우 주문정보와 사진을 준비해 네이버 톡톡으로 문의해 주세요. 사진은 빠르고 정확한 확인을 위한 절차일 뿐입니다. 배송 파손이나 제작 하자로 확인되면 무료로 교환해 드립니다.
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4 sm:p-5">
                    <ChecklistItem>주문자명 또는 주문번호</ChecklistItem>
                    <ChecklistItem>문제가 발생한 부분의 사진</ChecklistItem>
                    <ChecklistItem>제품 전체 사진</ChecklistItem>
                    <ChecklistItem>배송 파손 시 포장 박스 사진</ChecklistItem>
                  </ul>
                  <a
                    href={naverTalkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--color-primary)] px-6 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:w-auto"
                  >
                    <TalkTalkIcon />
                    네이버 톡톡으로 문의하기
                  </a>
                </IntentAccordion>
              </Reveal>

              <Reveal delay={120}>
                <IntentLinkRow
                  number="04"
                  title="기타 문의"
                  description="위 항목에 없는 내용은 네이버 톡톡으로 바로 문의해주세요."
                  href={naverTalkUrl}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative mx-3 overflow-hidden bg-white px-6 py-10 sm:mx-0 sm:border-t sm:border-[var(--color-border)] sm:px-12 sm:py-16">
          <Reveal className="relative mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">자주 묻는 질문</h2>
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-[var(--color-border)] px-5 py-4 transition-colors duration-200 open:border-[var(--color-primary)]/40 hover:border-[var(--color-primary)]/30 sm:px-6 sm:py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                    <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-primary)] sm:text-base">{f.q}</h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-light text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-primary)]"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
        </div>
      </main>

      <SizeCta />
      <Footer />
    </div>
  );
}
