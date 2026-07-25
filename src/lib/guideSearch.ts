// Shared search/filter contract used across the /guide page's own article
// grid and the auto-fetched blog/YouTube sections, so one search box and
// one row of category buttons can filter all of them consistently.

export type GuideFilter = {
  query: string;
  category: string | null;
};

export const EMPTY_FILTER: GuideFilter = { query: "", category: null };

export function isFilterActive(filter: GuideFilter): boolean {
  return filter.query.trim().length > 0 || filter.category !== null;
}

export function matchesFilter(filter: GuideFilter, searchableText: string, categories: string[]): boolean {
  if (filter.category && !categories.includes(filter.category)) return false;
  const q = filter.query.trim().toLowerCase();
  if (!q) return true;
  return searchableText.toLowerCase().includes(q);
}
