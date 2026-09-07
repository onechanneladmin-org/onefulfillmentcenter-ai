import {
  SEO_API_BASE_URL,
  SEO_APP_LABEL,
  SEO_CLIENT_NAME,
} from "./config";

export function getSeoApiHeaders(extra: Record<string, string> = {}) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "OneFulfillCenter-BFF/1.0 (Next.js SSR; +https://onefulfillcenter.com)",
    label: SEO_APP_LABEL,
    clientname: SEO_CLIENT_NAME,
    ...extra,
  };
}

export function seoApiUrl(endpoint: string) {
  const path = endpoint.replace(/^\//, "");
  return `${SEO_API_BASE_URL}${path}`;
}
