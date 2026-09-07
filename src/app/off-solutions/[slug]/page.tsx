import { permanentRedirect } from "next/navigation";

const SLUG_REDIRECT_MAP: Record<string, string> = {
  "b2c-b2b-wholesale-fulfillment": "/solutions/b2c-b2b-wholesale-fulfillment/",
  "warehouse-and-inventory-storage": "/solutions/warehousing-and-inventory-storage/",
  "amazon-fba-prep-services": "/amazon-fba-prep/",
  "kitting-packaging-amp-assembly": "/kitting/",
  "returns-repairs-amp-warranty": "/returns-management/",
};

export function generateStaticParams() {
  return [
    { slug: "b2c-b2b-wholesale-fulfillment" },
    { slug: "warehouse-and-inventory-storage" },
    { slug: "amazon-fba-prep-services" },
    { slug: "kitting-packaging-amp-assembly" },
    { slug: "returns-repairs-amp-warranty" },
  ];
}

export default async function OffSolutionsRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = SLUG_REDIRECT_MAP[slug] || "/";
  permanentRedirect(target);
}
