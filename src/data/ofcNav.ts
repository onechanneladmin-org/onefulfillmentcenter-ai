import { SERVICE_LANDINGS, servicePath } from "./serviceLandings";

export const OFC_WAREHOUSE_PATH = "/solutions/warehousing-and-inventory-storage/";
export const OFC_B2B_FULFILLMENT_PATH = "/solutions/b2c-b2b-wholesale-fulfillment/";

export type OfcNavChild = {
  title: string;
  href: string;
};

export type OfcNavItem = {
  title: string;
  href: string;
  children?: OfcNavChild[];
};

export const SERVICE_NAV: OfcNavChild[] = SERVICE_LANDINGS.map((page) => ({
  title: page.name,
  href: servicePath(page.slug),
}));

export const ofcNav: OfcNavItem[] = [
  { title: "Home", href: "/" },
  {
    title: "Services",
    href: "/ecommerce-fulfillment/",
    children: SERVICE_NAV,
  },
  { title: "Blog", href: "/blog/" },
];
