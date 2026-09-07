import type { Metadata } from "next";
import { createPageMetadata } from "./createMetadata";

const SOLUTION_SEO: Record<string, { name: string; description: string }> = {
  "warehousing-and-inventory-storage": {
    name: "Warehousing and Inventory Storage | OneFulfillCenter",
    description:
      "Complete solution for inventory storage with distributed warehousing, real-time tracking, kitting, returns, and secure fulfillment operations.",
  },
  "b2c-b2b-wholesale-fulfillment": {
    name: "B2C & B2B Wholesale Fulfillment | OneFulfillCenter",
    description:
      "Unify B2C and B2B wholesale fulfillment with multi-channel order management, real-time inventory, automation, returns, and distributed warehouses.",
  },
};

export async function generateSolutionMetadata(
  slug: string
): Promise<Metadata> {
  const solution = SOLUTION_SEO[slug];
  if (!solution) {
    return { title: "Solutions | OneFulfillCenter" };
  }

  return createPageMetadata(`/solutions/${slug}/`, {
    title: solution.name,
    description: solution.description,
  });
}
