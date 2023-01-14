import { useCatalog } from "src/store/catalog";

export const openWhatsAppMessage = (message: string) => {
  const { info } = useCatalog.getState()
  const url = `https://wa.me/${info.phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_")
}