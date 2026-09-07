import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import OfcTwHeader from "@/components/solutions/OfcTwHeader";
import SpatialFooter from "@/components/layout/SpatialFooter";
import {
  BLOG_SITE_URL,
  fetchBlogBySlug,
  fetchBlogs,
  formatDate,
  getCategoryName,
  stripHtml,
} from "@/services/blogService";
import { company } from "@/data/brandArchitecture";
import "@/styles/ofc-tw.css";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await fetchBlogs({ limit: 50 });
  return data.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post) return {};

  const url = `${company.url}/blog/${post.slug}/`;
  const seoTitle = post.seo?.metaTitle || post.seo?.title || post.title;
  const seoDescription =
    post.seo?.metaDescription || post.seo?.description || stripHtml(post.excerpt || "");
  const image =
    post.featuredImage ||
    post.seo?.openGraphImageUrl ||
    `${company.url}/assets/img/logo/onefulfillcenter-logo.png`;

  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDescription,
      url,
      images: [{ url: image, alt: post.title }],
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post) notFound();

  const url = `${company.url}/blog/${post.slug}/`;
  const seoDescription =
    post.seo?.metaDescription || post.seo?.description || stripHtml(post.excerpt || "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: seoDescription,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: post.author || company.name,
      url: BLOG_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
      logo: {
        "@type": "ImageObject",
        url: `${company.url}/assets/img/logo/onefulfillcenter-logo.png`,
      },
    },
    articleBody: stripHtml(post.content || ""),
  };

  return (
    <div className="ofc-tw spatial-page ofc-blog">
      <OfcTwHeader activeHref="/blog/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      <main className="spatial-wrap ofc-article-wrap">
        <Link href="/blog/" className="ofc-article-back">
          <ArrowLeft size={17} aria-hidden="true" /> Back to all articles
        </Link>

        <article className="ofc-article">
          <header className="ofc-article__header">
            <span className="spatial-kicker">
              {getCategoryName(post.categories?.[0]) || "Fulfillment insights"}
            </span>
            <h1>{post.title}</h1>
            <div className="ofc-article__meta">
              {post.publishedDate ? (
                <time dateTime={post.publishedDate}>
                  <CalendarDays size={16} aria-hidden="true" />
                  {formatDate(post.publishedDate)}
                </time>
              ) : null}
              {post.author ? (
                <span><UserRound size={16} aria-hidden="true" /> {post.author}</span>
              ) : null}
            </div>
          </header>

          {post.featuredImage ? (
            <div className="ofc-article__image">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                unoptimized
                sizes="(min-width: 1000px) 900px, 100vw"
              />
            </div>
          ) : null}

          <div
            className="ofc-article__content"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {Array.isArray(post.tags) && post.tags.length ? (
            <footer className="ofc-article__tags">
              {post.tags.map((tag, idx) => {
                const name = typeof tag === "string" ? tag : tag.name || tag.slug;
                return <span key={idx}>#{name}</span>;
              })}
            </footer>
          ) : null}
        </article>
      </main>

      <SpatialFooter />
    </div>
  );
}
