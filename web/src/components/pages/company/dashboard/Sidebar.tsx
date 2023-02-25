import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { FiHome, FiShoppingCart, FiLogOut, FiMenu, FiX, FiLink, FiArchive } from 'react-icons/fi'
import { CgWebsite } from 'react-icons/cg'
import { HiExternalLink, HiOutlineChevronDown } from 'react-icons/hi'
import { Divider } from 'src/components/ui/Divider'
import { AnimatePresence, motion } from 'framer-motion'
import { useBreakpoint } from 'src/hooks/useBreakpoint'
import { fadeAnim } from 'src/lib/animations'
import { useCompany } from 'src/store/company'
import { isSubscriptionValid } from 'src/helpers/isSubscriptionValid'
import { Tooltip } from 'src/components/ui/Tooltip'
import { AiOutlineDollar } from 'react-icons/ai'
import { FeatureExplanation, SubscriptionRequiredDialog } from '../../shared/SubscriptionRequiredDialog'
import { Logo } from 'src/assets/Logo'
import { TfiReceipt } from 'react-icons/tfi'
import { onSignOut } from 'src/helpers/sign-out'
import { LOCALHOST_URL } from 'src/constants/config'

const sidebarItems = [
  {
    icon: <FiHome size={20} />,
    label: "Resumo",
    path: "/dashboard"
  },
  {
    icon: <FiShoppingCart size={20} />,
    label: "Produtos",
    path: "/dashboard/products",
    subItems: [
      {
        label: "Todos",
        path: "/dashboard/products"
      },
      {
        label: "Categorias",
        path: "/dashboard/products/categories"
      }
    ]
  },
  {
    icon: <TfiReceipt size={20} />,
    label: "Pedidos",
    path: "/dashboard/orders",
    subItems: [
      {
        label: "Todos",
        path: "/dashboard/orders"
      }
    ]
  },
  {
    icon: <CgWebsite size={20} />,
    label: "Catálogo",
    path: "/dashboard/catalog",
    subItems: [
      {
        label: "Empresa",
        path: "/dashboard/catalog/company"
      },
      {
        label: "Customizações",
        path: "/dashboard/catalog/customization"
      }
    ]
  },
  {
    icon: <FiArchive size={20} />,
    needsSubscription: true,
    subscriptionExplanation: {
      title: "Controle de Estoque",
      description: "O controle de estoque é uma ferramenta que permite que você gerencie o estoque de seus produtos. Você pode gerenciar estoque de produtos com ou sem variações.",
      videoUrl: "https://youtu.be/xMh7BfqYTDc"
    },
    label: "Estoque",
    path: "/dashboard/stock",
  },
  {
    icon: <FiLink size={20} />,
    label: "Página de Links",
    path: "/dashboard/links",
    needsSubscription: true,
    subscriptionExplanation: {
      title: "Página de Links",
      description: "A página de links é uma página que você pode compartilhar com seus clientes para que eles acessem links customizados de forma simples. Você pode customizar a página de links com o seu logo e cores.",
      videoUrl: "https://youtu.be/xMh7BfqYTDc"
    }
  },
  {
    icon: <AiOutlineDollar size={20} />,
    label: "Gerenciar Plano",
    path: "/dashboard/plan"
  },
]

type SidebarItemProps = {
  item: typeof sidebarItems[number]
  onOpenSubscriptionRequired: (explanation: FeatureExplanation) => void
}

const SidebarItem = ({ item, onOpenSubscriptionRequired }: SidebarItemProps) => {
  const router = useRouter()

  const { currentSubscription } = useCompany()
  const hasSubscription = isSubscriptionValid(currentSubscription!)

  const hasSubItems = item.subItems?.length
  const routerPathname = router.pathname.replace("/app", "")
  const isActive = hasSubItems ? routerPathname.startsWith(item.path) : routerPathname === item.path

  const [submenuOpen, setSubmenuOpen] = useState(false)
  
  const handleOnClick = (e: MouseEvent) => {
    if(item?.needsSubscription && !hasSubscription) {
      e.preventDefault()
      onOpenSubscriptionRequired(item?.subscriptionExplanation!)
    }

    if(hasSubItems) {
      e.preventDefault()
      setSubmenuOpen(state => !state)
    }
  }

  useEffect(() => {
    if(hasSubItems) {
      setSubmenuOpen(routerPathname.startsWith(item.path))
    }
  }, [hasSubItems, item.path, routerPathname])

  return (
    <div>
      <Link href={item.path} className={clsx("flex items-center gap-3 p-4 rounded-md hover:bg-indigo-700/50 transition-colors", {
        "bg-indigo-700 font-semibold rounded-b-none": isActive
      })} onClick={handleOnClick}>
        {item.icon}
        <span>{item.label}</span>
        {hasSubItems && (
          <div className={clsx("ml-auto transition-all", {
            "transform rotate-180": submenuOpen
          })}>
            <HiOutlineChevronDown size={15} />
          </div>
        )}
      </Link>
      <AnimatePresence>
      {submenuOpen && (
        <motion.div
          className="overflow-hidden flex flex-col bg-indigo-600/20 rounded rounded-t-none"
          initial={{
            height: 0,
          }}
          animate={{
              height: "auto",
          }}
          exit={{
              height: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {item.subItems?.map((subItem, i) => {
            const isSubActive = routerPathname === subItem.path

            return (
              <Link key={subItem.label} href={subItem.path} className={clsx("p-2 hover:bg-indigo-700 rounded-md transition-all", {
                "bg-indigo-700/60": isSubActive,
                "rounded-t-none": i === 0,
              })}>
                {subItem.label}
              </Link>
            )
          })}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export const Sidebar = () => {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await onSignOut()
  }

  const isMobile = useBreakpoint(900)

  const [sideBarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  useEffect(() => {
    if(!isMobile && !sideBarOpen) {
      setSidebarOpen(true)
    }
  }, [isMobile, sideBarOpen])

  const { currentSubscription, company } = useCompany()

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  const [subscriptionRequiredDialogOpen, setSubscriptionRequiredDialogOpen] = useState<FeatureExplanation | null>(null)

  const catalogUrl = useMemo(() => {
    return process.env.NODE_ENV === "development" ? `http://${company?.slug}.${LOCALHOST_URL}` : `https://${company?.slug}.catalify.com.br`
  }, [company?.slug])

  return (
    <>
      <SubscriptionRequiredDialog open={subscriptionRequiredDialogOpen} setOpen={setSubscriptionRequiredDialogOpen} />

      <AnimatePresence>
        {sideBarOpen && (
          <motion.aside className={
            clsx("h-screen bg-indigo-800 text-indigo-100 flex flex-col min-w-[300px] z-10", {
              "fixed left-0 min-w-0 w-full max-w-[350px]": isMobile,
            })
          }
          initial={{
            x: -400,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: -400,
            opacity: 0,
          }}
          transition={{
            duration: 0.3
          }}
          >
            <div className={
              clsx("flex items-center justify-center pt-4 text-xl", {
                "justify-between px-6": isMobile,
              })
            }>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Logo className="w-[130px]" />
              </Link>
              {isMobile && (
                <button onClick={closeSidebar} className="bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-indigo-500">
                  <FiX size={25} />
                </button>
              )}
            </div>
            <Divider className="bg-indigo-700" />
    
            <div className="fle flex-col gap-2 px-4">
              {sidebarItems.map((item) => (
                <SidebarItem item={item} key={item.label} onOpenSubscriptionRequired={setSubscriptionRequiredDialogOpen} />
              ))}
            </div>
    
            <div className="mt-auto flex flex-col">
              <Link target="_blank" href={catalogUrl} className="py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                Acessar o Catálogo
                <HiExternalLink size={20} />
              </Link>
              <div className="p-4 bg-indigo-900 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <strong className="text-sm font-normal">{`${session?.user?.firstName} ${session?.user?.lastName ?? ''}`}</strong>
                  <Tooltip content="Gerenciar Plano">
                    {subscriptionIsValid ? (
                      <Link className="text-slate-100 bg-indigo-500 hover:bg-indigo-400 transition-colors text-xs text-center py-0.5 px-1 rounded" href="/dashboard/plan">PLANO PREMIUM</Link>
                    ) : (
                      <Link className="text-slate-100 bg-blue-500 hover:bg-blue-400 transition-colors text-xs text-center py-0.5 px-1 rounded" href="/dashboard/plan">PLANO GRATIS</Link>
                    )}
                  </Tooltip>
                </div>
      
                <div className="flex items-center gap-2">
                  <button onClick={handleSignOut}>
                    <FiLogOut />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {isMobile && (
        <button onClick={() => setSidebarOpen(true)} className="bg-indigo-500 hover:bg-indigo-400 w-12 h-12 rounded-full shadow-sm flex items-center justify-center absolute bottom-6 left-6 z-[3] text-white">
          <FiMenu size={25} />
        </button>
      )}

      <AnimatePresence>
        {isMobile && sideBarOpen && <motion.div onClick={closeSidebar} className="fixed inset-0 bg-slate-800/50 backdrop-blur-sm z-[9]" {...fadeAnim} />}
      </AnimatePresence>
    </>
  )
}