import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'
import { BiBookHeart } from 'react-icons/bi'
import { FiSettings, FiHome, FiShoppingCart } from 'react-icons/fi'
import { HiOutlineChevronUp } from 'react-icons/hi'
import { Divider } from 'src/components/ui/Divider'
import { AnimatePresence, motion } from 'framer-motion'

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
      <Link href={item.path} className={clsx("flex items-center gap-3 p-4 rounded-md", {
        "bg-indigo-700 font-semibold": isActive
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
          className="overflow-hidden flex flex-col bg-indigo-600/20 rounded"
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
          {item.subItems?.map(subItem => {
            const isSubActive = router.pathname === subItem.path

            return (
              <Link key={subItem.label} href={subItem.path} className={clsx("p-2 hover:bg-indigo-700 rounded-md transition-all", {
                "bg-indigo-700/60": isSubActive
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
  return (
    <aside className="h-screen bg-indigo-800 text-indigo-100 flex flex-col min-w-[250px]">
      <div className="flex items-center justify-center gap-2 pt-4 text-xl">
        <BiBookHeart />
        <h2>Cataloguei</h2>
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
        <button>
          <FiSettings />
        </button>
      </div>
    </aside>
  )
}