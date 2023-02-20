import { ReactNode } from "react"
import { FaPalette, FaWhatsapp, FaRegFlag, FaBoxOpen, FaLink, FaBox } from 'react-icons/fa';

type FeatureItemProps = {
  title: string
  description: string
  icon: ReactNode
}


const features: FeatureItemProps[] = [
  {
    title: "Catálogo Personalizado",
    icon: <FaPalette />,
    description: "Adicione sua logo e escolha suas cores favoritas. Personalize o catálogo do seu jeito e surpreenda seus clientes."
  },
  {
    title: "Link de Pedido",
    icon: <FaWhatsapp />,
    description: "Agilize seus pedidos com nosso link de pedido. Os clientes escolhem os produtos e enviam a solicitação diretamente pelo WhatsApp."
  },
  {
    title: "Gestão de Produtos",
    icon: <FaBoxOpen />,
    description: "Gerencie seus produtos com facilidade. Crie produtos, defina variações, adicione categorias e preços promocionais."
  },
  {
    title: "Controle de Estoque",
    icon: <FaBox />,
    description: "Mantenha o controle de seu estoque com o nosso sistema simples e eficiente. Confirme seus pedidos e atualize o estoque em tempo real."
  },
  {
    title: "Links Personalizados",
    icon: <FaLink />,
    description: "Crie uma página de links personalizada com todas as suas redes sociais para aumentar a visibilidade da sua marca e simplificar sua venda."
  },
  {
    title: "Banners de Destaque",
    icon: <FaRegFlag />,
    description: "Anuncie suas promoções com banners em destaque na página inicial do catálogo. Aumente suas vendas de forma simples e eficiente."
  },
]

const FeatureItem = ({ title, description, icon }: FeatureItemProps) => {
  return (
    <div className="p-2 hover:bg-white transition-colors rounded-md">
      <div className="w-12 h-12 bg-indigo-300/30 text-indigo-500 flex items-center justify-center rounded-md text-2xl">
        {icon}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

export const FeaturesSection = () => {
  return (
    <section className="w-full bg-slate-50 py-16 mt-20" id="features">
      <div className="home-container">
        <div className="text-center md:px-6 mb-14">
          <h2 className="font-semibold text-4xl">Principais Funcionalidades</h2>
          <p className="text-slate-500 sm:text-lg mt-2">
            Nossas funcionalidades oferecem um catálogo digital <span className="text-indigo-500">completo e eficiente</span> para a sua empresa. Aproveite ao máximo as possibilidades do Catalify e aumente suas vendas hoje mesmo!
          </p>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          {features.map(feature => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}