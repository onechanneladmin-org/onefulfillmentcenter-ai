import { company } from "@/data/brandArchitecture";

export interface LeadSubmission {
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  role?: string;
  message?: string;
  source: string;
  subscribe?: boolean;
  extraLines?: (string | false | undefined)[];
}

/**
 * Posts a lead to the shared createContact endpoint
 * (backend.onechanneladmin.com/inventory/customer/createContact).
 * Throws if the request fails so callers can show an error state.
 */
export async function submitLead(lead: LeadSubmission): Promise<void> {
  const attribution = {
    page: typeof window !== "undefined" ? window.location.href : lead.source,
    referrer: typeof document !== "undefined" ? document.referrer : "",
    query: typeof window !== "undefined" ? window.location.search : "",
  };

  const message = [
    "New OneFulfillCenter inquiry",
    ...(lead.extraLines ?? []),
    lead.message && `Message: ${lead.message}`,
    `Source: ${lead.source}`,
    attribution.referrer && `Referrer: ${attribution.referrer}`,
    attribution.query && `Query: ${attribution.query}`,
    `Landing page: ${attribution.page}`,
  ]
    .filter(Boolean)
    .join("\n");

  const payload = new URLSearchParams({
    firstname: (lead.name || "Subscriber").trim(),
    emailId: lead.email.trim(),
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    country: lead.country ?? "",
    message,
    role: lead.role ?? "Fulfillment Lead",
    source: lead.source,
    label: "onefulfillcenter",
    Subscribe: lead.subscribe ? "true" : "false",
    page: attribution.page,
    referrer: attribution.referrer,
    query: attribution.query,
  });

  const response = await fetch(company.leadEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    throw new Error("Lead submission failed");
  }

  if (typeof window !== "undefined") {
    const trackedWindow = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    trackedWindow.dataLayer = trackedWindow.dataLayer || [];
    trackedWindow.dataLayer.push({
      event: "ofc_lead_success",
      source: lead.source,
    });
  }
}
