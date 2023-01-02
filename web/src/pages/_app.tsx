import '../styles/global.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { Toaster } from 'react-hot-toast'
import { renderLayoutByPath } from 'src/helpers/render-layout-by-path'
import { GlobalState } from 'src/components/GlobalState'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Toaster position='bottom-center' />
        <GlobalState>
          {renderLayoutByPath(router.pathname, <Component {...pageProps} />)}
        </GlobalState>
      </QueryClientProvider>
    </SessionProvider>
  )
}
