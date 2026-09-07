import { permanentRedirect } from "next/navigation";

export default function TermsAndConditionsRedirect() {
  permanentRedirect("/terms-of-service/");
}
