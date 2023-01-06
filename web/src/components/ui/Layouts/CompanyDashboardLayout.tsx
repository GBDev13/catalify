import { ReactNode } from "react"
import { Sidebar } from "src/components/pages/company/dashboard/Sidebar"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { useRouter } from "next/router"

type CompanyDashboardLayout = {
  children: ReactNode
}

export const CompanyDashboardLayout = ({ children }: CompanyDashboardLayout) => {
  const variants: Variants = {
    hidden: { opacity: 0, x: -100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  }

  const router = useRouter()

  return (
    <main className="flex w-screen">
      <Sidebar />
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.div
          className="h-screen overflow-y-auto flex-1 p-3 md:p-8"
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.2 }}
          key={router.route}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}