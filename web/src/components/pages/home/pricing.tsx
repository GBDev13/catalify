import { useRouter } from "next/router"
import { Pricing } from "../onboarding/pricing"
import { motion } from "framer-motion";
import { fadeAnimProps } from "src/lib/animations";

export const PricingSection = () => {
  const router = useRouter();

  return (
    <section className="home-container py-16" id="pricing">
      <motion.div className="text-center sm:px-14 -mb-2" {...fadeAnimProps}>
        <h2 className="font-semibold text-4xl">
          Planos que cabem no seu bolso
        </h2>
        <p className="sm:text-lg text-slate-500 mt-2">Oferecemos um plano gratuito e um plano premium. Escolha o que mais se adéqua às necessidades da sua empresa e <span className="text-indigo-500">comece a vender de forma eficiente</span> hoje mesmo com o Catalify.</p>
      </motion.div>
      <motion.div {...fadeAnimProps}>
        <Pricing
          onClickFree={() => window.open('https://app.catalify.com.br/onboarding?plan=free')}
          onClickPaid={() => window.open('https://app.catalify.com.br/onboarding?plan=premium')}
        />
      </motion.div>
    </section>
  )
}