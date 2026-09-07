import type { Metadata } from "next";
import Wrapper from "@/layout/Wrapper";
import OfcHeader from "@/components/homes/multi-page/home/ofc/OfcHeader";
import OfcNewsletterFooter from "@/components/homes/multi-page/home/ofc/OfcNewsletterFooter";
import { company } from "@/data/brandArchitecture";
import { createPageMetadata, SeoStructuredData } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/privacy-policy/", {
    title: "Privacy Policy | OneFulfillCenter",
    description:
      "Learn how OneFulfillCenter collects, uses, protects, and manages customer and fulfillment data across our warehousing and logistics platform.",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <SeoStructuredData
        path="/privacy-policy/"
        fallbackTitle="Privacy Policy | OneFulfillCenter"
      />
      <OfcHeader />
      <main style={{ backgroundColor: "#0b0f19", color: "#e2e8f0", minHeight: "80vh", padding: "120px 20px 80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#ffffff" }}>
            OneFulfillCenter Privacy Policy
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Last updated: September 7, 2026
          </p>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              1. Introduction
            </h2>
            <p>
              OneFulfillCenter (&quot;OFC&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates commercial fulfillment centers, warehousing facilities, and software integrations to facilitate B2B, B2C, and multi-channel order processing for retail brands and merchants. We are committed to safeguarding the privacy and security of your personal data and confidential commercial inventory information.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              2. Information We Collect
            </h2>
            <p>We collect and process the following categories of information:</p>
            <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li><strong>Merchant Account Details:</strong> Name, business email, phone number, billing address, and authorized warehouse contacts.</li>
              <li><strong>Fulfillment & Order Data:</strong> Customer shipping addresses, recipient names, parcel tracking IDs, order line items, and delivery preferences transmitted from your sales channels.</li>
              <li><strong>Inventory & Warehouse Data:</strong> SKU numbers, serial numbers, lot codes, stock locations, and receiving logs within our facilities.</li>
              <li><strong>Website & Interaction Data:</strong> IP address, device metadata, browser type, and form submissions from contact and newsletter requests.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              3. How We Use Information
            </h2>
            <p>We use the data collected strictly for legitimate fulfillment operations:</p>
            <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li>Receiving, storing, picking, packing, and dispatching merchant merchandise.</li>
              <li>Generating carrier shipping labels (UPS, FedEx, USPS, DHL, freight carriers).</li>
              <li>Providing real-time stock levels and order status tracking to merchants.</li>
              <li>Responding to business inquiries, service quotes, and customer support tickets.</li>
              <li>Ensuring security, preventing fraud, and complying with regulatory obligations.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              4. Data Sharing & Third-Party Service Providers
            </h2>
            <p>
              We do not sell, rent, or trade personal data. We disclose information only to vetted third parties necessary to perform fulfillment services, such as parcel shipping carriers, freight freight forwarders, payment processors, and IT infrastructure providers.
            </p>
          </section>

          <section style={{ marginBottom: "2rem", lineHeight: "1.7" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.75rem", color: "#38bdf8" }}>
              5. Contact Us
            </h2>
            <p>If you have any questions or requests regarding this Privacy Policy, please contact us at:</p>
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
