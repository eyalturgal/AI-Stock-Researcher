import { stockConfig } from "@/config/stock";
import { getAnnouncements } from "@/lib/newsroom";
import { formatDate } from "@/lib/format";

// The company's own announcements and blog posts, from its newsroom feed.
// This is "category B" news: first-hand, but written by the company to look
// good, so it is labeled as the company's own words.

type Layout = "grid" | "single";

const LAYOUTS: Record<Layout, string> = {
  grid: "grid gap-x-14 gap-y-8 lg:grid-cols-2",
  single: "flex flex-col gap-8",
};

export async function AnnouncementList({
  limit,
  layout = "grid",
}: {
  limit: number;
  layout?: Layout;
}) {
  const announcements = await getAnnouncements(limit);

  if (!announcements) {
    return (
      <p className="border-t border-line pt-3 text-sm leading-6 text-ink-soft">
        The company&apos;s announcements could not be loaded right now. This
        usually fixes itself within a few minutes.
      </p>
    );
  }

  return (
    <div>
      <ul className={LAYOUTS[layout]}>
        {announcements.map((item) => (
          <li key={item.id} className="border-t border-line pt-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
              <span className="font-semibold text-ink-soft">{item.kind}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(item.publishedOn)}</span>
            </div>
            <h3 className="mt-2 text-lg font-medium leading-7 text-ink">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {item.title}
              </a>
            </h3>
            {item.summary ? (
              <p className="mt-1.5 text-sm leading-6 text-ink-soft">{item.summary}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-ink-faint">
        Source: {stockConfig.shortName}&apos;s newsroom feed, in the
        company&apos;s own words. Each one opens the original.{" "}
        <a
          href={stockConfig.newsroom.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Newsroom
        </a>
      </p>
    </div>
  );
}
