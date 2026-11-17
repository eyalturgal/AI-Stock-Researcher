import { siteConfig } from "@/config/site";
import { stockConfig } from "@/config/stock";
import { SubTabNav } from "@/components/SubTabNav";

// Wraps every page under News. The row of sub-tabs stays in place while
// the page under it changes.
export default function NewsLayout({ children }: LayoutProps<"/news">) {
  // Without a newsroom feed in the stock config there is no Announcements page.
  const tabs = siteConfig.newsTabs.filter(
    (tab) => tab.href !== "/news/announcements" || stockConfig.newsroom.feedUrl,
  );

  return (
    <>
      <SubTabNav label="News sections" tabs={tabs} />
      {children}
    </>
  );
}
