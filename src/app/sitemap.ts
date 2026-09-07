import type { MetadataRoute } from "next";
import { company } from "@/data/brandArchitecture";
import { OFC_B2B_FULFILLMENT_PATH, OFC_WAREHOUSE_PATH } from "@/data/ofcNav";
import { SERVICE_LANDINGS, servicePath } from "@/data/serviceLandings";
import { fetchBlogs } from "@/services/blogService";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const { data: posts } = await fetchBlogs({ limit: 50 });

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
      url: `${company.url}/blog/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${company.url}/blog/${post.slug}/`,
      lastModified: post.updatedDate ? new Date(post.updatedDate) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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
