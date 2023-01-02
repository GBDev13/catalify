import '../styles/global.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { Toaster } from 'react-hot-toast'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Toaster position='bottom-center' />
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
