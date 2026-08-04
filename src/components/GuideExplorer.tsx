"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import CardScroller from "@/components/CardScroller";
import QuickSizeFinder from "@/components/QuickSizeFinder";
import Reveal from "@/components/Reveal";
import { guideArticles, GUIDE_CATEGORIES, type GuideArticle } from "@/lib/guideArticles";
import { matchesFilter, EMPTY_FILTER, type GuideFilter } from "@/lib/guideSearch";

// 3 columns x 3 rows on desktop — the "모두 보기" page size.
const PAGE_SIZE = 9;

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
  actionLabel,
  onAction,
  children,
}: {
  id: string;
  title: string;
  sourceLabel?: string;
  sourceHref?: string;
  actionLabel?: string;
  onAction?: () => void;
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
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="shrink-0 cursor-pointer border-b border-[var(--color-border)] pb-0.5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="가이드 목록 페이지" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        &larr;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ${
            p === page
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-secondary)] hover:bg-[var(--color-muted)]"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        &rarr;
      </button>
    </nav>
  );
}

export default function GuideExplorer() {
  const [filter, setFilter] = useState<GuideFilter>(EMPTY_FILTER);
  const [searchNotice, setSearchNotice] = useState<string | null>(null);
  // "모두 보기" toggle — default view is the compact slide/carousel; once
  // expanded (or once a search/category filter narrows the list), it
  // switches to a real paginated grid instead.
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);

  const filteredArticles = guideArticles.filter((a) =>
    matchesFilter(filter, `${a.title} ${a.description}`, a.categories)
  );
  const isFilterActive = filter.query.trim() !== "" || filter.category !== null;
  const useGridView = showAll || isFilterActive;
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  // Clamp rather than reset via effect (avoids a cascading-render setState):
  // a filter narrow enough to drop below the current page number falls back
  // to the last valid page instead of showing nothing.
  const currentPage = Math.min(page, totalPages);
  const pageArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter(next: GuideFilter) {
    setFilter(next);
    setPage(1);
  }

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
              onChange={(e) => updateFilter({ ...filter, query: e.target.value })}
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

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="카테고리로 필터">
            <button
              type="button"
              onClick={() => updateFilter({ ...filter, category: null })}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                filter.category === null
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)]/50"
              }`}
            >
              전체
            </button>
            {GUIDE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateFilter({ ...filter, category: filter.category === c ? null : c })}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  filter.category === c
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)]/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
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

      {/* 자체 가이드 — 기본은 슬라이드로 가볍게 훑어보고, "모두 보기"를 누르거나
          검색/카테고리로 걸러지면 3x3 페이지 형식 그리드로 전환된다. */}
      <FeedSection
        id="own-guides"
        title={`가장 많이 찾는 책상 가이드 (${guideArticles.length}개)`}
        actionLabel={useGridView ? undefined : "모두 보기"}
        onAction={
          useGridView
            ? undefined
            : () => {
                setShowAll(true);
                setPage(1);
              }
        }
      >
        <Reveal>
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center sm:p-10">
              <p className="text-sm text-[var(--color-muted-foreground)] sm:text-base">
                검색 조건에 맞는 가이드를 찾지 못했습니다. 다른 검색어나 카테고리를 선택해보세요.
              </p>
            </div>
          ) : useGridView ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pageArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
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
