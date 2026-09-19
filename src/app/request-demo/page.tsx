import type { Metadata } from "next";
import Wrapper from "@/layout/Wrapper";
import RequestDemo from "@/components/request-demo";
import { createPageMetadata, SeoStructuredData } from "@/lib/seo";
import "@/styles/ofc-tw.css";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/request-demo/", {
    title: "Request a Demo | OneFulfillCenter",
    description:
      "Request a personalized OneFulfillCenter demo covering distributed warehousing, B2B and B2C fulfillment, WMS, shipping, returns, and marketplace integrations.",
  });
}

const RequestDemoPage = async () => {
  return (
    <Wrapper>
      <SeoStructuredData
        path="/request-demo/"
        fallbackTitle="Request a Demo | OneFulfillCenter"
      />
      <RequestDemo />
    </Wrapper>
  );
};

export default RequestDemoPage;
