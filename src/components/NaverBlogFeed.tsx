"use client";

import { useEffect, useState } from "react";
import CardScroller from "@/components/CardScroller";

type BlogPost = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  thumbnail: string;
};

type FeedData = {
  updatedAt: string;
  posts: BlogPost[];
};

const FALLBACK_THUMBNAIL = "/indeup_series.jpg";
const NAVER_BLOG_HOME = "https://blog.naver.com/indeup_official";
// Read the data straight from GitHub, where the Action commits it every
// 6 hours — the live site (Cafe24 static hosting, deployed by hand) would
// otherwise only ever show whatever was uploaded at the last manual deploy.
// Same-origin /data/naver-blog.json is kept as a fallback for if GitHub is
// ever unreachable, or once a proper CI deploy makes it the fresher copy.
const GITHUB_DATA_URL = "https://raw.githubusercontent.com/indeup/indeup-web/main/public/data/naver-blog.json";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail host is Naver's CDN and varies per post, not a fixed local asset next/image can validate. */}
      <img
        src={post.thumbnail}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== window.location.origin + FALLBACK_THUMBNAIL) {
            img.src = FALLBACK_THUMBNAIL;
          }
        }}
        className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium text-[var(--color-muted-foreground)]">{formatDate(post.pubDate)}</p>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 tracking-[-0.01em] text-[var(--color-primary)] sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--color-secondary)]">{post.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
          네이버 블로그에서 보기
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </a>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <div className="aspect-[4/3] w-full bg-[var(--color-muted)]" />
      <div className="flex flex-col gap-3 p-5 sm:p-6">
        <div className="h-3 w-20 rounded bg-[var(--color-muted)]" />
        <div className="h-4 w-full rounded bg-[var(--color-muted)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--color-muted)]" />
      </div>
    </div>
  );
}

export default function NaverBlogFeed() {
  const [data, setData] = useState<FeedData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      for (const url of [GITHUB_DATA_URL, "/data/naver-blog.json"]) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          const json = (await res.json()) as FeedData;
          if (!cancelled) setData(json);
          return;
        } catch {
          // try the next source
        }
      }
      if (!cancelled) setFailed(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || (data && data.posts.length === 0)) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center sm:p-10">
        <p className="text-base font-semibold text-[var(--color-primary)] sm:text-lg">
          지금은 최신 글을 불러올 수 없습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)] sm:text-base">
          네이버 블로그에서 인디업의 공간 활용 팁과 제작 이야기를 바로 확인할 수 있습니다.
        </p>
        <a
          href={NAVER_BLOG_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
        >
          네이버 블로그 바로가기
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex gap-6 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shrink-0 basis-[85%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <CardScroller items={data.posts} keyFor={(post) => post.id} renderItem={(post) => <BlogCard post={post} />} />
      <p className="mt-6 text-center text-xs text-[var(--color-muted-foreground)]">
        네이버 블로그 글은 하루 4회 자동으로 갱신됩니다.
      </p>
    </div>
  );
}
