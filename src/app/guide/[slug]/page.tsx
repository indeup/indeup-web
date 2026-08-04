import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeCta from "@/components/SizeCta";
import Reveal from "@/components/Reveal";
import { guideArticles, getGuideArticle } from "@/lib/guideArticles";
import { toSafeJsonLdString } from "@/lib/safeJsonLd";

const siteUrl = "https://indeup.com";

export function generateStaticParams() {
  return guideArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return {};

  const url = `/guide/${article.slug}/`;
  return {
    title: { absolute: `${article.title} | 인디업 책상 가이드` },
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) notFound();

  const articleUrl = `${siteUrl}/guide/${article.slug}/`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "책상 가이드", item: `${siteUrl}/guide/` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    isPartOf: { "@type": "WebSite", name: "인디업", url: siteUrl },
    // A named Person (not just the Organization) is a real E-E-A-T signal —
    // AI/search engines weigh "a specific person with relevant authority
    // wrote or verified this" more than an anonymous brand byline.
    author: {
      "@type": "Person",
      name: "하민성",
      jobTitle: "대표",
      worksFor: { "@type": "Organization", name: "인디업", url: siteUrl },
    },
    publisher: { "@type": "Organization", name: "인디업", url: siteUrl },
    mainEntityOfPage: articleUrl,
  };

  // Only emitted for the two articles whose body already spells out a real,
  // written procedure (see guideArticles.ts) — never generated from
  // sections that aren't actually step-by-step.
  const howToJsonLd = article.howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.howTo.name,
        step: article.howTo.steps.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }
    : null;

  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(articleJsonLd) }} />
      {howToJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLdString(howToJsonLd) }} />
      )}

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="브레드크럼" className="border-b border-[var(--color-border)] px-6 py-2.5 sm:px-12">
          <ol className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <li>
              <a href="/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                홈
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/guide/" className="cursor-pointer transition-colors hover:text-[var(--color-primary)]">
                책상 가이드
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-primary)]">
              {article.title}
            </li>
          </ol>
        </nav>

        <article className="px-6 py-12 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
              Guide
            </p>
            <h1 className="mt-3 font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">{article.description}</p>
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
              작성·검수: 하민성 (인디업 대표) · 최초 작성일 {article.publishedAt}
              {article.updatedAt && article.updatedAt !== article.publishedAt && ` · 최종 수정일 ${article.updatedAt}`}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {article.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-secondary)]"
                >
                  {c}
                </span>
              ))}
            </div>

            <Reveal className="mt-10 flex flex-col gap-9">
              {article.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-lg font-semibold tracking-[-0.01em] sm:text-xl">{section.heading}</h2>
                  <div className="mt-3 flex flex-col gap-3">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                    {section.list && (
                      <ol className="flex list-none flex-col gap-2 pl-0">
                        {section.list.map((item, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 text-sm leading-[1.3] text-[var(--color-secondary)] sm:text-base"
                          >
                            <span className="font-semibold text-[var(--color-primary)]" aria-hidden="true">
                              {i + 1}.
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {section.table && (
                      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                        <table className="w-full border-collapse text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                              {section.table.headers.map((h) => (
                                <th
                                  key={h}
                                  className="px-4 py-2.5 text-left font-semibold text-[var(--color-primary)]"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, i) => (
                              <tr
                                key={i}
                                className={i > 0 ? "border-t border-[var(--color-border)]" : undefined}
                              >
                                {row.map((cell, j) => (
                                  <td key={j} className="px-4 py-2.5 align-top text-[var(--color-secondary)]">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border)] pt-8 sm:flex-row">
              <a
                href={article.relatedProduct.href}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
              >
                {article.relatedProduct.label}
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="/guide/"
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                책상 가이드 전체 보기
              </a>
            </div>
          </div>
        </article>
      </main>

      <SizeCta />
      <Footer />
    </div>
  );
}
