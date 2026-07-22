"use client";

import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { label: "브랜드", href: "/brand/" },
  { label: "제품", href: "/products/" },
  { label: "맞춤 제작", href: "/custom-fit/" },
  { label: "책상 가이드", href: "/guide/" },
  { label: "고객지원", href: "/support/" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-5 sm:px-12">
        <a href="/" className="flex items-center" aria-label="인디업 INDEUP 홈으로">
          <Image src="/INDEUP_LOGO.svg" alt="인디업 INDEUP" width={104} height={37} priority />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="cursor-pointer transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://brand.naver.com/indeup"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full border border-[var(--color-brand)] bg-[var(--color-brand)] px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)]"
          >
            공식 스토어
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-9 w-9 cursor-pointer items-center justify-center lg:hidden"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-[var(--color-border)] px-6 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer py-3 text-base font-medium transition-opacity hover:opacity-60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
