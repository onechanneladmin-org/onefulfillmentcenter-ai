import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import OfcTwHeader from "@/components/solutions/OfcTwHeader";
import SpatialFooter from "@/components/layout/SpatialFooter";
import { getBlogBySlug, publishedBlogs } from "@/data/blogs/publishedBlogs";
import { company } from "@/data/brandArchitecture";
import "@/styles/ofc-tw.css";

type PageProps = { params: Promise<{ slug: string }> };

// Keep a runtime fallback for OpenNext/Cloudflare. The known posts are still
// pre-rendered, while the fallback avoids false 404s during cache propagation.
export const dynamicParams = true;

export function generateStaticParams() {
  return publishedBlogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};

  const url = `${company.url}/blog/${post.slug}/`;
  const image = post.featuredImage || `${company.url}/assets/img/logo/onefulfillcenter-logo.png`;

  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.seoDescription,
      url,
      images: [{ url: image, alt: post.featuredImageAlt }],
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
      tags: post.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [image],
    },
  };
}

const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const textContent = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const url = `${company.url}/blog/${post.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: post.featuredImage ? [`${company.url}${post.featuredImage}`] : undefined,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: post.author, url: company.url },
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
      logo: {
        "@type": "ImageObject",
        url: `${company.url}/assets/img/logo/onefulfillcenter-logo.png`,
      },
    },
    articleBody: textContent(post.contentHtml),
    keywords: post.tags.map((tag) => tag.name).join(", "),
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
              {post.categories[0]?.name || "Fulfillment insights"}
            </span>
            <h1>{post.title}</h1>
            <div className="ofc-article__meta">
              <time dateTime={post.publishedDate}>
                <CalendarDays size={16} aria-hidden="true" />
                {dateLabel(post.publishedDate)}
              </time>
              <span><UserRound size={16} aria-hidden="true" /> {post.author}</span>
            </div>
          </header>

          {post.featuredImage ? (
            <div className="ofc-article__image">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                fill
                priority
                sizes="(min-width: 1000px) 900px, 100vw"
              />
            </div>
          ) : null}

          <div
            className="ofc-article__content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {post.tags.length ? (
            <footer className="ofc-article__tags">
              {post.tags.map((tag) => <span key={tag.slug}>#{tag.name}</span>)}
            </footer>
          ) : null}
        </article>
      </main>

      <SpatialFooter />
    </div>
  );
}
