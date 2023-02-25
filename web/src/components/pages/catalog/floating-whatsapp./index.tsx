import { FaWhatsapp } from "react-icons/fa"
import { useCatalog } from "src/store/catalog"

export const FloatingWhatsApp = () => {
  const { info } = useCatalog()

  const handleOpenWhatsapp = () => {
    const phone = info?.phone
    const message = `Olá, vim pelo catálogo`

    if(phone) {
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }
  }

  return (
    <button onClick={handleOpenWhatsapp} className="fixed z-[5] bottom-3 right-5 sm:bottom-5 sm:right-5 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full shadow-sm text-white bg-whatsapp hover:brightness-105 transition-all">
      <div className="absolute inset-0 bg-whatsapp animate-pingSlow z-[-1] rounded-full" />
      <FaWhatsapp className="z-[6]" size={35} />
    </button>
  )
}