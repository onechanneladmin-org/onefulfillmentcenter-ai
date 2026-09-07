import { permanentRedirect } from "next/navigation";

export default function SubscriptionBoxRedirect() {
  permanentRedirect("/subscription-fulfillment/");
}
