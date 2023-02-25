import Link from "next/link"
import { useEffect, useState } from "react"
import { BiCookie } from "react-icons/bi"
import { Button } from "src/components/ui/Button"
import { AnimatePresence, motion } from "framer-motion"
import { parseCookies, setCookie } from "nookies"

export const useSecureCookies = !!process.env.VERCEL_URL

export const CookiesPopup = () => {
  const [accepted, setAccepted] = useState(true)

  useEffect(() => {
    if(typeof window !== 'undefined') {
      const cookies = parseCookies();
      setAccepted(cookies?.acceptCookies === "true")
    }
  }, [])

  const handleAccept = () => {
    document.cookie = 'acceptCookies=true;max-age=31536000;path=/'
    setCookie(null, 'acceptCookies', "true", {
      maxAge: 365 * 24 * 60 * 60, // 365 days
      domain: useSecureCookies ? ".catalify.com.br" : ".test.com",
      path: "/",
      sameSite: "lax",
      secure: useSecureCookies
    })
    setAccepted(true)
  }

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          initial={{ bottom: -100, opacity: 0 }}
          animate={{ bottom: 16, opacity: 1 }}
          exit={{ bottom: -100, opacity: 0 }}
          transition={{ type: 'spring' }}
          className="fixed z-[999999] bottom-4 left-1/2 -translate-x-1/2 bg-white p-4 rounded-md shadow-xl w-full max-w-[400px] flex flex-col"
        >
          <h3 className="font-semibold text-xl flex items-center gap-2"><BiCookie className="text-indigo-500" /> Esse site usa cookies</h3>
          <p className="text-slate-500 text-xs">Nós armazenamos dados temporariamente para melhorar a sua experiência de navegação. Ao utilizar nossos serviços, você concorda com tal monitoramento.</p>
          <Link className="text-indigo-500 underline text-xs" href="/politica-de-privacidade">Política de Privacidade</Link>
          <Button size="WIDE" className="mt-2" onClick={handleAccept}>
            Entendi
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}