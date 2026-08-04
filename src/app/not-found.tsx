import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import { naverStoreUrl } from "@/lib/brand";

const links = [
  { label: "홈", href: "/" },
  { label: "제품 전체보기", href: "/products/" },
  { label: "책상 사이즈 가이드", href: "/guide/" },
  { label: "맞춤 제작 방법", href: "/custom-fit/" },
  { label: "고객지원·FAQ", href: "/support/" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[var(--color-primary)]">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">404</p>
        <h1 className="mt-3 max-w-xl font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-4 max-w-md text-base leading-[1.3] text-[var(--color-secondary)]">
          요청하신 주소가 삭제되었거나 변경되었을 수 있습니다. 아래 링크에서 원하시는 정보를 찾아보세요.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={naverStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
          >
            네이버 브랜드스토어
          </a>
        </div>
      </main>
      <SizeCta />
      <Footer />
    </div>
  );
}
