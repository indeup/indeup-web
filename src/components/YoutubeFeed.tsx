"use client";

import { useEffect, useState } from "react";
import CardScroller from "@/components/CardScroller";

type YoutubePost = {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  thumbnail: string | null;
  viewCount: number | null;
};

type FeedData = {
  updatedAt: string;
  longform: YoutubePost[];
  shorts: YoutubePost[];
};

const FALLBACK_THUMBNAIL = "/indeup_series.jpg";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@indeup";
// Read straight from GitHub, where the Action commits fresh data every
// 6 hours — the live site (Cafe24 static hosting, deployed by hand)
// would otherwise only show whatever was uploaded at the last manual
// deploy. Same-origin /data/youtube.json stays as a fallback.
const GITHUB_DATA_URL = "https://raw.githubusercontent.com/indeup/indeup-web/main/public/data/youtube.json";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatViews(views: number | null): string | null {
  if (views === null) return null;
  if (views >= 10000) return `조회수 ${(views / 10000).toFixed(1)}만회`;
  return `조회수 ${views.toLocaleString("ko-KR")}회`;
}

function VideoCard({ post, onPlay }: { post: YoutubePost; onPlay: (id: string) => void }) {
  const views = formatViews(post.viewCount);
  return (
    <button
      type="button"
      onClick={() => onPlay(post.id)}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail host is YouTube's CDN, not a fixed local asset next/image can validate. */}
        <img
          src={post.thumbnail ?? FALLBACK_THUMBNAIL}
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
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/10"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-2 text-xs font-medium text-[var(--color-muted-foreground)]">
          {formatDate(post.publishedAt)}
          {views && (
            <>
              <span aria-hidden="true">·</span>
              {views}
            </>
          )}
        </p>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 tracking-[-0.01em] text-[var(--color-primary)] sm:text-lg">
          {post.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
          바로 재생하기
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </button>
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

function PlayerView({
  post,
  kind,
  onBack,
}: {
  post: YoutubePost;
  kind: "longform" | "shorts";
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]"
      >
        <span aria-hidden="true" className="inline-block">
          &larr;
        </span>
        목록으로 돌아가기
      </button>

      <div
        className={`mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black ${
          kind === "shorts" ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video w-full"
        }`}
      >
        <iframe
          key={post.id}
          src={`https://www.youtube.com/embed/${post.id}?autoplay=1&rel=0`}
          title={post.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>

      <h3 className="mt-4 text-base font-bold leading-6 tracking-[-0.01em] text-[var(--color-primary)] sm:text-lg">
        {post.title}
      </h3>
    </div>
  );
}

export default function YoutubeFeed({ kind }: { kind: "longform" | "shorts" }) {
  const [data, setData] = useState<FeedData | null>(null);
  const [failed, setFailed] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      for (const url of [GITHUB_DATA_URL, "/data/youtube.json"]) {
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

  const posts = data ? data[kind] : null;

  if (failed || (posts && posts.length === 0)) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center sm:p-10">
        <p className="text-base font-semibold text-[var(--color-primary)] sm:text-lg">
          지금은 영상을 불러올 수 없습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)] sm:text-base">
          유튜브 채널에서 인디업의 영상을 바로 확인할 수 있습니다.
        </p>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
        >
          유튜브 채널 바로가기
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    );
  }

  if (!posts) {
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

  const playingPost = playingId ? posts.find((p) => p.id === playingId) : undefined;
  if (playingPost) {
    return <PlayerView post={playingPost} kind={kind} onBack={() => setPlayingId(null)} />;
  }

  return (
    <CardScroller
      items={posts}
      keyFor={(post) => post.id}
      renderItem={(post) => <VideoCard post={post} onPlay={setPlayingId} />}
    />
  );
}
