import type { Metadata } from "next";
import SeoDashboard from "@/components/seo-dashboard/SeoDashboard";
import bundle from "@/data/seo-dashboard/seo-bundle.json";
import type { SeoBundle } from "@/components/seo-dashboard/types";

// Internal research dashboard: keep it out of search results.
export const metadata: Metadata = {
  title: { absolute: "SEO Dashboard | OneFulfillCenter (internal)" },
  robots: { index: false, follow: false, nocache: true },
};

export default function SeoDashboardPage() {
  return <SeoDashboard data={bundle as unknown as SeoBundle} />;
}
