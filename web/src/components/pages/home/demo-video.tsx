import * as Dialog from "@radix-ui/react-dialog"
import { FaPlay } from "react-icons/fa"
import { motion } from "framer-motion";
import { fadeAnimProps, scaleUpAnimProps } from "src/lib/animations";
import ReactPlayer from "react-player"

const VideoDialog = () => {
  return (
  <Dialog.Root>
    <Dialog.Trigger className="bg-indigo-100 backdrop-blur-sm w-16 h-16 text-2xl rounded-full flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
      <FaPlay />
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-20" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-slate-100 p-4 sm:p-6 rounded-md w-full max-w-[1000px]">
        <div className="aspect-video">
          <ReactPlayer playing={true} controls url="https://www.youtube.com/watch?v=eYsHhd4CRGA" width="100%" height="100%" />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  )
}

export const DemoVideoSection = () => {
  return (
    <>
      <section id="demo" className="w-full py-16" style={{
        background: "#f1f5f9 url(/images/shape.svg) no-repeat center bottom",
        backgroundSize: "cover"
      }}>
        <div className="home-container">
          <motion.div className="text-center sm:px-14 mb-14" {...fadeAnimProps}>
            <h2 className="font-semibold text-4xl">Catalify em ação</h2>
            <p className="text-slate-500 sm:text-lg mt-2">
              Assista a um breve vídeo que mostra como o Catalify pode ajudar a sua empresa a ter um catálogo digital completo, fácil de usar e eficiente.
            </p>
          </motion.div>

          <motion.div className="aspect-[77/40] rounded-md overflow-hidden relative border border-indigo-500" {...scaleUpAnimProps} viewport={{
            ...scaleUpAnimProps.viewport,
            once: true
          }}>
            <img className="w-full h-full object-cover" src="/images/home-placeholder.png" />
            <div className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-indigo-300/50 group transition-colors">
              <VideoDialog />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}