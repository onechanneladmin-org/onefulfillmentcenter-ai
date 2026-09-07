import type { Metadata } from "next";
import { company } from "@/data/brandArchitecture";
import { hasCmsSeoFields } from "./fetchSeo";
import type { SeoApiData, SeoFallback, SeoFetchResult } from "./types";

function asKeywords(value?: string | string[]) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function sanitizeCanonical(url?: string): string | undefined {
  if (!url) return undefined;
  return url
    .replace(/https?:\/\/test\.onefulfillcenter\.com/g, "https://onefulfillcenter.com")
    .replace(/https?:\/\/onechanneladmin\.info/g, "https://onechanneladmin.com");
}

function stripHtml(input?: string): string {
  if (!input) return "";
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function robotsFromSeo(seo?: SeoApiData["seo"]): Metadata["robots"] {
  if (!seo) return undefined;

  if (seo.robotsMeta) {
    return seo.robotsMeta;
  }

  if (seo.noindex || seo.nofollow) {
    return {
      index: !seo.noindex,
      follow: !seo.nofollow,
    };
  }

  return undefined;
}

/**
 * Map oneauto SEO API payload → Next.js Metadata.
 * Prefer CMS fields when present; otherwise keep local page fallbacks
 * (API returns path-as-title when a page SEO row is missing).
 */
export function seoResultToMetadata(
  result: SeoFetchResult,
  fallback: SeoFallback = {}
): Metadata {
  const seo = result.seoData?.seo || {};
  const fromCms = hasCmsSeoFields(result.seoData);
  const rawTitle = fromCms
    ? seo.metaTitle || result.seoData?.title || fallback.title || company.shortName
    : fallback.title || seo.metaTitle || result.seoData?.title || company.shortName;
  const rawDescription = fromCms
    ? seo.metaDescription || result.seoData?.description || fallback.description || ""
    : fallback.description || seo.metaDescription || result.seoData?.description || "";

  const cleanDescription = stripHtml(rawDescription);

  // If the title already includes brand identifier, use absolute title to prevent duplicate suffix from layout template
  const title = /OneFulfillCenter|1CA|OneChannelAdmin/i.test(rawTitle)
    ? { absolute: rawTitle }
    : rawTitle;

  const keywords =
    asKeywords(fromCms ? seo.metaKeywords : undefined) ||
    asKeywords(fromCms ? result.seoData?.keywords : undefined) ||
    asKeywords(fallback.keywords) ||
    asKeywords(seo.metaKeywords) ||
    asKeywords(result.seoData?.keywords);
  const canonicalUrl = sanitizeCanonical(result.canonicalUrl || seo.canonicalUrl || undefined);
  const og = seo.openGraph || {};
  const twitter = seo.twitter || {};
  const ogImage = fromCms ? og.imageUrl || result.seoData?.images?.[0] : undefined;
  const twitterImage = fromCms
    ? twitter.imageUrl || ogImage
    : undefined;

  return {
    title,
    description: cleanDescription || undefined,
    keywords,
    robots: fromCms ? robotsFromSeo(seo) : undefined,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title: (fromCms && og.title) || rawTitle,
      description: (fromCms && stripHtml(og.description)) || cleanDescription || undefined,
      url: canonicalUrl,
      siteName: company.name,
      type: ((fromCms && og.type) as "website") || "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card:
        ((fromCms && twitter.cardType) as "summary_large_image") ||
        "summary_large_image",
      title: (fromCms && twitter.title) || rawTitle,
      description: (fromCms && stripHtml(twitter.description)) || cleanDescription || undefined,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export function getStructuredData(result: SeoFetchResult, fallbackTitle?: string) {
  if (result.seoData?.structuredData && hasCmsSeoFields(result.seoData)) {
    return result.seoData.structuredData;
  }

  const seo = result.seoData?.seo || {};
  const fromCms = hasCmsSeoFields(result.seoData);
  const title = fromCms
    ? seo.metaTitle || result.seoData?.title || fallbackTitle || company.shortName
    : fallbackTitle || seo.metaTitle || result.seoData?.title || company.shortName;
  const description = fromCms
    ? seo.metaDescription || result.seoData?.description || undefined
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: stripHtml(description),
    url: sanitizeCanonical(result.canonicalUrl),
    isPartOf: {
      "@type": "WebSite",
      name: company.name,
      url: company.url,
    },
  };
}
