import { permanentRedirect } from "next/navigation";

export default function ReturnsRepairsRedirect() {
  permanentRedirect("/returns-management/");
}
