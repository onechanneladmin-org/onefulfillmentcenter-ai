import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import OfcTwHeader from "@/components/solutions/OfcTwHeader";
import HomeProcess from "@/components/homes/HomeProcess";
import HomeHowItWorks from "@/components/homes/HomeHowItWorks";
import HomeServices from "@/components/homes/HomeServices";
import HomeNewsletter from "@/components/homes/HomeNewsletter";
import WarehouseLocationsMap from "@/components/homes/WarehouseLocationsMap";
import { company, socialLinks } from "@/data/brandArchitecture";
import { SERVICE_NAV } from "@/data/ofcNav";

const BENEFITS = [
  {
    title: "Multiple warehouses",
    src: "/assets/img/home/benefits/multiple-warehouses.png",
  },
  {
    title: "Best Shipping Prices",
    src: "/assets/img/home/benefits/shipping-prices.png",
  },
  {
    title: "Unlimited Products",
    src: "/assets/img/home/benefits/unlimited-products.png",
  },
  {
    title: "Robust Fulfillment Software",
    src: "/assets/img/home/benefits/fulfillment-software.png",
  },
  {
    title: "Inventory Management",
    src: "/assets/img/home/benefits/inventory-management.png",
  },
  {
    title: "Grow your business globally",
    src: "/assets/img/home/benefits/grow-globally.png",
  },
  {
    title: "Order Processing",
    src: "/assets/img/home/benefits/order-processing.png",
  },
  {
    title: "Wholesale fulfillment",
    src: "/assets/img/home/benefits/wholesale-fulfillment.png",
  },
  {
    title: "Returns Processing",
    src: "/assets/img/home/benefits/returns-processing.png",
  },
  {
    title: "Multiple warehouses",
    src: "/assets/img/home/benefits/multiple-warehouses.png",
  },
] as const;

const INDUSTRIES = [
  {
    title: "Apparel",
    copy: "Designate product variations like color or size and fulfill fashion orders with speed and accuracy.",
    src: "/assets/img/home/industries/apparel-building.png",
  },
  {
    title: "Arts & Crafts Supply",
    copy: "Handle diverse craft inventory—from beads to kits—with organized storage and flexible shipping.",
    src: "/assets/img/home/industries/icon-arts.png",
  },
  {
    title: "Auto Spare Parts & Car Accessories",
    copy: "Support growing demand for eCommerce car parts with reliable SKU tracking and wholesale fulfillment.",
    src: "/assets/img/home/industries/icon-auto.png",
  },
  {
    title: "Beauty, Cosmetics & Face Creams",
    copy: "Scale beauty supply fulfillment as social-driven demand grows, with careful packaging and returns support.",
    src: "/assets/img/home/industries/icon-beauty.png",
  },
  {
    title: "Building Supplies",
    copy: "Ship interior and exterior project materials with warehouse capacity built for bulkier goods.",
    src: "/assets/img/home/industries/icon-building.png",
  },
  {
    title: "Camping Outdoor & Hunting Equipment",
    copy: "Keep outdoor and hunting equipment moving through peak seasons with multi-warehouse coverage.",
    src: "/assets/img/home/industries/icon-camping.png",
  },
  {
    title: "Consumer Goods",
    copy: "Stay ahead of short shelf-life inventory with real-time stock visibility and fast order turnaround.",
    src: "/assets/img/home/industries/icon-consumer.png",
  },
  {
    title: "Dental Equipment & Medical Supplies",
    copy: "Fulfill specialized equipment and supplies where availability and delivery timing matter most.",
    src: "/assets/img/home/industries/icon-dental.png",
  },
] as const;

const phoneTel = `tel:${company.phone.replace(/[^+\d]/g, "")}`;

const FOOTER_COLS = [
  {
    title: "Fulfillment",
    links: SERVICE_NAV.slice(0, 6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "More services",
    links: SERVICE_NAV.slice(6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "Resources",
    links: [
      { label: "Fulfillment Blog", href: "/blog/" },
      { label: "Request a Demo", href: "#newsletter" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: company.phone, href: phoneTel },
      { label: company.investorEmail, href: `mailto:${company.investorEmail}` },
    ],
  },
] as const;

const SpatialHome = () => {
  return (
    <div className="ofc-tw spatial-page home-spatial">
      <OfcTwHeader activeHref="/" />

      <main>
        <section className="home-hero">
          <div className="home-hero__bg" aria-hidden="true">
            <Image
              src="/assets/img/home/home-hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="home-hero__scrim" />
          </div>

          <div className="spatial-wrap home-hero__grid">
            <div className="home-hero__copy">
              <h1>
                Next Generation <em>Fulfillment Center</em>
              </h1>
              <p className="home-hero__for">
                for <em>Brands &amp; Retailers</em>
              </p>
              <p className="spatial-lede">
                Omni-channel fulfillment, with a distributed warehouse network, optimizes B2B
                and B2C order processing, ensuring businesses deliver orders swiftly and
                efficiently.
              </p>
              <div className="spatial-cta-row">
                <Link className="spatial-btn spatial-btn--lime" href="#newsletter">
                  Request a Demo
                  <Send size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="home-hero__stage">
              <Image
                src="/assets/img/home/hero-person.png"
                alt="Fulfillment associate holding a ready-to-ship package"
                width={471}
                height={523}
                priority
                className="home-hero__person"
                sizes="(min-width: 900px) 460px, 80vw"
              />
            </div>
          </div>
        </section>

        <div className="spatial-wrap home-stack">
          <HomeProcess />
          {/* <HomeServices /> */}

          <HomeHowItWorks />

          <section className="spatial-block" id="supply-chain">
            <div className="home-chain-block">
              <header className="home-chain-block__head">
                <h2>Products Supply Chain From Factory to Customers</h2>
                <p className="spatial-lede">
                  Simplify order fulfillment for B2B and D2C businesses across all sales channels
                  with OneChannelAdmin&apos;s distributed warehouse network, enabling fast delivery
                  and worry-free business expansion.
                </p>
              </header>
              <figure className="home-chain-block__diagram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/home/supply-chain-with-box.svg"
                  alt="Supply chain from manufacture and factories through warehouses to distributors, ecommerce channels, and customers"
                  width={1050}
                  height={502}
                />
              </figure>
            </div>
          </section>

          <section className="spatial-block" id="benefits">
            <header className="spatial-block__head home-benefits__head">
              <h2>Benefits</h2>
              <p>
                Your one-stop fulfillment hub for seamless success, handling both B2B and B2C
                orders with comprehensive solutions for storage, fulfillment, and shipping.
              </p>
            </header>
            <div className="home-benefits">
              {BENEFITS.map((benefit, index) => (
                <article key={`${benefit.title}-${index}`}>
                  <span className="home-benefits__icon">
                    <Image
                      src={benefit.src}
                      alt=""
                      width={97}
                      height={96}
                      sizes="72px"
                    />
                  </span>
                  <h3>{benefit.title}</h3>
                </article>
              ))}
            </div>
          </section>

          <section className="spatial-block" id="software">
            <div className="home-software">
              <div className="home-software__copy">
                <h2>Onefulfillcenter Software For Your Supply Chain</h2>
                <p className="spatial-lede">
                  An advanced, scalable, and technologically sophisticated platform seamlessly
                  integrates across diverse sales, third-party logistics (3PL), Shipping carriers,
                  and marketing channels. It centralizes inventory management through cutting-edge
                  solutions and offers an intuitive dashboard for user-friendly navigation.
                </p>
                <Link className="spatial-btn spatial-btn--cyan" href="#newsletter">
                  Learn More
                  <Send size={16} aria-hidden="true" />
                </Link>
              </div>
              <figure className="home-software__phone">
                <Image
                  src="/assets/img/home/software-phone.png"
                  alt="One Channel Admin mobile dashboard showing sales, returns, open, and pending orders"
                  width={324}
                  height={403}
                  sizes="(min-width: 900px) 320px, 240px"
                  priority={false}
                />
              </figure>
            </div>
          </section>

          <section className="home-integrations" id="integrations" aria-labelledby="integrations-heading">
            <h2 id="integrations-heading" className="home-integrations__sr-only">
              Connect to your favourite apps
            </h2>
            <figure className="home-integrations__visual">
              <Image
                src="/assets/img/home/connect-apps.png"
                alt="One Channel Admin connected to Amazon, Walmart, eBay, Etsy, Stripe, PayPal, FedEx, Google Ads, Facebook, and Avalara"
                width={1440}
                height={683}
                sizes="(min-width: 1400px) 1400px, 100vw"
                priority={false}
              />
            </figure>
          </section>
        </div>

        <WarehouseLocationsMap />

        <div className="spatial-wrap home-stack">
          <section className="spatial-block" id="industries">
            <header className="spatial-block__head home-industries__head">
              <h2>Industries</h2>
              <p>
                Companies from many diverse industries use the ONEFULFILLCENTER growth platform to
                achieve their desired eCommerce goals.
              </p>
            </header>
            <div className="home-industries">
              {INDUSTRIES.map((industry) => (
                <article key={industry.title}>
                  <span className="home-industries__icon">
                    <Image
                      src={industry.src}
                      alt=""
                      width={84}
                      height={84}
                      sizes="72px"
                    />
                  </span>
                  <div>
                    <h3>{industry.title}</h3>
                    <p>{industry.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <HomeNewsletter />
        </div>
      </main>

      <footer className="home-foot">
        <div className="spatial-wrap home-foot__grid home-foot__grid--wide">
          <div>
            <Link href="/">
              <Image
                src="/assets/img/logo/onefulfillcenter-logo-light.png"
                alt="One Fulfillment Center"
                width={180}
                height={38}
              />
            </Link>
            <p>
              Distributed fulfillment infrastructure for brands and retailers: warehousing,
              inventory storage, B2B/B2C order fulfillment, reverse logistics, and shipping
              support.
            </p>
            <p>
              <Link href={phoneTel}>{company.phone}</Link>
            </p>
            <p>
              <Link href={`mailto:${company.investorEmail}`}>{company.investorEmail}</Link>
            </p>
            <p>{company.address}</p>
          </div>
          {FOOTER_COLS.map((column) => (
            <div key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="spatial-wrap home-foot__bottom">
          <p>© {new Date().getFullYear()} One Fulfillment Center</p>
          <div className="home-foot__social">
            {socialLinks.map((item) => (
              <Link key={item.title} href={item.href} aria-label={item.title} target="_blank" rel="noreferrer">
                <i className={item.icon} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpatialHome;
