import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionNav from "@/components/SectionNav";
import TextReveal from "@/components/TextReveal";

const siteUrl = "https://indeup.com";
const naverStoreUrl = "https://brand.naver.com/indeup";
const pageTitle = "인디업 브랜드 소개 | 공간에 맞춘 10mm 맞춤 책상";
const pageDescription =
  "인디업(INDEUP)은 책상을 직접 제조하고 판매하는 국내 데스크 브랜드입니다. 공간과 사용 목적에 맞춰 가로·깊이·높이를 조정하고, 철제 프레임 제작부터 도장·검수·출고까지 직접 관리합니다.";
const ogTitle = "인디업(INDEUP) 브랜드 소개";
const ogDescription =
  "줄자로 잰 공간과 사용하는 방식에 맞춰 책상을 제작하는 국내 맞춤 데스크 브랜드, 인디업을 소개합니다.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/brand/",
  },
  openGraph: {
    type: "website",
    title: ogTitle,
    description: ogDescription,
    url: "/brand/",
    images: [
      {
        url: "/indeup_desk.jpg",
        width: 2752,
        height: 2000,
        alt: "인디업이 제작한 맞춤 책상",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/indeup_desk.jpg"],
  },
};

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
      {children}
    </p>
  );
}

function InlineLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="cursor-pointer border-b border-[var(--color-primary)]/30 font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
    >
      {children}
    </a>
  );
}

function ArrowButton({ href, children, primary, external }: { href: string; children: ReactNode; primary?: boolean; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 ${
        primary
          ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]"
          : "border border-[var(--color-primary)]/25 text-[var(--color-primary)] hover:border-[var(--color-primary)]"
      }`}
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

const makerSellerPoints = [
  { title: "직접 상담", body: "고객이 사용할 공간과 필요한 책상 크기를 확인합니다." },
  { title: "직접 제작", body: "주문 내용에 맞춰 프레임과 상판을 준비하고 제작합니다." },
  { title: "직접 검수", body: "사이즈, 마감, 부품과 포장 상태를 확인한 뒤 출고합니다." },
  { title: "직접 고객지원", body: "제품을 가장 잘 아는 제조사가 상담과 사후지원을 담당합니다." },
];

const dimensionPoints = [
  { title: "가로", body: "벽면 길이와 사용 장비를 고려해 제품별 범위 안에서 조정" },
  { title: "깊이", body: "모니터, 노트북, 키보드와 통로 공간을 고려해 선택" },
  { title: "높이", body: "일반 책상, 좌식, 홈바 등 사용 방식에 맞춰 조정" },
  { title: "전선홀과 옵션", body: "설치 환경과 전선 방향에 따라 선택 가능" },
];

const qualityStandards = [
  {
    num: "01",
    title: "철제 프레임",
    body: "상판 아래 철제 프레임이 책상 전체를 안정적으로 지지합니다. 프레임의 구조와 보강 위치를 고려해 사용 중 발생하는 흔들림을 줄이는 데 집중합니다.",
  },
  {
    num: "02",
    title: "풀용접과 안전 마감",
    body: "프레임 연결 부위를 용접한 뒤 용접 과정에서 발생한 거친 부분과 모서리를 직접 확인하고 다듬습니다. 제품 사용 중 손이 닿을 수 있는 부분까지 점검합니다.",
  },
  {
    num: "03",
    title: "분체도장",
    body: "프레임 표면은 분체도장 후 고온에서 경화합니다. 도장 상태와 표면 마감을 확인해 오랫동안 깔끔하게 사용할 수 있도록 관리합니다.",
  },
  {
    num: "04",
    title: "18mm E0 LPM 상판",
    body: "18mm 두께의 E0 LPM 상판을 사용합니다. 상판 아래 프레임이 함께 지지하도록 설계해 일상적인 업무와 컴퓨터 작업에 안정적으로 사용할 수 있도록 제작합니다.",
  },
  {
    num: "05",
    title: "수평 조절발",
    body: "바닥의 미세한 높이 차이를 조정할 수 있도록 회전형 조절발을 기본으로 적용합니다.",
  },
  {
    num: "06",
    title: "3년 무상보증",
    body: null, // rendered separately to embed the /#contact link
  },
];

const processSteps = [
  {
    num: "01",
    title: "공간과 사용 목적 확인",
    body: "고객이 책상을 놓을 공간, 사용하는 모니터와 장비, 필요한 가로·깊이·높이와 옵션을 확인합니다.",
  },
  {
    num: "02",
    title: "주문 내용 확인",
    body: "선택한 사이즈, 상판 색상, 프레임 색상, 전선홀과 추가 옵션을 제작 전에 확인합니다.",
  },
  {
    num: "03",
    title: "프레임 제작과 마감",
    body: "프레임을 가공하고 용접한 뒤, 모서리와 용접 부위를 다듬어 도장을 준비합니다.",
  },
  {
    num: "04",
    title: "분체도장",
    body: "프레임에 분체도장을 적용하고 고온에서 경화해 표면을 마감합니다.",
  },
  {
    num: "05",
    title: "상판과 부품 준비",
    body: "주문 내용에 맞는 상판과 조립 부품을 준비합니다.",
  },
  {
    num: "06",
    title: "최종 검수와 포장",
    body: "사이즈와 구성품, 마감과 포장 상태를 확인한 뒤 제품을 분할 포장하여 출고합니다.",
  },
];

const collection = [
  { title: "1인용 책상", body: "원룸, 작은 방, 서재와 홈오피스를 위한 맞춤형 개인 책상" },
  { title: "2인용 책상", body: "부부, 커플과 두 사람이 함께 사용하는 넓고 안정적인 책상" },
  { title: "좌식 책상", body: "바닥 생활과 좌식 작업 환경에 맞춘 낮은 높이의 책상" },
  { title: "사이드테이블", body: "소파 옆, 침대 옆과 틈새 공간에 필요한 슬림한 보조 테이블" },
  { title: "홈바테이블", body: "홈바, 작업대와 공간 분리 용도로 사용하는 높은 테이블" },
];

const experienceCases = [
  "깊이를 줄인 좁은 거실 사례",
  "넓은 2인용 책상을 선택한 부부 사례",
  "진동을 고려한 작업 장비 사례",
];

function BlogIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h9L20 7.5V19a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
      <path d="M8 12h8M8 15.5h5" />
    </svg>
  );
}

function TistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 6h14" />
      <path d="M12 6v13" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const channels = [
  {
    title: "네이버 블로그",
    body: "책상 사이즈와 선택 방법, 실제 설치 사례",
    href: "https://blog.naver.com/indeup_official",
    Icon: BlogIcon,
  },
  {
    title: "티스토리",
    body: "구글·빙·다음 검색을 위한 책상 가이드 콘텐츠",
    href: "https://indeup.tistory.com/",
    Icon: TistoryIcon,
  },
  {
    title: "유튜브",
    body: "책상 구조, 제작 과정, 조립과 사용 영상",
    href: "https://www.youtube.com/@indeup",
    Icon: YoutubeIcon,
  },
  {
    title: "인스타그램",
    body: "제품 이미지, 설치 사례와 브랜드 콘텐츠",
    href: "https://www.instagram.com/indeup.kr",
    Icon: InstagramIcon,
  },
];

const faqs = [
  {
    q: "인디업은 어떤 브랜드인가요?",
    a: "인디업(INDEUP)은 공간과 사용 목적에 맞춰 책상을 직접 제조하고 판매하는 국내 맞춤 데스크 브랜드입니다. 운영사 스니처가 제품 상담, 제작, 검수, 판매와 고객지원을 관리합니다.",
  },
  {
    q: "인디업은 제조사인가요, 판매사인가요?",
    a: "인디업은 책상을 직접 제작하면서 공식 판매 채널을 통해 고객에게 판매하는 제조사 겸 판매사입니다. 고객의 요청을 제작 과정에 직접 반영하고 출고 전 제품을 검수합니다.",
  },
  {
    q: "10mm 맞춤 책상이란 무엇인가요?",
    a: "제품별 제작 가능 범위 안에서 가로와 높이를 10mm 단위로 조정해 제작할 수 있는 책상입니다. 깊이와 옵션의 선택 단위는 제품에 따라 다르므로, 주문 전 각 제품의 선택 범위를 확인해야 합니다.",
  },
  {
    q: "인디업 제품은 어디에서 구매할 수 있나요?",
    a: "인디업 제품은 연결된 네이버 공식 브랜드스토어에서 구매할 수 있습니다. 공식 홈페이지에서는 브랜드, 제작 방식, 제품과 책상 가이드 정보를 확인할 수 있습니다.",
  },
  {
    q: "제품은 주문 후 바로 출고되나요?",
    a: "인디업 책상은 주문 내용을 확인한 뒤 제작하는 제품으로, 일반적으로 7~8영업일의 제작 기간이 필요합니다. 제품 사양과 주문량에 따라 일정은 달라질 수 있습니다.",
  },
  {
    q: "보증기간은 얼마나 되나요?",
    a: "인디업 책상은 3년 무상보증을 제공합니다. 보증 대상과 적용 조건은 고객지원 페이지의 보증 안내에서 확인할 수 있습니다.",
  },
];

export default function BrandPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "브랜드", item: `${siteUrl}/brand/` },
    ],
  };

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

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/brand/`,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
    breadcrumb: { "@id": `${siteUrl}/brand/#breadcrumb` },
  };

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />
      <SectionNav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-3 sm:px-12">
          <ol className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              브랜드
            </li>
          </ol>
        </nav>

        {/* 1. Hero — stacked statement + full-width film */}
        <section id="hero" className="px-6 pb-14 pt-12 sm:px-12 sm:pb-20 sm:pt-16">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>About Indeup</Eyebrow>
              <h1
                className="mt-5 font-bold leading-[1.08] tracking-[-0.03em]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              >
                공간에 맞는 책상을
                <br />
                직접 만들고 판매합니다.
              </h1>
              <TextReveal
                text="인디업(INDEUP)은 책상의 기획, 제작, 검수, 판매와 고객 상담까지 직접 관리하는 국내 데스크 브랜드입니다."
                highlight="인디업(INDEUP)은"
                className="mt-6 max-w-xl text-base leading-7 text-[var(--color-secondary)] sm:text-lg"
              />
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                정해진 규격에 고객의 공간을 맞추기보다, 실제로 책상을 놓을 자리와 사용하는 장비, 생활 방식에 맞춰
                가로·깊이·높이를 세밀하게 조정해 제작합니다.
              </p>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 tracking-[-0.01em] sm:text-xl">
                줄자로 잰 사이즈 그대로,
                <br />
                공간에 가까운 책상을 만듭니다.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["국내 제조·판매", "10mm 맞춤 제작", "3년 무상보증"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-semibold tracking-[-0.01em] text-[var(--color-secondary)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-16 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <video
                className="h-full w-full object-cover"
                style={{ aspectRatio: "16 / 9" }}
                src="/videos/indeup-film.mp4"
                poster="/indeup_desk.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="인디업 책상이 놓인 공간을 보여주는 브랜드 필름"
              />
            </div>
          </Reveal>
        </section>

        {/* 2. WHO WE ARE — split editorial: heading left, flowing copy right */}
        <section id="who-we-are" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:gap-16">
              <div>
                <Eyebrow>Who We Are</Eyebrow>
                <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                  인디업은 어떤
                  <br />
                  브랜드인가요?
                </h2>
              </div>
              <div className="flex flex-col gap-3.5 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                <p className="font-medium text-[var(--color-primary)]">
                  인디업은 공간과 사용 목적에 맞춰 책상을 직접 제조하고 판매하는 국내 맞춤 데스크 브랜드입니다.
                </p>
                <p>
                  인디업은 이미 완성된 규격 제품을 단순히 유통하는 판매점이 아닙니다. 책상을 사용하는 공간과 고객의
                  요청을 확인하고, 제품의 크기와 구조를 결정한 뒤 제작과 검수 과정을 거쳐 출고합니다.
                </p>
                <p>
                  운영사 스니처는 인디업 브랜드를 통해 1인용 책상, 2인용 책상, 좌식 책상, 사이드테이블, 홈바테이블과
                  프레임 제품을 제조·판매하고 있습니다.
                </p>
                <p>
                  고객 상담에서 확인된 사용 목적과 공간 조건은 제품 제작과 새로운 옵션을 개선하는 자료로 활용됩니다.
                  판매 이후의 의견까지 제품에 반영하는 것이 인디업이 제조와 판매를 함께 운영하는 이유입니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. MAKER & SELLER — horizontal flow ribbon */}
        <section id="maker-seller" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>Maker &amp; Seller</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                만드는 사람과 설명하는 사람이 같습니다.
              </h2>
              <div className="mt-4 flex flex-col gap-3.5 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                <p>인디업은 제조와 판매가 분리되지 않습니다.</p>
                <p>
                  제품을 직접 만드는 과정과 고객에게 제품을 설명하는 과정이 하나로 이어져 있기 때문에, 상담 단계에서
                  확인한 요청을 제작 과정에 정확하게 전달할 수 있습니다.
                </p>
                <p>
                  가로·깊이·높이, 전선홀 위치, 프레임 색상과 사용 목적처럼 제품 선택에 필요한 정보를 고객과 직접
                  확인하고, 제작 후에는 주문 내용과 제품 상태를 다시 검수합니다.
                </p>
                <p>
                  중간 유통 단계에만 의존하지 않고 상담, 제작, 도장, 검수, 포장, 출고와 고객지원을 직접 관리해 제품
                  정보와 실제 제작 결과의 차이를 줄이는 것을 중요하게 생각합니다.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-4">
              {makerSellerPoints.map((p, i) => (
                <div
                  key={p.title}
                  className={`border-[var(--color-primary)]/15 py-5 sm:py-1 ${
                    i === 0 ? "border-t sm:border-t-0" : "border-t"
                  } sm:border-t-0 sm:border-l sm:pl-6 ${i === 0 ? "sm:pl-0" : ""}`}
                >
                  <span className="text-xs font-bold tracking-[0.1em] text-[var(--color-brand)]">
                    STEP 0{i + 1}
                  </span>
                  <h3 className="mt-1.5 font-bold tracking-[-0.01em]">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)]">{p.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 4. MADE TO FIT — split: narrative left, worked example + quote right */}
        <section id="made-to-fit" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow>Made to Fit</Eyebrow>
                <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                  인디업의 10mm 맞춤 책상이란 무엇인가요?
                </h2>
                <div className="mt-4 flex flex-col gap-3.5 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                  <p className="font-medium text-[var(--color-primary)]">
                    인디업의 10mm 맞춤 책상은 정해진 규격만 고르는 방식이 아니라, 제품별 선택 범위 안에서 가로와
                    높이를 10mm 단위로 조정해 제작하는 책상입니다.
                  </p>
                  <p>
                    인디업은 이러한 문제를 줄이기 위해 제품별 제작 가능 범위 안에서 공간에 가까운 크기를 선택할 수
                    있도록 합니다.
                  </p>
                  <p>
                    깊이는 제품과 옵션에 따라 정해진 단위로 선택하며, 가로와 높이의 세부 조정 가능 범위는 제품마다
                    다를 수 있습니다. 모든 치수가 10mm 단위로 조정된다는 의미가 아니라, 제품별 제작 가능 범위와
                    옵션에 따라 조정 가능하다는 뜻입니다.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
                    예를 들어
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                    책상을 놓을 벽면 길이가{" "}
                    <strong className="font-bold text-[var(--color-brand)]">1230mm</strong>인데 판매되는 제품이
                    1200mm와 1400mm뿐이라면, 한쪽에는 불필요한 공간이 남거나 제품이 자리에 들어가지 않을 수
                    있습니다.
                  </p>
                </div>
                <p className="text-lg font-semibold leading-8 tracking-[-0.01em] sm:text-xl">
                  책상에 공간을 맞추지 않고,
                  <br />
                  공간에 책상을 맞춥니다.
                </p>
              </div>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {dimensionPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)]"
                >
                  <dt className="font-semibold text-[var(--color-primary)]">{p.title}</dt>
                  <dd className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)]">{p.body}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm text-[var(--color-muted-foreground)]">
              제품별 조정 가능 범위는 <InlineLink href="/#custom">맞춤 제작 소개</InlineLink>에서 더 확인할 수
              있습니다.
            </p>
          </Reveal>
        </section>

        {/* 5. OUR STANDARD — asymmetric bento, 3-year card featured */}
        <section id="our-standard" className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-14 text-white sm:px-12 sm:py-20">
          <Reveal className="relative mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>
                <span className="text-white/50">Our Standard</span>
              </Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                오래 사용하는 책상은
                <br />
                보이지 않는 구조부터 달라야 합니다.
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-base leading-7 text-white/70 sm:text-lg">
                <p>인디업은 책상의 외형뿐 아니라 상판 아래 구조와 프레임의 연결 방식까지 중요하게 생각합니다.</p>
                <p>
                  타이핑, 모니터 사용, 재봉틀과 작업 장비처럼 반복적인 움직임이 발생하는 환경에서도 흔들림을 줄이고
                  안정적으로 사용할 수 있도록 제작합니다.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {qualityStandards.map((s) => (
                <div
                  key={s.num}
                  className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    s.num === "06"
                      ? "border-[var(--color-brand-light)]/40 bg-[var(--color-brand)]/20 hover:bg-[var(--color-brand)]/25"
                      : "border-white/10 bg-white/[0.04] hover:border-[var(--color-brand-light)]/40 hover:bg-white/[0.07]"
                  }`}
                >
                  {s.num === "06" ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-extrabold leading-none text-[var(--color-brand-light)] sm:text-6xl">
                        3
                      </span>
                      <h3 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">년 무상보증</h3>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-[var(--color-brand-light)]">{s.num}</span>
                      <h3 className="mt-1 text-xl font-bold tracking-[-0.01em] sm:text-2xl">{s.title}</h3>
                    </>
                  )}
                  <p className="mt-2 text-base leading-7 text-white/70">
                    {s.body ?? (
                      <>
                        보증 범위와 적용 조건은 제품 및{" "}
                        <a
                          href="/#contact"
                          className="cursor-pointer border-b border-white/40 font-medium text-white transition-colors duration-200 hover:border-[var(--color-brand-light)] hover:text-[var(--color-brand-light)]"
                        >
                          고객지원 안내
                        </a>
                        에서 확인할 수 있습니다.
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 6. HOW WE MAKE — connected vertical timeline */}
        <section id="how-we-make" className="px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>How We Make</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                한 대의 책상이 완성되는 과정
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                인디업의 주문 제작 책상은 상담과 주문 확인부터 제작, 도장, 검수와 포장을 거쳐 출고됩니다.
              </p>
            </div>

            <div className="relative mt-10 max-w-2xl">
              <div className="absolute bottom-5 left-5 top-5 w-px bg-[var(--color-border)]" aria-hidden="true" />
              <ol className="flex flex-col gap-8">
                {processSteps.map((s) => (
                  <li key={s.num} className="relative flex gap-5">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-white">
                      {s.num}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="text-lg font-bold tracking-[-0.01em]">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-8 max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">
              주문 제작 제품은 일반적으로 제작에 7~8영업일이 필요합니다. 주말과 공휴일은 제작 기간에서 제외되며,
              주문량과 제품 사양에 따라 일정이 달라질 수 있습니다.
            </p>
          </Reveal>
        </section>

        {/* 7. OFFICIAL BRAND — trust badge + CTA */}
        <section id="official-brand" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>Official Brand</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                공식 상표와 공식 판매 채널로 운영합니다.
              </h2>
              <div className="mt-4 flex flex-col gap-3.5 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                <TextReveal
                  text="인디업(INDEUP)은 운영사 스니처가 보유하고 사용하는 브랜드 상표입니다."
                  highlight="인디업(INDEUP)은"
                />
                <p>
                  인디업은 네이버 브랜드스토어의 공식 브랜드로 운영되며, 공식 판매처를 통해 제품 정보, 주문, 상담과
                  고객지원을 제공합니다.
                </p>
                <p>
                  홈페이지는 인디업 브랜드와 제품 정보를 안내하는 공식 사이트이며, 실제 제품 구매는 연결된 네이버
                  공식 브랜드스토어에서 진행됩니다.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                  <ShieldCheckIcon />
                </span>
                <span>
                  <p className="text-sm font-bold text-[var(--color-primary)]">네이버 브랜드스토어 공식 브랜드</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">운영사 스니처 · 인디업(INDEUP)</p>
                </span>
              </div>
              <ArrowButton href={naverStoreUrl} primary external>
                공식 스토어 방문하기
              </ArrowButton>
            </div>
            <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
              인디업 상품은 공식 판매처에서 제품 정보와 판매자 정보를 확인한 뒤 구매해 주세요.
            </p>
          </Reveal>
        </section>

        {/* 8. OUR COLLECTION — horizontal scroll carousel */}
        <section id="our-collection" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>Our Collection</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                공간과 사용하는 방식에 따라
                <br />
                다섯 가지 책상을 제안합니다.
              </h2>
            </div>

            <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {collection.map((c) => (
                <div
                  key={c.title}
                  className="w-[240px] shrink-0 snap-start rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
                >
                  <h3 className="text-lg font-bold tracking-[-0.01em]">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--color-secondary)]">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <ArrowButton href={naverStoreUrl} external>
                인디업 제품 전체 보기
              </ArrowButton>
            </div>
          </Reveal>
        </section>

        {/* 9. OUR PRINCIPLE — manifesto split: big heading left, statement right */}
        <section id="our-principle" className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-14 text-white sm:px-12 sm:py-20">
          <Reveal className="relative mx-auto max-w-6xl">
            <Eyebrow>
              <span className="text-white/50">Our Principle</span>
            </Eyebrow>
            <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <h2
                className="font-bold leading-[1.15] tracking-[-0.03em]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
              >
                더 많이 만들기보다,
                <br />
                더 잘 맞는 책상을
                <br />
                만듭니다.
              </h2>
              <div>
                <div className="flex flex-col gap-3.5 text-base leading-7 text-white/70 sm:text-lg">
                  <p>모든 공간은 같은 크기가 아니고, 책상을 사용하는 사람의 자세와 장비도 모두 다릅니다.</p>
                  <p>
                    인디업은 많이 판매되는 한 가지 규격을 정답으로 제안하기보다, 고객이 실제로 사용할 공간과 목적에
                    가까운 선택지를 제공하려고 합니다.
                  </p>
                  <p>
                    필요 이상으로 크지 않고, 사용하기에 부족하지 않으며, 오래 사용할 수 있는 구조를 갖춘 책상.
                  </p>
                  <p>
                    인디업이 생각하는 좋은 책상은 눈에 띄는 기능이 많은 책상이 아니라, 매일 사용하는 공간에
                    자연스럽게 잘 맞는 책상입니다.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/15 pt-6">
                  <p className="text-2xl font-bold leading-tight tracking-[-0.02em] text-[var(--color-brand-light)] sm:text-3xl">
                    줄자로 잰 사이즈 그대로 제작.
                  </p>
                  <p className="mt-2 text-base leading-7 text-white/60">
                    흔들림은 줄이고,
                    <br />
                    공간 활용은 더 좋게.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 10. BUILT WITH EXPERIENCE — narrative + example chips */}
        <section id="experience" className="px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>Built with Experience</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                실제 사용 경험을
                <br />
                다음 책상에 반영합니다.
              </h2>
              <div className="mt-4 flex flex-col gap-3.5 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                <p>인디업은 고객 상담과 구매 후기에서 제품을 사용하는 공간과 목적을 확인합니다.</p>
                <p>
                  좁은 거실의 통로를 확보하기 위해 깊이를 줄인 사례, 부부가 함께 사용하기 위해 넓은 2인용 책상을
                  선택한 사례, 재봉틀과 작업 장비의 진동을 고려한 사례처럼 고객의 실제 사용 환경은 제품을 개선하는
                  중요한 기준이 됩니다.
                </p>
                <p>
                  제품의 장점뿐 아니라 조립, 배송, 옵션과 사용 중 불편했던 점도 확인하고, 설명과 제작 과정에
                  반영합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {experienceCases.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-secondary)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 11. OFFICIAL CHANNELS — single-row ribbon on large screens */}
        <section id="channels" className="border-t border-[var(--color-border)] px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <Eyebrow>Official Channels</Eyebrow>
              <h2 className="mt-4 font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
                인디업의 공식 콘텐츠를 확인하세요.
              </h2>
              <p className="mt-6 text-base leading-7 text-[var(--color-secondary)] sm:text-lg">
                책상 사이즈 가이드, 제작 과정, 실제 설치 사례와 브랜드 영상은 인디업의 공식 채널을 통해 소개합니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)]/20 text-[var(--color-primary)] transition-colors duration-200 group-hover:border-[var(--color-brand)] group-hover:text-[var(--color-brand)]">
                    <c.Icon />
                  </span>
                  <span>
                    <h3 className="font-bold tracking-[-0.01em] text-[var(--color-primary)] transition-colors duration-200 group-hover:text-[var(--color-brand)]">
                      {c.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-6 text-[var(--color-secondary)]">{c.body}</p>
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-6 max-w-xl text-xs leading-6 text-[var(--color-muted-foreground)]">
              본 페이지에 소개되는 일부 영상과 이미지는 제작·편집 과정에서 인공지능(AI) 기술이 활용되었을 수
              있습니다.
            </p>
          </Reveal>
        </section>

        {/* 12. Final CTA — centered close */}
        <section className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <Reveal className="relative mx-auto max-w-2xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              공간을 재셨다면,
              <br />
              이제 책상을 맞출 차례입니다.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
              사용할 공간과 필요한 크기를 확인하고 인디업의 제품과 제작 방식을 살펴보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ArrowButton href={naverStoreUrl} primary external>
                제품 보기
              </ArrowButton>
              <a
                href="/#custom"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white"
              >
                맞춤 제작 알아보기
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href={naverStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white"
              >
                공식 스토어 방문하기
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Reveal>
        </section>

        {/* 13. FAQ — two columns on large screens */}
        <section id="faq" className="px-6 py-14 sm:px-12 sm:py-20">
          <Reveal className="mx-auto max-w-6xl">
            <h2 className="font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              인디업 브랜드에 대해 자주 묻는 질문
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 transition-colors duration-300 open:border-[var(--color-brand)]/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-primary)] marker:content-none">
                    <h3 className="text-base sm:text-lg">{item.q}</h3>
                    <span
                      className="shrink-0 text-xl font-normal text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45 group-open:text-[var(--color-brand)]"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-secondary)] sm:text-base">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
