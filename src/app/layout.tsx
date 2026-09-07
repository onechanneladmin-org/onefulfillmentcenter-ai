import type { Metadata, Viewport } from "next";
import "@/styles/index.scss";
import { company } from "@/data/brandArchitecture";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const isStagingHost = /(?:^|\.)test\.onefulfillcenter\.com$/i.test(
  new URL(company.url).hostname,
);

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  robots: isStagingHost
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
  title: {
    default: "OneFulfillCenter | Next Generation Omni-Channel Fulfillment",
    template: "%s | OneFulfillCenter",
  },
  description:
    "Omni-channel 3PL fulfillment with a distributed warehouse network that optimizes B2B and B2C order processing for brands and retailers.",
  keywords: [
    "OneFulfillCenter",
    "One Fulfillment Center",
    "ecommerce fulfillment",
    "3PL",
    "warehouse management",
    "B2B fulfillment",
    "B2C fulfillment",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: "OneFulfillCenter | Next Generation Omni-Channel Fulfillment",
    description:
      "Omni-channel 3PL fulfillment with a distributed warehouse network for brands and retailers.",
    url: company.url,
    images: [
      {
        url: `${company.url}/assets/img/logo/onefulfillcenter-logo.png`,
        width: 900,
        height: 194,
        alt: "OneFulfillCenter Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneFulfillCenter | Next Generation Omni-Channel Fulfillment",
    description:
      "Omni-channel 3PL fulfillment with a distributed warehouse network for brands and retailers.",
    images: [`${company.url}/assets/img/logo/onefulfillcenter-logo.png`],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=20260717", type: "image/png" }],
    shortcut: ["/favicon.ico?v=20260717"],
    apple: ["/apple-touch-icon.png?v=20260717"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    legalName: company.name,
    email: company.investorEmail,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 W Darlington Ave",
      addressLocality: "Kissimmee",
      addressRegion: "FL",
      postalCode: "34746",
      addressCountry: "US",
    },
    sameAs: [
      company.facebookUrl,
      company.instagramUrl,
      company.linkedinUrl,
      company.youtubeUrl,
    ],
  };

  return (
    <html lang="en" className="oc-site">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;500;600;700;800;900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="oc-site">
        {children}
      </body>
    </html>
  );
}
