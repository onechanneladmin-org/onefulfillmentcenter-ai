const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR/ISR required so admin SEO API changes appear without a full static rebuild.
  // (Nexus uses getServerSideProps for the same reason.)
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Prevent Turbopack from mis-detecting the workspace root when multiple
  // lockfiles exist (e.g. package-lock.json + pnpm-lock.yaml).
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Legacy WordPress demo & contact paths
      {
        source: "/requestdemo",
        destination: "/#newsletter",
        permanent: true,
      },
      {
        source: "/request-demo",
        destination: "/#newsletter",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/#newsletter",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/#newsletter",
        permanent: true,
      },
      // Legacy WordPress solutions paths -> React paths
      {
        source: "/b2c-b2b-wholesale-fulfillment",
        destination: "/solutions/b2c-b2b-wholesale-fulfillment/",
        permanent: true,
      },
      {
        source: "/off-solutions/b2c-b2b-wholesale-fulfillment",
        destination: "/solutions/b2c-b2b-wholesale-fulfillment/",
        permanent: true,
      },
      {
        source: "/off-solutions/warehouse-and-inventory-storage",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
      {
        source: "/warehouse-and-inventory-storage",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
      {
        source: "/fulfillment-new/onefulfillcenter/warehouse-and-inventory-storage",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
      {
        source: "/amazon-fba-prep-services",
        destination: "/amazon-fba-prep/",
        permanent: true,
      },
      {
        source: "/off-solutions/amazon-fba-prep-services",
        destination: "/amazon-fba-prep/",
        permanent: true,
      },
      {
        source: "/off-solutions/kitting-packaging-amp-assembly",
        destination: "/kitting/",
        permanent: true,
      },
      {
        source: "/off-solutions/returns-repairs-amp-warranty",
        destination: "/returns-management/",
        permanent: true,
      },
      {
        source: "/receiving-amp-reverse-logistics",
        destination: "/reverse-logistics/",
        permanent: true,
      },
      {
        source: "/subscription-box-fulfillment",
        destination: "/subscription-fulfillment/",
        permanent: true,
      },
      {
        source: "/shipping-and-last-mile-delivery",
        destination: "/ecommerce-fulfillment/",
        permanent: true,
      },
      {
        source: "/inventory-management",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
      {
        source: "/inventory-management-2",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
      {
        source: "/inventory-management-landing",
        destination: "/solutions/warehousing-and-inventory-storage/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
