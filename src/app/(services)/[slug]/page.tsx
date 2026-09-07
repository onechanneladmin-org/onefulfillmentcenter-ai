import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Wrapper from "@/layout/Wrapper";
import ServiceLandingPage from "@/components/solutions/ServiceLandingPage";
import { createPageMetadata, SeoStructuredData } from "@/lib/seo";
import {
  SERVICE_SLUGS,
  getServiceBySlug,
  servicePath,
} from "@/data/serviceLandings";

export const revalidate = 60;
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServiceBySlug(slug);
  if (!page) return { title: "OneFulfillCenter" };
  return createPageMetadata(servicePath(page.slug), {
    title: page.seoTitle,
    description: page.metaDescription,
    keywords: page.primaryKeyword,
  });
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const page = getServiceBySlug(slug);
  if (!page) notFound();

  return (
    <Wrapper>
      <SeoStructuredData path={servicePath(page.slug)} fallbackTitle={page.seoTitle} />
      <ServiceLandingPage page={page} />
    </Wrapper>
  );
};

export default Page;
