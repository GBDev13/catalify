import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'
import { BiBookHeart } from 'react-icons/bi'
import { FiSettings, FiHome, FiShoppingCart, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { HiOutlineChevronUp } from 'react-icons/hi'
import { Divider } from 'src/components/ui/Divider'
import { AnimatePresence, motion } from 'framer-motion'
import { useBreakpoint } from 'src/hooks/useBreakpoint'
import { fadeAnim } from 'src/lib/animations'

const sidebarItems = [
  {
    icon: <FiHome size={20} />,
    label: "Dashboard",
    path: "/company/dashboard"
  },
  {
    icon: <FiShoppingCart size={20} />,
    label: "Produtos",
    path: "/company/dashboard/products",
    subItems: [
      {
        label: "Todos",
        path: "/company/dashboard/products"
      },
      {
        label: "Categorias",
        path: "/company/dashboard/products/categories"
      }
    ]
  }
]

type SidebarItemProps = {
  item: typeof sidebarItems[number]
}

const SidebarItem = ({ item }: SidebarItemProps) => {
  const router = useRouter()

  const hasSubItems = item.subItems?.length
  const isActive = hasSubItems ? router.pathname.startsWith(item.path) : router.pathname === item.path

  const [submenuOpen, setSubmenuOpen] = useState(false)
  
  const handleOnClick = (e: MouseEvent) => {
    if(hasSubItems) {
      e.preventDefault()
      setSubmenuOpen(state => !state)
    }
  }

  useEffect(() => {
    if(hasSubItems) {
      setSubmenuOpen(router.pathname.startsWith(item.path))
    }
  }, [hasSubItems, item.path, router.pathname])

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
            <HiOutlineChevronUp size={15} />
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
            const isSubActive = router.pathname === subItem.path

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

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login"
    })
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

  return (
    <>
      <AnimatePresence>
        {sideBarOpen && (
          <motion.aside className={
            clsx("h-screen bg-indigo-800 text-indigo-100 flex flex-col min-w-[250px] z-10", {
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
              <div className="flex items-center gap-2">
                <BiBookHeart />
                <h2>Cataloguei</h2>
              </div>
              {isMobile && (
                <button onClick={closeSidebar} className="bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-indigo-500">
                  <FiX size={25} />
                </button>
              )}
            </div>
            <Divider className="bg-indigo-700" />
    
            <div className="fle flex-col gap-2 px-4">
              {sidebarItems.map((item) => (
                <SidebarItem item={item} key={item.label} />
              ))}
            </div>
    
            <div className="p-4 bg-indigo-900 mt-auto flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <strong className="text-sm font-normal">{`${session?.user?.firstName} ${session?.user?.lastName ?? ''}`}</strong>
                <button className="bg-green-400 text-slate-200 p-1 rounded text-xs">CONTA GRÁTIS</button>
              </div>
    
              <div className="flex items-center gap-2">
                <button>
                  <FiSettings />
                </button>
                <button onClick={handleSignOut}>
                  <FiLogOut />
                </button>
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