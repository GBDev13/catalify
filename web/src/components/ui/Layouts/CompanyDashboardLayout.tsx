import { ReactNode } from "react"
import { Sidebar } from "src/components/pages/company/dashboard/Sidebar"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { companyKeys } from "src/constants/query-keys"
import { useCompany } from "src/store/company"
import { getCompanySubscriptionBySlug } from "src/services/company"

type CompanyDashboardLayout = {
  children: ReactNode
}

export const CompanyDashboardLayout = ({ children }: CompanyDashboardLayout) => {
  const variants: Variants = {
    hidden: { opacity: 0, x: -100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  }

  const { company, setCompanySubscription } = useCompany(state => state)
  const slug = company?.slug!;

  const router = useRouter()

  useQuery(companyKeys.companySubscription(slug), () => getCompanySubscriptionBySlug(slug), {
    enabled: !!slug,
    onSuccess: (data) => {
      setCompanySubscription(data)
    }
  })

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