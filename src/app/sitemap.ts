import type { MetadataRoute } from "next";
import { company } from "@/data/brandArchitecture";
import { OFC_B2B_FULFILLMENT_PATH, OFC_WAREHOUSE_PATH } from "@/data/ofcNav";
import { SERVICE_LANDINGS, servicePath } from "@/data/serviceLandings";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: company.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICE_LANDINGS.map((page) => ({
      url: `${company.url}${servicePath(page.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${company.url}${OFC_WAREHOUSE_PATH}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${company.url}${OFC_B2B_FULFILLMENT_PATH}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${company.url}/inventory-management/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${company.url}/temperature-controlled-storage/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${company.url}/kitting-assembly/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${company.url}/privacy-policy/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${company.url}/terms-of-service/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];
}
