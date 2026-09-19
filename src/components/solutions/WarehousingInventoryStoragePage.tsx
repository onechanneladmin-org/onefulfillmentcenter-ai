import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Boxes,
  Building2,
  CheckCircle2,
  Shield,
  Truck,
  Warehouse,
} from "lucide-react";
import OfcTwHeader from "./OfcTwHeader";
import { OFC_B2B_FULFILLMENT_PATH, OFC_WAREHOUSE_PATH } from "@/data/ofcNav";
import { company, socialLinks } from "@/data/brandArchitecture";

const HUB_NODES = [
  { label: "Amazon", angle: -20 },
  { label: "Shopify", angle: 20 },
  { label: "eBay", angle: 55 },
  { label: "Medicine", angle: 95 },
  { label: "Long Term", angle: 135 },
  { label: "Short Term", angle: 175 },
  { label: "POSM", angle: 215 },
  { label: "Multiple Warehouses", angle: 255 },
  { label: "B2B / B2C", angle: 300 },
  { label: "Retail", angle: 340 },
] as const;

const CORE_POINTS = [
  {
    title: "Secure and organized storage",
    copy: "Protect products from damage and theft with clearly zoned racking, controlled access, and disciplined putaway processes.",
  },
  {
    title: "Effective inventory management",
    copy: "Optimize stock levels with cycle counts, audits, and replenishment routines that keep availability aligned to demand.",
  },
  {
    title: "Efficient order fulfillment",
    copy: "Position inventory for fast pick paths so B2B and B2C orders move quickly from shelf to pack station to carrier.",
  },
  {
    title: "Real-time inventory tracking",
    copy: "Use warehouse management systems to maintain live visibility into on-hand, reserved, and in-transit inventory.",
  },
  {
    title: "Automated picking and packing",
    copy: "Support speed and accuracy with guided workflows, conveyors, and automation where volume justifies it.",
  },
  {
    title: "Cross-docking",
    copy: "Unload inbound freight and move product directly to outbound lanes when storage dwell time is not required.",
  },
] as const;

const VALUE_POINTS = [
  {
    title: "Kitting and assembly",
    copy: "Assemble kits, bundles, and display-ready packs before shipment so brands save time and reduce last-mile complexity.",
  },
  {
    title: "Returns management",
    copy: "Inspect, restock, repair, or disposition returned products with clear reverse-logistics workflows that protect the customer experience.",
  },
  {
    title: "Security measures",
    copy: "Safeguard inventory with CCTV coverage, access controls, and fire-suppression systems designed for warehouse environments.",
  },
] as const;

const FOOTER_COLS = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Warehousing and Inventory Storage", href: OFC_WAREHOUSE_PATH },
      { label: "B2C & B2B Wholesale Fulfillment", href: OFC_B2B_FULFILLMENT_PATH },
    ],
  },
] as const;

function HubVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-[12%] rounded-full border border-[#ff6a3d]/25 bg-[radial-gradient(circle_at_center,rgba(255,106,61,0.18),transparent_68%)]" />
      <div className="absolute inset-[24%] rounded-full border border-white/10" />
      <div className="absolute inset-0">
        {HUB_NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 38;
          const y = 50 + Math.sin(rad) * 38;
          return (
            <div
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="rounded-full bg-white/10 px-3 py-2 text-center shadow-[0_0_24px_rgba(255,106,61,0.18)] backdrop-blur-sm">
                <span className="block max-w-[88px] text-[10px] font-bold leading-tight text-white">
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#101826] shadow-[0_0_40px_rgba(47,211,200,0.2)]">
        <Image
          src="/assets/img/logo/onefulfillcenter-logo-light.png"
          alt="One Fulfill Center"
          width={88}
          height={24}
          className="h-auto w-16"
        />
      </div>
    </div>
  );
}

function PointHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ff6a3d]/15 text-[#ff6a3d]">
        <CheckCircle2 size={14} aria-hidden="true" />
      </span>
      <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">{title}</h3>
    </div>
  );
}

const WarehousingInventoryStoragePage = () => {
  return (
    <div className="ofc-tw min-h-screen bg-[#070b12] text-white">
      <OfcTwHeader activeHref={OFC_WAREHOUSE_PATH} />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,106,61,0.16),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(47,211,200,0.1),transparent_45%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#2fd3c8]">
                Solutions
              </p>
              <h1 className="max-w-[12ch] text-4xl font-extrabold tracking-[-0.05em] text-white md:text-6xl">
                Complete <span className="text-[#ff6a3d]">Solution</span> for{" "}
                <span className="text-[#ff6a3d]">Inventory Storage</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#9aa6b8] md:text-lg">
                Scale warehousing for brands and retailers with distributed storage,
                live inventory control, and fulfillment-ready operations across B2B
                and B2C channels.
              </p>
            </div>
            <HubVisual />
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="space-y-10">
              <div>
                <PointHeading title="Distributed warehouse for B2B and B2C Order fulfillment" />
                <p className="pl-9 text-[15px] leading-7 text-[#9aa6b8]">
                  Strategically located warehouses reduce shipping times and costs for
                  both B2B and B2C models, so inventory sits closer to demand and orders
                  leave the network faster.
                </p>
              </div>
              <div>
                <PointHeading title="Freight consolidation and optimization" />
                <p className="pl-9 text-[15px] leading-7 text-[#9aa6b8]">
                  Consolidating smaller shipments into larger, optimized loads lowers
                  overall logistics cost while improving delivery reliability across the
                  fulfillment network.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/assets/img/about/oca/about-warehouse-hero.jpg"
                alt="Warehouse team scanning and handing off inventory"
                width={900}
                height={700}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="overflow-hidden rounded-[28px] lg:sticky lg:top-28">
              <Image
                src="/src/assets/images/warehouse-fulfillment-overview-hero.png"
                alt="Forklift operator moving inventory through warehouse aisles"
                width={900}
                height={1100}
                className="h-full min-h-[420px] w-full object-cover"
              />
            </div>
            <div className="space-y-8">
              {CORE_POINTS.map((point) => (
                <div key={point.title}>
                  <PointHeading title={point.title} />
                  <p className="pl-9 text-[15px] leading-7 text-[#9aa6b8]">{point.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="space-y-10">
              {VALUE_POINTS.map((point) => (
                <div key={point.title}>
                  <PointHeading title={point.title} />
                  <p className="pl-9 text-[15px] leading-7 text-[#9aa6b8]">{point.copy}</p>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/src/assets/images/inventory-visibility-overview-hero.png"
                alt="Warehouse aisle with organized racking and inventory flow"
                width={900}
                height={700}
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0b1220]">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Warehouse, label: "Distributed storage network" },
              { icon: Boxes, label: "Real-time inventory control" },
              { icon: Truck, label: "B2B & B2C fulfillment ready" },
              { icon: Shield, label: "Secure facility operations" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <Icon className="mb-3 text-[#ff6a3d]" size={22} aria-hidden="true" />
                  <p className="text-sm font-bold tracking-tight text-white">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-[#05070c]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Image
              src="/assets/img/logo/onefulfillcenter-logo-light.png"
              alt="One Fulfill Center"
              width={180}
              height={38}
              className="mb-5 h-auto w-44"
            />
            <div className="space-y-2 text-sm leading-6 text-[#9aa6b8]">
              <p className="flex items-start gap-2">
                <Building2 size={16} className="mt-1 shrink-0" aria-hidden="true" />
                <span>8730 Lake Road, Suite 300, Orlando, FL 32819 US</span>
              </p>
              <p>
                <a
                  href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-white"
                >
                  {company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.investorEmail}`} className="hover:text-white">
                  {company.investorEmail}
                </a>
              </p>
              <p className="pt-2 text-xs text-white/40">{company.address}</p>
            </div>
          </div>

          {FOOTER_COLS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-bold text-white">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#9aa6b8] hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5">
          <p className="text-sm text-[#9aa6b8]">
            © {new Date().getFullYear()} onefulfillcenter. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                aria-label={item.title}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/80 hover:border-[#2fd3c8]/40 hover:text-[#2fd3c8]"
              >
                <i className={item.icon} aria-hidden="true" />
              </Link>
            ))}
            <a
              href="#top"
              className="ml-2 grid h-9 w-9 place-items-center rounded-lg bg-[#2fd3c8] text-[#04201e]"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WarehousingInventoryStoragePage;
