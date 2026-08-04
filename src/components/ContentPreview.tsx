import Reveal from "@/components/Reveal";
import NaverBlogFeed, { type BlogFeedData } from "@/components/NaverBlogFeed";
import YoutubeFeed, { type YoutubeFeedData } from "@/components/YoutubeFeed";

const PREVIEW_COUNT = 4;

function ContentRow({
  eyebrow,
  title,
  moreHref,
  children,
}: {
  eyebrow: string;
  title: string;
  moreHref: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">{eyebrow}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-[-0.01em] sm:text-xl">{title}</h3>
        </div>
        <a
          href={moreHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 cursor-pointer border-b border-[var(--color-border)] pb-0.5 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          더보기 &rarr;
        </a>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/** Home page's blog/YouTube TV/Shorts feeds — this is now the only place
 *  on-site these show (they used to also live on /guide, which was
 *  removed as a duplicate once this section existed here). "더보기" goes
 *  straight to the real channel since there's no fuller on-site list. */
export default function ContentPreview({
  initialBlogData,
  initialYoutubeData,
}: {
  initialBlogData: BlogFeedData | null;
  initialYoutubeData: YoutubeFeedData | null;
}) {
  return (
    <section className="relative mx-3 overflow-hidden bg-white px-6 py-10 sm:mx-0 sm:border-t sm:border-[var(--color-border)] sm:px-12 sm:py-16">
      <div className="relative mx-auto max-w-[1600px]">
        <Reveal>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
            Contents
          </p>
          <h2 className="mt-3 font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
            영상과 글로도 만나보세요.
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-col gap-10">
          <Reveal delay={0}>
            <ContentRow eyebrow="Naver Blog" title="네이버 블로그" moreHref="https://blog.naver.com/indeup_official">
              <NaverBlogFeed initialData={initialBlogData} limit={PREVIEW_COUNT} />
            </ContentRow>
          </Reveal>

          <Reveal delay={80}>
            <ContentRow eyebrow="Youtube" title="유튜브 TV" moreHref="https://www.youtube.com/@indeup">
              <YoutubeFeed kind="longform" initialData={initialYoutubeData} limit={PREVIEW_COUNT} />
            </ContentRow>
          </Reveal>

          <Reveal delay={160}>
            <ContentRow eyebrow="Youtube Shorts" title="유튜브 쇼츠" moreHref="https://www.youtube.com/@indeup">
              <YoutubeFeed kind="shorts" initialData={initialYoutubeData} limit={PREVIEW_COUNT} />
            </ContentRow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
