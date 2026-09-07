import type { Metadata } from "next";
import Wrapper from "@/layout/Wrapper";
import OfcHeader from "@/components/homes/multi-page/home/ofc/OfcHeader";
import OfcNewsletterFooter from "@/components/homes/multi-page/home/ofc/OfcNewsletterFooter";
import { company } from "@/data/brandArchitecture";
import { createPageMetadata, SeoStructuredData } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/terms-of-service/", {
    title: "Terms of Service | OneFulfillCenter",
    description:
      "Review the Terms of Service governing fulfillment, storage, receiving, shipping, and third-party logistics services provided by OneFulfillCenter.",
  });
}

export default function TermsOfServicePage() {
  return (
    <Wrapper>
      <SeoStructuredData
        path="/terms-of-service/"
        fallbackTitle="Terms of Service | OneFulfillCenter"
      />
      <OfcHeader />
      <main style={{ backgroundColor: "#0b0f19", color: "#e2e8f0", minHeight: "80vh", padding: "120px 20px 80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#ffffff" }}>
            OneFulfillCenter Terms of Service
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Last updated: September 7, 2026
          </p>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing our website, entering into a service agreement, or delivering goods to any OneFulfillCenter warehouse facility, you agree to be bound by these Terms of Service and all related operating procedures. If you do not agree to these terms, do not ship goods to our warehouses or utilize our fulfillment services.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              2. Warehouse Receiving & Inbound Shipments
            </h2>
            <p>
              All inbound shipments must follow our Advance Shipping Notice (ASN) protocols. Inbound pallets and cartons must be properly barcoded, packaged, and labeled in accordance with our receiving specifications. Unscheduled deliveries, improperly labeled freight, or non-compliant hazardous materials may be rejected or subject to non-compliance fees.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              3. Storage, Inventory Accuracy & Shrinkage
            </h2>
            <p>
              We maintain commercially reasonable care and standard cycle counting in our secure warehousing facilities. Storage fees are calculated based on pallet footprint, cubic feet, or bin locations occupied during each billing cycle. Merchants must maintain appropriate commercial property and casualty insurance covering inventory stored within our facilities.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              4. Pick, Pack & Outbound Shipping
            </h2>
            <p>
              Orders received prior to the daily cutoff time will be processed according to the agreed Service Level Agreement (SLA). OneFulfillCenter arranges parcel and freight shipping via third-party commercial carriers (e.g., FedEx, UPS, USPS, DHL, LTL carriers). Carrier transit delays, weather incidents, customs holds, or carrier force majeure events are governed by carrier terms.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              5. Governing Law & Contact
            </h2>
            <p>These terms are governed by the laws of the State of Florida. For contractual notices, contact:</p>
            <div style={{ marginTop: "0.75rem", padding: "1rem", backgroundColor: "#1e293b", borderRadius: "8px" }}>
              <p><strong>{company.name}</strong></p>
              <p>Email: <a href={`mailto:${company.investorEmail}`} style={{ color: "#38bdf8" }}>{company.investorEmail}</a></p>
              <p>Phone: {company.phone}</p>
              <p>Address: {company.address}</p>
            </div>
          </section>
        </div>
      </main>
      <OfcNewsletterFooter />
    </Wrapper>
  );
}
