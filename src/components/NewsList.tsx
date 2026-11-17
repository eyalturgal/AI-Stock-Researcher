import type { NewsItem } from "@/data/sample";

// A list of news stories. Each one shows its category, headline, a short
// summary, and where and when it was published.
//
// layout "stack" puts the stories under each other.
// layout "columns" puts them side by side on wide screens.
export function NewsList({
  items,
  layout = "stack",
}: {
  items: NewsItem[];
  layout?: "stack" | "columns";
}) {
  return (
    <ul
      className={
        layout === "columns"
          ? "grid gap-x-12 gap-y-8 md:grid-cols-3"
          : "flex flex-col gap-8"
      }
    >
      {items.map((item) => (
        <li key={item.id} className="border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
            <span className="font-semibold text-ink-soft">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.source}</span>
            <span aria-hidden="true">·</span>
            <span>{item.age}</span>
          </div>
          <h3 className="mt-2 text-lg font-medium leading-7 text-ink">
            {item.title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-soft">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
