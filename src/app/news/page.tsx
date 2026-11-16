import type { Metadata } from "next";
import { stockConfig } from "@/config/stock";
import { sampleNews, type NewsCategory } from "@/data/sample";
import { CardHeader, GlassCard } from "@/components/ui/GlassCard";
import { NewsList } from "@/components/NewsList";

export const metadata: Metadata = { title: "News" };

// The three kinds of news the site will carry, and the title for each.
const sections: { category: NewsCategory; title: string }[] = [
  { category: "Company", title: `${stockConfig.shortName} news` },
  { category: "Industry", title: `${stockConfig.industry} news` },
  { category: "Market", title: "Top market news" },
];

// The News tab: one card per kind of news.
export default function NewsPage() {
  return (
    <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
      {sections.map((section) => (
        <GlassCard key={section.category}>
          <CardHeader title={section.title} />
          <NewsList
            items={sampleNews.filter((item) => item.category === section.category)}
          />
        </GlassCard>
      ))}
    </div>
  );
}
