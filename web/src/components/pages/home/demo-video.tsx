import * as Dialog from "@radix-ui/react-dialog"
import { FaPlay } from "react-icons/fa"
import { motion } from "framer-motion";
import { fadeAnimProps, scaleUpAnimProps } from "src/lib/animations";

const VideoDialog = () => {
  return (
  <Dialog.Root>
    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-20" />
    <Dialog.Trigger className="bg-indigo-100 backdrop-blur-sm w-16 h-16 text-2xl rounded-full flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
      <FaPlay />
    </Dialog.Trigger>
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-slate-100 p-4 sm:p-6 rounded-md w-full max-w-[1000px]">
      <video className="aspect-video" controls autoPlay>
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
      </video>
    </Dialog.Content>
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
            <img className="w-full h-full object-cover" src="https://s3-alpha-sig.figma.com/img/a81f/c1a0/2ae6277b51e3fe22bf7bd6b1c5b8dc4c?Expires=1677456000&Signature=CmiBpvCh3k1DDRFeV7JMXXpmjEM1z-guNxXaUIHqp3~zW7FPMVdT1Mj7EqDWYYfT~h6HHfXDdvVk2peQlow6RWxMGwnu8myzQ8c5BIjQEyDhysvcjvaPMHWvPFr7RtpoSrckylDxmrSlaAAtON7iS7njvbyEZ6~iekPjfp7-1gg1u4XtStTQfYFooy2LD8gfg6CAiS3OU7ADOQYAx3YzUJnNzuHs67ii9YD0qYxr~36pSa-qLI-ngXzEdLry0Et2LquYlA5xhmqQrME17KFUz2UY3aIRXXt1kY-JoSdeDKXeUb7Ef3yNSO1nHW31muwa6R~-h3WhASt2b5VfOS6ExQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
            <div className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-indigo-300/50 group transition-colors">
              <VideoDialog />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}