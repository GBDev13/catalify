import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useRef, useState } from "react"
import { companyKeys } from "src/constants/query-keys"
import { getUserCompany } from "src/services/company"
import { useCompany } from "src/store/company"
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid"

type GlobalStateProps = {
  isCatalogRoute: boolean
  children: ReactNode
}

type TawkRef = {
  setAttributes: (attributes: any) => void
}

export const GlobalState = ({ isCatalogRoute, children }: GlobalStateProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id!

  const { setCompany, company, currentSubscription } = useCompany()
  const hasSubscription = isSubscriptionValid(currentSubscription!)

  const router = useRouter()

  useQuery(companyKeys.userCompanyInfo(userId), getUserCompany, {
    enabled: !!userId && router.pathname.startsWith('/app/dashboard'),
    onSuccess(data) {
      setCompany(data)
    },
  })

  const tawkMessengerRef = useRef<TawkRef>(null);
  const [tawkIsLoaded, setTawkIsLoaded] = useState(false);
  
  useEffect(() => {
    if(tawkIsLoaded && session?.user && tawkMessengerRef.current && company) {
      tawkMessengerRef.current.setAttributes({
        name : session?.user?.firstName + ' ' + session?.user?.lastName,
        email : session?.user?.email,
        company: company?.name,
    });
    }
  }, [company, hasSubscription, session?.user, tawkIsLoaded])

  useEffect(() => {
    if(session?.user && tawkIsLoaded && tawkMessengerRef.current) {
      tawkMessengerRef.current.setAttributes({
        hasSubscription
      });
    }
  }, [hasSubscription, session?.user, tawkIsLoaded])

  return (
    <>
      {children}
      {!isCatalogRoute && (
        <TawkMessengerReact
          propertyId={process.env.NEXT_PUBLIC_CHAT_PROPERTY_ID}
          widgetId={process.env.NEXT_PUBLIC_CHAT_WIDGET_ID}
          ref={tawkMessengerRef}
          onLoad={() => setTawkIsLoaded(true)}
        />
      )}
    </>
  )
}