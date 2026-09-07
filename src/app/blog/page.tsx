import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import OfcTwHeader from "@/components/solutions/OfcTwHeader";
import SpatialFooter from "@/components/layout/SpatialFooter";
import { fetchBlogs, formatDate, getCategoryName, stripHtml } from "@/services/blogService";
import { company } from "@/data/brandArchitecture";
import "@/styles/ofc-tw.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fulfillment Blog & Ecommerce Logistics Guides",
  description:
    "Read practical guides about ecommerce fulfillment, warehousing, shipping, returns, inventory management, and customer experience from OneFulfillCenter.",
  alternates: { canonical: `${company.url}/blog/` },
  openGraph: {
    type: "website",
    title: "Fulfillment Blog & Ecommerce Logistics Guides | OneFulfillCenter",
    description:
      "Practical fulfillment, warehousing, shipping, inventory, and ecommerce operations insights.",
    url: `${company.url}/blog/`,
  },
};

export default async function BlogPage() {
  const { data: posts } = await fetchBlogs({ limit: 50 });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "OneFulfillCenter Fulfillment Blog",
    url: `${company.url}/blog/`,
    description: metadata.description,
    mainEntity: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${company.url}/blog/${post.slug}/`,
      datePublished: post.publishedDate,
    })),
  };

  return (
    <div className="ofc-tw spatial-page ofc-blog">
      <OfcTwHeader activeHref="/blog/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main>
        <section className="ofc-blog-hero">
          <div className="spatial-wrap">
            <span className="spatial-kicker">Fulfillment intelligence</span>
            <h1>Insights for faster, smarter fulfillment</h1>
            <p>
              Practical guidance for ecommerce operators managing inventory, warehousing,
              shipping, returns, and customer experience.
            </p>
          </div>
        </section>

        <section className="spatial-wrap ofc-blog-grid" aria-label="Fulfillment articles">
          {posts.map((post) => (
            <article className="ofc-blog-card" key={post._id || post.slug}>
              <Link href={`/blog/${post.slug}/`} className="ofc-blog-card__image">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1100px) 31vw, (min-width: 700px) 48vw, 100vw"
                  />
                ) : (
                  <span>OneFulfillCenter</span>
                )}
              </Link>
              <div className="ofc-blog-card__body">
                <div className="ofc-blog-card__meta">
                  <span>{getCategoryName(post.categories?.[0]) || "Fulfillment"}</span>
                  {post.publishedDate ? (
                    <time dateTime={post.publishedDate}>
                      <CalendarDays size={14} aria-hidden="true" />
                      {formatDate(post.publishedDate)}
                    </time>
                  ) : null}
                </div>
                <h2><Link href={`/blog/${post.slug}/`}>{post.title}</Link></h2>
                <p>{stripHtml(post.excerpt || "")}</p>
                <Link className="ofc-blog-card__more" href={`/blog/${post.slug}/`}>
                  Read article <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <SpatialFooter />
    </div>
  );
}
