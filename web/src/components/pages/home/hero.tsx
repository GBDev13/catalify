import { FiArrowDown } from "react-icons/fi"
import { motion } from "framer-motion"
import { fadeAnimProps, fadeLeftRightAnimProps } from "src/lib/animations"

export const HeroSection = () => {
  const handleStart = () => {
    window.scrollTo({
      top: (document.getElementById("pricing")?.offsetTop ?? 0) - 100,
      behavior: "smooth"
    })
  }

  return (
    <section className="overflow-x-hidden">
      <div className="absolute bg-indigo-500 w-full h-[500px] -skew-y-[6deg] -top-[100px] sm:-top-[250px] md:-top-[180px] lg:-top-[120px] -z-[1]">
        <canvas id="gradient-canvas" className="w-full h-full"></canvas>
      </div>

      <div className="home-container flex items-center mt-[90px] gap-2 flex-col-reverse sm:flex-row">
        <div className="sm:mt-8">
          <motion.h1 {...fadeAnimProps} className="text-4xl sm:text-[40px] sm:leading-[50px] md:text-[50px] md:leading-[60px] lg:text-[70px] lg:leading-[80px] font-semibold text-slate-800">
            Catálogo digital que simplifica suas vendas!
          </motion.h1>
          <motion.p {...fadeAnimProps}className="text-base md:text-lg mt-6 text-slate-500 font-light">
            Com alguns cliques, tenha um catálogo de produtos pronto para exibir aos seus clientes e <span className="text-indigo-500 font-normal">fechar vendas pelo WhatsApp</span>. Experimente agora e revolucione a forma como você faz negócios!
          </motion.p>
          <motion.button {...fadeLeftRightAnimProps} onClick={handleStart} className="bg-indigo-500 hover:bg-indigo-400 flex items-center gap-2 transition-colors text-white px-4 py-2 rounded-md mt-2">
            Começar agora
            <FiArrowDown />
          </motion.button>
        </div>

        <motion.img
        src="/images/landing.png"
        className="relative sm:-mr-[400px] md:-mr-[480px] lg:-mr-[550px] w-[950px]"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring' }}
        />
      </div>
    </section>
  )
}