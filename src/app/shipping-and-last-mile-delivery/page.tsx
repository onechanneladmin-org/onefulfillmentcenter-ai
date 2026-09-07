import { permanentRedirect } from "next/navigation";

export default function ShippingLastMileRedirect() {
  permanentRedirect("/ecommerce-fulfillment/");
}
