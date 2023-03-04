import '../styles/global.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderLayoutByPath } from 'src/helpers/render-layout-by-path'
import { GlobalState } from 'src/components/GlobalState'
import { useState } from 'react'
import { CustomToaster } from 'src/components/CustomToaster'
import { CookiesPopup } from 'src/components/pages/shared/CookiesPopup'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      }
    }
  }))
  
  const isCatalogRoute = Object.keys(router?.components ?? {}).some(x => x.includes('/_sites/[site]'));

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <CustomToaster />
          <GlobalState isCatalogRoute={isCatalogRoute}>
            {renderLayoutByPath(router.pathname, <Component {...pageProps} />)}
          </GlobalState>
          <CookiesPopup />
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
