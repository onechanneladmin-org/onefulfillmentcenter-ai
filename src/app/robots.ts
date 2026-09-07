import type { MetadataRoute } from "next";
import { company } from "@/data/brandArchitecture";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const hostname = new URL(company.url).hostname;
  const isStagingHost = /(?:^|\.)(?:test|staging)\.onefulfillcenter\.com$/i.test(hostname);

  if (isStagingHost) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
