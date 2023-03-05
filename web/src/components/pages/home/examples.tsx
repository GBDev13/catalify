import { fadeAnimProps } from "src/lib/animations";
import { motion } from "framer-motion";
import Link from "next/link";

const examples = [
  {
    title: "Moda",
    slug: "boutique-store",
    imgName: "boutique.png"
  },
  {
    title: "Eletrônicos",
    slug: "gbimports",
    imgName: "gbimports.png",
  },
  {
    title: "Alimentação",
    slug: "bestburger",
    imgName: "bestburger.png",
  }
]

export const ExamplesSection = () => {
  return (
    <section className="w-full bg-slate-50 py-16" id="examples">
      <div className="home-container">
        <motion.div className="text-center md:px-16 mb-10" {...fadeAnimProps}>
          <h2 className="font-semibold text-4xl">Catalify é para qualquer nicho! </h2>
          <p className="text-slate-500 sm:text-lg mt-2">
            Confira alguns exemplos de catálogos e veja como podem facilmente ser usados em <span className="text-indigo-500">diferentes segmentos</span> de mercado.
          </p>
        </motion.div>

        <div className="grid gap-4 justify-items-center items-center grid-cols-1 sm:grid-cols-3">
          {examples.map((example, index) => (
            <motion.div key={index} {...fadeAnimProps} transition={{ ...fadeAnimProps.transition, delay: index * 0.1 }}>
              <div className="w-full h-full flex flex-col items-center gap-2">
                <h4 className="text-lg text-indigo-500">{example.title}</h4>
                <div className="relative group rounded-lg overflow-hidden border border-indigo-500/20">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center bg-indigo-500/70 backdrop-blur-sm text-white">
                    <a href={`https://${example.slug}.catalify.com.br`} target="_blank" className="bg-white/80 hover:bg-white/100 transition-all rounded-full text-indigo-500 px-4 py-2" rel="noreferrer">
                      Ver catálogo
                    </a>
                  </div>
                  <img src={`/images/examples/${example.imgName}`} alt={example.title} className="w-full h-full shadow-sm shadow-indigo-500/30" />
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}