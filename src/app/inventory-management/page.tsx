import { permanentRedirect } from "next/navigation";

export default function InventoryManagementRedirect() {
  permanentRedirect("/inventory-storage/");
}
