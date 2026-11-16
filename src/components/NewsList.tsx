import type { NewsItem } from "@/data/sample";

// A list of news stories. Each one shows its category, headline, a short
// summary, and where and when it was published.
export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
            <span className="rounded-full border border-line px-2 py-0.5 font-medium text-ink-soft">
              {item.category}
            </span>
            <span>{item.source}</span>
            <span aria-hidden="true">·</span>
            <span>{item.age}</span>
          </div>
          <h3 className="mt-2 text-base font-medium leading-6 text-ink">
            {item.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
