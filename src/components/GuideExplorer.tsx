"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import CardScroller from "@/components/CardScroller";
import QuickSizeFinder from "@/components/QuickSizeFinder";
import Reveal from "@/components/Reveal";
import { guideArticles, type GuideArticle } from "@/lib/guideArticles";
import { matchesFilter, EMPTY_FILTER, type GuideFilter } from "@/lib/guideSearch";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArticleCard({ article }: { article: GuideArticle }) {
  return (
    <a
      href={`/guide/${article.slug}/`}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-7"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]">
        {article.categories[0]}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-6 tracking-[-0.01em] text-[var(--color-primary)] sm:text-xl">
        {article.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-secondary)] sm:text-base">{article.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
        가이드 보기
        <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
    </a>
  );
}

function FeedSection({
  id,
  title,
  sourceLabel,
  sourceHref,
  children,
}: {
  id: string;
  title: string;
  sourceLabel?: string;
  sourceHref?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--color-border)] px-6 py-16 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{title}</h2>
          {sourceLabel && sourceHref && (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 cursor-pointer border-b border-[var(--color-border)] pb-0.5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {sourceLabel}
            </a>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function GuideExplorer() {
  const [filter, setFilter] = useState<GuideFilter>(EMPTY_FILTER);
  const [searchNotice, setSearchNotice] = useState<string | null>(null);

  const filteredArticles = guideArticles.filter((a) =>
    matchesFilter(filter, `${a.title} ${a.description}`, a.categories)
  );

  // Filtering already happens live on every keystroke — Enter/the search
  // button gives a clear "your search landed" signal: jump to the matching
  // guides if there are any, or say plainly that the keyword had no match
  // instead of silently scrolling to an empty section.
  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const query = filter.query.trim();
    if (!query) {
      setSearchNotice(null);
      return;
    }
    if (filteredArticles.length > 0) {
      setSearchNotice(null);
      document.getElementById("own-guides")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setSearchNotice(`'${query}'에 해당하는 책상 가이드를 찾지 못했습니다. 다른 검색어로 다시 시도해보세요.`);
    }
  }

  return (
    <>
      {/* Hero title — comes first now, so a visitor lands on page context
          before the interactive calculator, not the other way around. */}
      <section className="px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-[1600px]">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
            Guide
          </p>
          <h1 className="mt-3 max-w-2xl font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
            책상 사이즈·배치 가이드
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
            원룸 책상, 컴퓨터 책상, 2인용 책상까지 — 가로·깊이·높이와 공간 배치를{" "}
            <br className="hidden sm:block" />
            인디업 가이드에서 한 번에 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Search + category filters */}
      <section className="px-6 pb-10 sm:px-12">
        <div className="mx-auto max-w-[1600px]">
          <form onSubmit={handleSearchSubmit} role="search" className="relative max-w-xl">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={filter.query}
              onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              placeholder="책상 크기, 깊이, 높이, 배치 방법을 검색해보세요."
              aria-label="책상 가이드 검색"
              className="h-[52px] w-full rounded-full border border-[var(--color-border)] pl-11 pr-14 text-sm outline-none transition-colors focus:border-[var(--color-primary)] sm:text-base"
            />
            <button
              type="submit"
              aria-label="검색 결과로 이동"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-opacity duration-200 hover:opacity-85"
            >
              <SearchIcon />
            </button>
          </form>
          {searchNotice && (
            <p role="status" className="mt-2 max-w-xl text-sm text-[var(--color-muted-foreground)]">
              {searchNotice}
            </p>
          )}
        </div>
      </section>

      {/* 내 공간 책상 사이즈 계산기 */}
      <FeedSection id="quick-size" title="내 공간 책상 사이즈 계산기">
        <Reveal>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-secondary)] sm:text-base">
            설치 공간과 벽면 구조, 사용 방식을 입력하면 실제 제작 가능한 사이즈 안에서 이 공간에 맞는 권장
            사이즈를 계산해 드립니다.
          </p>
          <div className="mt-6">
            <QuickSizeFinder />
          </div>
        </Reveal>
      </FeedSection>

      {/* 자체 가이드 */}
      <FeedSection id="own-guides" title="가장 많이 찾는 책상 가이드">
        <Reveal>
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center sm:p-10">
              <p className="text-sm text-[var(--color-muted-foreground)] sm:text-base">
                검색 조건에 맞는 가이드를 찾지 못했습니다. 다른 검색어나 카테고리를 선택해보세요.
              </p>
            </div>
          ) : (
            <CardScroller
              items={filteredArticles}
              keyFor={(a) => a.slug}
              renderItem={(a) => <ArticleCard article={a} />}
            />
          )}
        </Reveal>
      </FeedSection>
    </>
  );
}
