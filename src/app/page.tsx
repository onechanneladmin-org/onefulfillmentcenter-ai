import type { Metadata } from "next";
import Wrapper from "../layout/Wrapper";
import HomeOne from "@/components/homes/multi-page/home";
import { createWebsiteMetadata, SeoStructuredData } from "@/lib/seo";
import "@/styles/ofc-tw.css";

export const revalidate = 60;

const HOME_TITLE = "OneFulfillCenter | Next Generation Omni-Channel Fulfillment & 3PL Logistics";
const HOME_DESCRIPTION =
  "Omni-channel 3PL fulfillment with a distributed nationwide warehouse network optimizing B2B and B2C ecommerce order processing, kitting, Amazon FBA prep, and reverse logistics.";

export async function generateMetadata(): Promise<Metadata> {
  return createWebsiteMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  });
}

const MainHome = async () => {
  return (
    <Wrapper>
      <SeoStructuredData mode="website" fallbackTitle={HOME_TITLE} />
      <HomeOne />
    </Wrapper>
  );
};

export default MainHome;
