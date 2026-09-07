/**
 * Blog API service for OneFulfillCenter
 * Fetches blogs from storefront BFF (backend.oneauto.us)
 */
import {
  SEO_API_BASE_URL,
  SEO_APP_LABEL,
  SEO_CLIENT_NAME,
  PUBLIC_SITE_ORIGIN,
} from '@/lib/seo/config';

export interface BlogCategory {
  slug: string;
  name: string;
}

export interface BlogTag {
  slug: string;
  name: string;
}

export interface BlogSeo {
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageUrl?: string;
}

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  publishedDate?: string;
  updatedDate?: string;
  author?: string;
  categories?: (string | BlogCategory)[];
  tags?: (string | BlogTag)[];
  seo?: BlogSeo;
  status?: string;
}

export interface BlogListResponse {
  error?: boolean;
  label?: string;
  data: BlogItem[];
  totalcount: number;
  page: number;
  limit: number;
  message?: string;
}

export const BLOG_API_BASE = SEO_API_BASE_URL.replace(/\/$/, '');
export const BLOG_CLIENT_NAME = SEO_CLIENT_NAME;
export const BLOG_LABEL = SEO_APP_LABEL;
export const BLOG_SITE_URL = PUBLIC_SITE_ORIGIN;

export function getCategoryName(category: string | BlogCategory | undefined): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.name || category.slug || '';
}

export function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export async function fetchBlogs(options?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
}): Promise<BlogListResponse> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const params = new URLSearchParams({
    label: BLOG_LABEL,
    page: String(page),
    limit: String(limit),
  });

  if (options?.category) params.set('category', options.category);
  if (options?.tag) params.set('tag', options.tag);
  if (options?.q) params.set('q', options.q);

  try {
    const response = await fetch(`${BLOG_API_BASE}/prod/blogs?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        clientname: BLOG_CLIENT_NAME,
        label: BLOG_LABEL,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        error: true,
        data: [],
        totalcount: 0,
        page,
        limit,
        message: `HTTP error ${response.status}`,
      };
    }

    const json = await response.json();
    return {
      error: Boolean(json.error),
      label: json.label || BLOG_LABEL,
      data: Array.isArray(json.data) ? json.data : [],
      totalcount: Number(json.totalcount ?? (json.data ? json.data.length : 0)),
      page: Number(json.page ?? page),
      limit: Number(json.limit ?? limit),
    };
  } catch (err) {
    return {
      error: true,
      data: [],
      totalcount: 0,
      page,
      limit,
      message: err instanceof Error ? err.message : 'Failed to fetch blogs',
    };
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogItem | null> {
  if (!slug) return null;
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());

  try {
    const response = await fetch(
      `${BLOG_API_BASE}/prod/blogs/${cleanSlug}?label=${BLOG_LABEL}`,
      {
        headers: {
          Accept: 'application/json',
          clientname: BLOG_CLIENT_NAME,
          label: BLOG_LABEL,
        },
        next: { revalidate: 300 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      if (json && !json.error) {
        if (json.data && !Array.isArray(json.data) && json.data.title) {
          return json.data;
        }
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data[0];
        }
      }
    }
  } catch {
    // Fall back to query param
  }

  try {
    const response = await fetch(
      `${BLOG_API_BASE}/prod/blogs?label=${BLOG_LABEL}&slug=${cleanSlug}`,
      {
        headers: {
          Accept: 'application/json',
          clientname: BLOG_CLIENT_NAME,
          label: BLOG_LABEL,
        },
        next: { revalidate: 300 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      if (json && !json.error) {
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data[0];
        }
        if (json.data && !Array.isArray(json.data) && json.data.title) {
          return json.data;
        }
      }
    }
  } catch {
    // Both failed
  }

  return null;
}
