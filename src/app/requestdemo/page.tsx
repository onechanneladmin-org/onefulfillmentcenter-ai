import { permanentRedirect } from "next/navigation";

export default function RequestDemoRedirect() {
  permanentRedirect("/#newsletter");
}
