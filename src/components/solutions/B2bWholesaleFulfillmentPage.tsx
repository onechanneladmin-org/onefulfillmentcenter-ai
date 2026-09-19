import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  Network,
  Package,
  RotateCcw,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";
import OfcTwHeader from "./OfcTwHeader";
import { OFC_B2B_FULFILLMENT_PATH, OFC_WAREHOUSE_PATH } from "@/data/ofcNav";
import { company, socialLinks } from "@/data/brandArchitecture";

const HUB = [
  { label: "E-commerce store", icon: Store, angle: -30 },
  { label: "Bulk Orders", icon: Package, angle: 30 },
  { label: "Warehouse locations", icon: Warehouse, angle: 90 },
  { label: "Returns management", icon: RotateCcw, angle: 150 },
  { label: "Multi-channel orders", icon: Network, angle: 210 },
  { label: "Real-time inventory", icon: Boxes, angle: 270 },
] as const;

const SECTIONS = [
  {
    eyebrow: "Operations",
    title: "Streamline Your B2C and B2B Fulfillment Operations",
    points: [
      {
        title: "Handle Diverse Product Requirements",
        copy: "Support varied SKUs, pack rules, and wholesale case packs from one fulfillment network without slowing down consumer order speed.",
      },
    ],
    image: "/assets/img/ofc/ofc-b2b-fulfillment-pack.jpg",
    imageAlt: "Packing stations preparing ecommerce and wholesale orders",
    side: "image-left" as const,
  },
  {
    eyebrow: "Growth",
    title: "Scale to Meet Your Growing Business Needs",
    points: [
      {
        title: "Enhance B2C Order Fulfillment Efficiency",
        copy: "Move direct-to-consumer orders through guided pick, pack, and ship workflows so customers get faster delivery and fewer misses.",
      },
    ],
    image: "/assets/img/ofc/ofc-b2c-delivery-handoff.jpg",
    imageAlt: "Courier delivering a package to a customer",
    side: "image-right" as const,
  },
  {
    eyebrow: "Wholesale",
    title: "Optimize B2B Fulfillment for Bulk Orders",
    points: [
      {
        title: "Leverage Real-Time Inventory Tracking",
        copy: "Keep wholesale and retail inventory visible in real time so bulk allocations, channel reservations, and replenishment stay accurate.",
      },
    ],
    image: "/assets/img/ofc/ofc-b2b-bulk-warehouse.jpg",
    imageAlt: "Bulk pallets staged in a wholesale warehouse aisle",
    side: "image-left" as const,
  },
  {
    eyebrow: "Automation",
    title: "Implement Automated Order Processing",
    points: [
      {
        title: "Provide Comprehensive Order Tracking",
        copy: "Automate routing and status updates so every B2B and B2C shipment stays visible from release to final delivery confirmation.",
      },
    ],
    image: "/assets/img/ofc/ofc-automation-robot.jpg",
    imageAlt: "Warehouse automation robot moving inventory",
    side: "image-right" as const,
  },
  {
    eyebrow: "Returns",
    title: "Manage Returns Efficiently",
    points: [
      {
        title: "Focus on Your Business Competencies",
        copy: "Let reverse logistics handle inspection, restock, and disposition while your team stays focused on selling and brand growth.",
      },
    ],
    image: "/assets/img/ofc/ofc-returns-scan.jpg",
    imageAlt: "Worker scanning a returned package in the warehouse",
    side: "image-left" as const,
  },
  {
    eyebrow: "Intelligence",
    title: "Multi-channel Order Management",
    points: [
      {
        title: "Enhanced Analytics",
        copy: "Unify channel orders and performance signals so operations teams can spot bottlenecks, improve fill rates, and plan capacity.",
      },
    ],
    image: "/assets/img/ofc/ofc-fulfillment-analytics.jpg",
    imageAlt: "Operations analytics dashboards for fulfillment performance",
    side: "image-right" as const,
  },
] as const;

const COST_POINTS = [
  {
    title: "Cost Savings",
    copy: "Reduce fragmented shipping and idle inventory cost by consolidating fulfillment into one distributed operating model.",
  },
  {
    title: "Tiered Pricing and Bulk Ordering",
    copy: "Support wholesale economics with tiered handling, case-pack workflows, and volume-ready outbound processes.",
  },
  {
    title: "Distributed Warehouses for B2B Delivery",
    copy: "Place inventory closer to regional buyers so B2B deliveries move faster with lower freight friction.",
  },
] as const;

function HubVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute inset-[14%] rounded-full border border-[#f5c542]/30 bg-[radial-gradient(circle_at_center,rgba(245,197,66,0.16),transparent_70%)]" />
      <div className="absolute inset-[28%] rounded-full border border-white/10" />
      {HUB.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 40;
        const y = 50 + Math.sin(rad) * 40;
        const Icon = node.icon;
        return (
          <div
            key={node.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="flex min-w-[108px] flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#101826]/95 px-3 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f5c542]/15 text-[#f5c542]">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="max-w-[90px] text-[10px] font-bold leading-tight text-white">
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0b1220] shadow-[0_0_40px_rgba(47,211,200,0.18)]">
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

const B2bWholesaleFulfillmentPage = () => {
  return (
    <div className="ofc-tw min-h-screen bg-[#070b12] text-white">
      <div className="bg-[#070b12]">
        <OfcTwHeader activeHref={OFC_B2B_FULFILLMENT_PATH} />

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,rgba(245,197,66,0.16),transparent_50%),radial-gradient(ellipse_at_10%_90%,rgba(47,211,200,0.12),transparent_45%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#2fd3c8]">
                Solutions
              </p>
              <h1 className="max-w-[13ch] text-4xl font-extrabold tracking-[-0.05em] text-white md:text-6xl">
                <span className="text-[#f5c542]">B2C &amp; B2B</span> Wholesale Fulfillment
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
                Run consumer and wholesale orders through one fulfillment network —
                from multi-channel intake to bulk shipping, tracking, returns, and
                analytics.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={company.demoUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2fd3c8] px-6 py-3 text-sm font-bold text-[#04201e] transition hover:-translate-y-0.5"
                >
                  Request a Demo
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href={OFC_WAREHOUSE_PATH}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#101826]/5"
                >
                  Inventory Storage
                </Link>
              </div>
            </div>
            <HubVisual />
          </div>
        </section>
      </div>

      <main>
        {SECTIONS.map((section, index) => {
          const imageFirst = section.side === "image-left";
          return (
            <section
              key={section.title}
              className={`border-b border-white/10 ${index % 2 === 1 ? "bg-[#101826]" : "bg-[#070b12]"}`}
            >
              <div
                className={`mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:gap-14 lg:py-24 ${
                  imageFirst ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]"
                }`}
              >
                <div className={imageFirst ? "order-2 lg:order-1" : "order-2 lg:order-2"}>
                  <div className="overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(16,24,40,0.1)]">
                    <Image
                      src={section.image}
                      alt={section.imageAlt}
                      width={1200}
                      height={800}
                      className="h-[320px] w-full object-cover md:h-[420px]"
                    />
                  </div>
                </div>

                <div className={imageFirst ? "order-1 lg:order-2" : "order-1 lg:order-1"}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#2fd3c8]">
                    {section.eyebrow}
                  </p>
                  <h2 className="max-w-[16ch] text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-8 space-y-6">
                    {section.points.map((point) => (
                      <div key={point.title}>
                        <h3 className="text-lg font-bold tracking-tight text-white">
                          {point.title}
                        </h3>
                        <p className="mt-2 max-w-md text-[15px] leading-7 text-[#9aa6b8]">
                          {point.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <section className="border-b border-white/10 bg-[#101826]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#2fd3c8]">
                Economics
              </p>
              <h2 className="max-w-[14ch] text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                Cost Savings Built for Wholesale Growth
              </h2>
              <div className="mt-8 space-y-6">
                {COST_POINTS.map((point) => (
                  <div key={point.title} className="border-t border-[#e4ebf2] pt-5">
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {point.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-7 text-[#9aa6b8]">
                      {point.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(16,24,40,0.1)]">
                <Image
                  src="/assets/img/ofc/ofc-cost-savings.jpg"
                  alt="Cost savings metaphor for fulfillment economics"
                  width={1000}
                  height={750}
                  className="h-[280px] w-full object-cover md:h-[360px]"
                />
              </div>
              <div className="absolute -bottom-8 left-8 hidden w-[55%] overflow-hidden rounded-[24px] border-4 border-white shadow-[0_18px_40px_rgba(16,24,40,0.16)] md:block">
                <Image
                  src="/assets/img/ofc/ofc-b2b-ops-planning.jpg"
                  alt="Operations team planning wholesale fulfillment"
                  width={700}
                  height={520}
                  className="h-[180px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#070b12]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                Ready to unify B2C and B2B fulfillment?
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/65">
                See how Onefulfillcenter runs wholesale and consumer orders through one
                distributed warehouse network.
              </p>
            </div>
            <Link
              href={company.demoUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#f5c542] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Talk to sales
              <Truck size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#05070c] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-3">
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
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">Pages</h4>
            <ul className="space-y-2 text-sm text-[#9aa6b8]">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href={OFC_WAREHOUSE_PATH} className="hover:text-white">
                  Warehousing and Inventory Storage
                </Link>
              </li>
              <li>
                <Link href={OFC_B2B_FULFILLMENT_PATH} className="hover:text-white">
                  B2C &amp; B2B Wholesale Fulfillment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">Get started</h4>
            <ul className="space-y-2 text-sm text-[#9aa6b8]">
              <li>
                <Link href={company.demoUrl} className="hover:text-white">
                  Request a Demo
                </Link>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
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
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-white/10 px-6 py-5 text-sm text-[#9aa6b8]">
          <p>© {new Date().getFullYear()} onefulfillcenter. All rights reserved.</p>
          <BarChart3 size={16} className="text-[#2fd3c8]" aria-hidden="true" />
        </div>
      </footer>
    </div>
  );
};

export default B2bWholesaleFulfillmentPage;
