import { permanentRedirect } from "next/navigation";

export default function TermsOfUseRedirect() {
  permanentRedirect("/terms-of-service/");
}
