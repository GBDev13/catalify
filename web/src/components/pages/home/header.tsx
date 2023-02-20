import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import { FiArrowRight, FiMenu } from "react-icons/fi"
import { Logo } from "src/assets/Logo"

const sections = [
  {
    title: "Funcionalidades",
    id: "features"
  },
  {
    title: "Demonstração",
    id: "demo"
  },
  {
    title: "Planos",
    id: "pricing"
  }
]

type HomeHeaderProps = {
  withSolidBg?: boolean
  withoutLinks?: boolean
  mode?: 'fixed' | 'static'
}

type MenuMobileProps = {
  show: boolean
  setShow: (show: boolean) => void
}

const MenuMobile = ({ show, setShow }: MenuMobileProps) => {
  const handleScrollTo = (id: string) => {
    setShow(false)
    window.scrollTo({
      top: (document.getElementById(id)?.offsetTop ?? 0) - 100,
      behavior: "smooth"
    })
  }

  return (
    <Dialog.Root open={show} onOpenChange={setShow}>
      <Dialog.Overlay className="fixed" />
      <Dialog.Content className="fixed z-40">
        <motion.div
          className="fixed inset-0 text-white bg-indigo-500/80 backdrop-blur-sm z-40 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Dialog.Close className="absolute top-4 right-4">
            <AiFillCloseCircle size={40} />
          </Dialog.Close>
          <div className="rounded-lg p-4">
            <nav className="flex flex-col gap-4">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className="text-3xl text-white/80 hover:text-white/100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  {section.title}
                </motion.button>
              ))}
              <Link href="/login" className="text-center text-3xl text-white/80 hover:text-white/100">
                Entrar
              </Link>
            </nav>
          </div>
        </motion.div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const HomeHeader = ({ withSolidBg, withoutLinks, mode = 'fixed' }: HomeHeaderProps) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    window.scrollTo({
      top: (document.getElementById(id)?.offsetTop ?? 0) - 100,
      behavior: "smooth"
    })
  }

  const [showMenuMobile, setShowMenuMobile] = useState(false)
  
  return (
    <>
      <header className={clsx("fixed top-0 w-full flex items-center center z-10 transition-colors", {
        "bg-indigo-500/90 backdrop-blur-sm": scrolled,
        "!bg-indigo-500": withSolidBg,
        "!relative": mode === 'static'
      })}>
        <div className="flex items-center justify-between home-container py-5">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/">
              <Logo className="w-[100px] lg:w-[140px]" />
            </Link>
            {!withoutLinks && (
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                {sections.map(section => (
                  <button key={section.id} onClick={() => handleScrollTo(section.id)} className="text-white/60 hover:text-white/100 transition-colors text-sm lg:text-base">{section.title}</button>
                ))}
              </nav>
            )}
          </div>

          <Link href="/login" className="hidden md:block">
            <button className="bg-indigo-300/40 hover:bg-indigo-300/60 transition-colors text-white py-1 rounded-full flex items-center gap-2 text-sm px-4 lg:px-5 lg:text-base">
              Entrar
              <FiArrowRight />
            </button>
          </Link>

          <button onClick={() => setShowMenuMobile(true)} className="flex md:hidden bg-indigo-300/40 hover:bg-indigo-300/60 transition-colors text-white py-1 rounded-full items-center gap-2 text-sm px-4">
            <FiMenu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showMenuMobile && <MenuMobile show={showMenuMobile} setShow={setShowMenuMobile} />}
      </AnimatePresence>
    </>
  )
}