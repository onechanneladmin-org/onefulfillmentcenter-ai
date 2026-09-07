import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Boxes,
  Check,
  Cpu,
  Package,
  Plug,
  Receipt,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import OfcTwHeader from "./OfcTwHeader";
import SpatialNav from "./SpatialNav";
import SpatialPhoto from "./SpatialPhoto";
import {
  relatedServices,
  servicePath,
  type ServiceLanding,
} from "@/data/serviceLandings";
import { company } from "@/data/brandArchitecture";
import { visualsForService } from "@/data/serviceVisuals";

const TRUST = [
  "Live inventory sync",
  "B2B + B2C + marketplaces",
  "WMS, shipping & returns",
  "Rate shopping · parcel / LTL / FTL",
];

const BENEFITS = [
  { title: "Faster handoff", copy: "Shorter time from order to carrier." },
  { title: "Less ops overhead", copy: "No warehouse staffing to run yourself." },
  { title: "Accurate stock", copy: "Know what is available and where." },
  { title: "Smarter shipping", copy: "Compare services before you print a label." },
  { title: "Room to scale", copy: "Add SKUs and channels without a rebuild." },
  { title: "Better CX", copy: "Correct orders, tracking, and returns." },
];

const TECH = [
  { title: "Connected inventory", copy: "Stock across warehouses, stores, 3PLs, and channels." },
  { title: "Order management", copy: "Storefront, marketplace, and wholesale orders in one queue." },
  { title: "Warehouse WMS", copy: "Receive, putaway, pick, pack, count, and ship." },
  { title: "Demand planning", copy: "Forecast and replenish before stockouts." },
  { title: "Shipping automation", copy: "Rate shop parcel, LTL, and FTL; track to the door." },
  { title: "Returns / RMA", copy: "Authorize, inspect, restock, or disposition." },
];

const INTEGRATIONS = [
  { title: "Storefronts", items: ["Shopify", "Shopify Plus", "WooCommerce", "BigCommerce", "Magento"] },
  { title: "Marketplaces", items: ["Amazon", "Walmart", "eBay", "TikTok Shop", "Etsy"] },
  { title: "ERP & POS", items: ["OneChannelAdmin", "NetSuite", "QuickBooks", "Xero"] },
  { title: "Carriers", items: ["UPS", "FedEx", "USPS", "DHL"] },
];

const AUDIENCES = [
  { title: "Ecommerce brands", copy: "DTC volume that outgrew in-house packing." },
  { title: "B2B companies", copy: "Wholesale, dealers, and pallet orders." },
  { title: "Marketplace sellers", copy: "Amazon, Walmart, eBay, TikTok." },
  { title: "Retail brands", copy: "Store replenishment and retail DCs." },
  { title: "Manufacturers", copy: "Finished-goods storage and outbound." },
  { title: "Multi-channel ops", copy: "Several channels, one inventory truth." },
];

const INDUSTRIES = [
  "Apparel",
  "Beauty",
  "Electronics",
  "Auto parts",
  "Health",
  "Home",
  "Jewelry",
  "Toys",
  "Sporting goods",
  "Pet",
  "Medical",
  "CPG",
];

const WHY = [
  { title: "One connected stack", copy: "Listings, inventory, WMS, shipping, and returns on OneChannelAdmin." },
  { title: "B2B + B2C + retail", copy: "Wholesale, DTC, marketplace, and store replenishment share stock." },
  { title: "Multi-warehouse view", copy: "Alerts, kits, and forecasting across sites." },
  { title: "Carrier rate shopping", copy: "Parcel, LTL, and FTL compared per order." },
  { title: "WMS-grade floor", copy: "ASN, directed pick, scan-to-pack, RFID, cycle counts." },
  { title: "Returns that recover stock", copy: "RMA back into available-to-sell inventory." },
];

const COMPARISON = [
  ["Inventory management", "Connected, real-time", "Often siloed"],
  ["B2B + B2C + marketplaces", "One operation", "Usually split"],
  ["WMS + shipping + RMA", "Built in", "Add-on or missing"],
  ["Rate shopping", "Parcel, LTL, FTL", "Limited"],
  ["Client / 3PL visibility", "Portals & SLAs", "Varies"],
  ["Technology", "OneChannelAdmin", "Disconnected tools"],
];

const ONBOARDING = [
  { title: "Assess", copy: "Volume, SKUs, channels, shipping, returns." },
  { title: "Connect", copy: "Store, marketplace, or ERP." },
  { title: "Inbound", copy: "Receive and put away inventory." },
  { title: "Test", copy: "Run sample orders end to end." },
  { title: "Go live", copy: "Production fulfillment starts." },
];

const PRICING_FACTORS = [
  { title: "Monthly order volume", hint: "Orders / month that set the base rate" },
  { title: "SKU count", hint: "Catalog breadth and slot complexity" },
  { title: "Dimensions and weight", hint: "Carton size drives packing & freight" },
  { title: "Storage needs", hint: "Pallet, bin, and climate requirements" },
  { title: "Lines per order", hint: "Multi-line picks cost more to assemble" },
  { title: "Packaging", hint: "Branded inserts, void fill, custom kits" },
  { title: "Destinations", hint: "Domestic zones and international lanes" },
  { title: "Returns volume", hint: "RMA rate and restock handling" },
  { title: "Kitting", hint: "Assembly, bundling, and value-add work" },
] as const;

const COST_CATEGORIES = [
  { title: "Receiving", hint: "Inbound ASN, putaway, QC" },
  { title: "Storage", hint: "Occupied slots billed monthly" },
  { title: "Pick and pack", hint: "Per-order and per-line work" },
  { title: "Packaging", hint: "Materials and branded inserts" },
  { title: "Shipping", hint: "Carrier labels with rate shopping" },
  { title: "Kitting", hint: "Build kits before peak demand" },
  { title: "Returns", hint: "Inspect, restock, or disposition" },
  { title: "Projects", hint: "Special ops and one-off work" },
] as const;

const ServiceLandingPage = ({ page }: { page: ServiceLanding }) => {
  const related = relatedServices(page);
  const [heroVisual, processVisual, floorVisual] = visualsForService(page.slug);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="ofc-tw spatial-page service-spatial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <OfcTwHeader activeHref={servicePath(page.slug)} />

      <div className="spatial-crumb">
        <div className="spatial-wrap">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Services</span>
          <span aria-hidden="true">/</span>
          <strong>{page.name}</strong>
        </div>
      </div>

      <SpatialNav />

      <main>
        <section id="overview" className="spatial-hero">
          <div className="spatial-hero__glow" aria-hidden="true" />
          <div className="spatial-wrap spatial-hero__grid">
            <div className="spatial-hero__copy">
              <p className="spatial-kicker">{page.primaryKeyword}</p>
              <h1>{page.h1}</h1>
              <p className="spatial-lede">{page.heroCopy}</p>
              <div className="spatial-cta-row">
                <a className="spatial-btn spatial-btn--teal" href={`mailto:${company.investorEmail}`}>
                  Talk to a specialist
                </a>
                <a className="spatial-btn spatial-btn--ghost" href="#process">
                  See how it works
                </a>
              </div>
              <ul className="spatial-trust">
                {TRUST.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="spatial-hero__stage">
              <SpatialPhoto
                visual={heroVisual}
                className="spatial-photo--hero"
                priority
                sizes="(min-width: 1100px) 520px, 100vw"
              />
              <aside className="spatial-definition">
                <p className="spatial-kicker">In one sentence</p>
                <h2>{page.definition.question}</h2>
                <p>{page.definition.answer}</p>
              </aside>
            </div>
          </div>
        </section>

        <div className="spatial-shell">
          <div className="spatial-wrap spatial-shell__grid">
            <article className="spatial-main">
              <section className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Challenges</p>
                  <h2>{page.problemsTitle}</h2>
                  <p>
                    These issues usually show up together. OneFulfillCenter treats warehousing,
                    inventory, fulfillment, shipping, and returns as one space—not five vendors.
                  </p>
                </header>
                <div className="spatial-problem-grid">
                  {page.problems.map((group) => (
                    <div key={group.title} className="spatial-problem">
                      <h3>{group.title}</h3>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="process" className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Process</p>
                  <h2>{page.processTitle}</h2>
                  <p>{page.howItWorksAnswer}</p>
                </header>
                <div className="spatial-process">
                  <ol className="spatial-spine">
                    {page.process.map((step, index) => (
                      <li key={step.title}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{step.title}</h3>
                          <p>{step.copy}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <SpatialPhoto
                    visual={processVisual}
                    className="spatial-photo--process"
                    sizes="(min-width: 900px) 380px, 100vw"
                  />
                </div>
                <a className="spatial-text-link" href={`mailto:${company.investorEmail}`}>
                  Start fulfillment with 1FC <ArrowRight size={16} />
                </a>
              </section>

              <section id="capabilities" className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Capabilities</p>
                  <h2>{page.featuresTitle}</h2>
                </header>
                <div className="spatial-bento">
                  {page.features.map((feature) => (
                    <article key={feature.title}>
                      <div className="spatial-bento__icon">
                        <Boxes size={18} />
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.copy}</p>
                      <ul>
                        {feature.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <SpatialPhoto
                visual={floorVisual}
                className="spatial-photo--wide"
                sizes="(min-width: 1160px) 1160px, 100vw"
              />

              <section className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Outcomes</p>
                  <h2>What your operation gains</h2>
                </header>
                <ul className="spatial-gain">
                  {BENEFITS.map((item) => (
                    <li key={item.title}>
                      <Check size={16} />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.copy}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="platform" className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">
                    <Cpu size={14} /> OneChannelAdmin
                  </p>
                  <h2>Fulfillment on a connected commerce platform</h2>
                  <p>
                    Listings, inventory, warehouse work, shipping, and returns share the same
                    system OneFulfillCenter runs in the building.
                  </p>
                </header>
                <div className="spatial-tech">
                  {TECH.map((item) => (
                    <article key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  ))}
                </div>
                <div className="spatial-integrations">
                  <p className="spatial-kicker">
                    <Plug size={14} /> Connect what you already sell on
                  </p>
                  {INTEGRATIONS.map((group) => (
                    <div key={group.title}>
                      <h3>{group.title}</h3>
                      <p>{group.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Who it&apos;s for</p>
                  <h2>Built for growing commerce teams</h2>
                  <p>{page.whoNeedsAnswer}</p>
                </header>
                <div className="spatial-audience">
                  {AUDIENCES.map((item) => (
                    <article key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  ))}
                </div>
                <ul className="spatial-chips">
                  {INDUSTRIES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">
                    <ShieldCheck size={14} /> Why 1FC
                  </p>
                  <h2>A fulfillment floor, not a disconnected warehouse</h2>
                </header>
                <div className="spatial-split">
                  <ul className="spatial-why">
                    {WHY.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span>{item.copy}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="spatial-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Capability</th>
                          <th>OneFulfillCenter</th>
                          <th>Typical warehouse</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COMPARISON.map((row) => (
                          <tr key={row[0]}>
                            <th>{row[0]}</th>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">Onboarding</p>
                  <h2>Onboard without stopping sales</h2>
                </header>
                <ol className="spatial-flow">
                  {ONBOARDING.map((step, index) => (
                    <li key={step.title}>
                      <span>{index + 1}</span>
                      <h3>{step.title}</h3>
                      <p>{step.copy}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="pricing" className="spatial-block spatial-pricing">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">
                    <BadgeDollarSign size={14} /> Pricing
                  </p>
                  <h2>Pricing around your operation</h2>
                  <p>{page.costAnswer}</p>
                </header>

                <div className="spatial-pricing__grid">
                  <div className="spatial-pricing__panel">
                    <div className="spatial-pricing__panel-head">
                      <span className="spatial-pricing__icon">
                        <Package size={18} />
                      </span>
                      <div>
                        <h3>What we quote against</h3>
                        <p>Inputs that shape your rate card</p>
                      </div>
                    </div>
                    <ul className="spatial-pricing__list">
                      {PRICING_FACTORS.map((item) => (
                        <li key={item.title}>
                          <Check size={14} />
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.hint}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="spatial-pricing__panel spatial-pricing__panel--accent">
                    <div className="spatial-pricing__panel-head">
                      <span className="spatial-pricing__icon spatial-pricing__icon--teal">
                        <Receipt size={18} />
                      </span>
                      <div>
                        <h3>Cost categories</h3>
                        <p>Where spend typically shows up</p>
                      </div>
                    </div>
                    <div className="spatial-pricing__cats">
                      {COST_CATEGORIES.map((item) => (
                        <article key={item.title}>
                          <Warehouse size={16} />
                          <div>
                            <h4>{item.title}</h4>
                            <p>{item.hint}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="spatial-pricing__cta">
                  <div>
                    <h3>Get a quote built for your SKUs</h3>
                    <p>
                      Share volume, channels, and packaging needs — we map a clear rate card
                      without surprise add-ons.
                    </p>
                  </div>
                  <a className="spatial-btn spatial-btn--teal" href={`mailto:${company.investorEmail}`}>
                    Request pricing
                    <ArrowRight size={16} />
                  </a>
                </div>
              </section>

              <section id="faq" className="spatial-block">
                <header className="spatial-block__head">
                  <p className="spatial-kicker">FAQ</p>
                  <h2>Questions teams ask first</h2>
                </header>
                <div className="spatial-faq">
                  {page.faqs.map((item) => (
                    <details key={item.q}>
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="spatial-block spatial-related">
                <h2>Nearby services</h2>
                <div>
                  {related.map((item) => (
                    <Link key={item.slug} href={servicePath(item.slug)}>
                      {item.name}
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="spatial-cta-band">
                <div>
                  <p className="spatial-kicker">Next step</p>
                  <h2>Ready to move {page.name.toLowerCase()} onto 1FC?</h2>
                  <p>
                    Tell us your channels, SKUs, and volume. We&apos;ll map the floor workflow and a
                    clear quote.
                  </p>
                </div>
                <a className="spatial-btn spatial-btn--teal" href={`mailto:${company.investorEmail}`}>
                  Talk to a specialist
                  <ArrowRight size={16} />
                </a>
              </section>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceLandingPage;
