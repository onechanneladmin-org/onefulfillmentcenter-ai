import { permanentRedirect } from "next/navigation";

export default function TemperatureControlledStorageRedirect() {
  permanentRedirect("/inventory-storage/");
}
