import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CustomFitCalculator from "@/components/CustomFitCalculator";

const siteUrl = "https://indeup.com";
const pageTitle = "맞춤책상 사이즈 제작 가능 여부 확인 | 인디업";
const pageDescription =
  "책상의 가로·세로·높이를 입력하면 인디업에서 제작 가능한 제품과 주문 시 선택해야 할 옵션을 바로 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/custom-fit/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/custom-fit/",
    images: [
      {
        url: "/indeup_series.jpg",
        width: 1500,
        height: 1125,
        alt: "인디업 맞춤 책상",
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
    q: "책상 사이즈는 어떤 순서로 입력하나요?",
    a: "이 페이지의 입력창 순서와 같이 가로, 세로, 높이 순서로 입력하면 됩니다. 모든 값은 mm 단위입니다.",
  },
  {
    q: "10mm 단위로 제작할 수 있나요?",
    a: "네, 인디업은 10mm 단위로 맞춤 제작합니다. 예를 들어 가로 1230mm를 원한다면 1200mm 기본사양에 옵션 +30mm를 추가로 선택하면 됩니다.",
  },
  {
    q: "세로 깊이도 맞춤 제작할 수 있나요?",
    a: "네, 세로(깊이)도 가로와 마찬가지로 기본사양에 옵션을 더하는 방식으로 조정할 수 있습니다. 제품별로 조정 가능한 범위가 달라 이 페이지에서 직접 확인하는 것이 가장 정확합니다.",
  },
  {
    q: "좌식책상 높이도 변경할 수 있나요?",
    a: "네, 좌식책상을 포함한 인디업 책상은 제품별로 지정된 범위 안에서 높이 옵션을 선택할 수 있습니다. 제품마다 조정 가능한 높이 범위가 다르므로 이 페이지에서 사이즈를 입력해 직접 확인해 주세요.",
  },
  {
    q: "제작 가능한 제품이 없다고 나오면 어떻게 하나요?",
    a: "입력한 사이즈를 조금 조정해 다시 확인하거나, 프레임을 별도로 제작할 수 있는지 인디업 고객센터로 문의해 주세요.",
  },
  {
    q: "주문 후 제작 기간은 얼마나 걸리나요?",
    a: "주문 내용 확인 후 제작에 들어가며, 일반적으로 7~8영업일이 필요합니다. 주말과 공휴일은 제작 기간에서 제외되고, 주문량과 제품 사양에 따라 일정이 달라질 수 있습니다.",
  },
];

export default function CustomFitPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "맞춤 제작", item: `${siteUrl}/custom-fit/` },
    ],
  };

  const applicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "인디업 맞춤책상 사이즈 확인",
    description: "가로·세로·높이를 입력해 제작 가능한 인디업 책상과 주문 옵션을 확인하는 도구",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/custom-fit/`,
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
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              맞춤 제작
            </li>
          </ol>
        </nav>

        {/* Intro — intentionally not wrapped in scroll-reveal so PC users see the full hero immediately on load. */}
        <section className="px-6 pb-6 pt-6 sm:px-12 sm:pt-8">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
              Custom Fit
            </p>
            <h1
              className="mt-3 font-bold leading-tight tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.75rem)" }}
            >
              이 사이즈, 제작될까요?
            </h1>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-[var(--color-secondary)] sm:text-base sm:leading-7">
              {"원하는 책상의 가로·세로·높이를 입력하면\n제작 가능한 인디업 제품과 주문할 때 선택해야 할 옵션을 안내해드립니다.\n모든 단위는 mm입니다."}
            </p>
          </div>
        </section>

        {/* Calculator — also kept out of scroll-reveal so it renders in the first viewport with no delay. */}
        <section className="px-6 pb-16 sm:px-12 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <CustomFitCalculator />
          </div>
        </section>

        {/* SEO / AI 검색용 실제 본문 콘텐츠 */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-muted)] px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-12">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">인디업 맞춤책상 사이즈 확인 방법</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-secondary)] sm:text-base">
                  원하는 책상의 가로·세로·높이를 mm 단위로 입력하고 &apos;제작 가능 여부 확인하기&apos;를 누르면,
                  입력한 사이즈로 제작 가능한 인디업 제품과 네이버 공식 스토어에서 주문할 때 선택해야 할 기본사양·옵션을
                  바로 확인할 수 있습니다. 별도의 회원가입이나 상담 없이 이 페이지에서 바로 확인할 수 있습니다.
                </p>
              </div>

              <div id="how-to-measure" className="scroll-mt-24">
                <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">사이즈는 어떻게 측정하나요?</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-secondary)] sm:text-base">
                  책상을 놓을 공간을 줄자로 측정해 가로(좌우 폭), 세로(앞뒤 깊이), 높이(바닥부터 상판까지)를
                  mm 단위로 확인해 주세요. 벽이나 가구 사이에 놓을 예정이라면 여유 공간을 감안해 실제 배치할 자리의
                  최대 폭을 기준으로 측정하는 것이 좋습니다.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">10mm 단위 맞춤은 어떻게 주문하나요?</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-secondary)] sm:text-base">
                  인디업 책상은 10mm 단위로 맞춤 제작됩니다. 예를 들어 가로 1230mm 책상을 원한다면, 1200mm를
                  기본사양으로 선택한 뒤 옵션에서 +30mm를 추가로 선택하면 됩니다. 이 페이지의 결과 카드에도 어떤
                  기본사양과 옵션을 선택해야 하는지 함께 안내됩니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">자주 묻는 질문</h2>
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-[var(--color-border)] px-5 py-4 open:border-[var(--color-brand)]/30 sm:px-6 sm:py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                    <h3 className="text-sm font-semibold tracking-[-0.01em] sm:text-base">{f.q}</h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-light text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-brand)]"
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

        {/* 내부 링크 */}
        <section className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-16">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
              더 알아보기
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base">
              <li>
                <a href="/products/" className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-brand)]">
                  인디업 제품 보기
                </a>
              </li>
              <li>
                <a href="/products/" className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-brand)]">
                  공간별 맞춤책상 선택 가이드
                </a>
              </li>
              <li>
                <a href="/custom-fit/#how-to-measure" className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-brand)]">
                  책상 사이즈 측정 방법
                </a>
              </li>
              <li>
                <a href="/brand/#how-we-make" className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-brand)]">
                  주문·배송·조립 안내
                </a>
              </li>
              <li>
                <a href="/#contact" className="cursor-pointer font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-brand)]">
                  고객지원
                </a>
              </li>
            </ul>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
