import { NextSeo } from "next-seo"
import Head from "next/head"

type DashboardSEOProps = {
  title: string
}

export const DashboardSEO = ({ title }: DashboardSEOProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <NextSeo
        titleTemplate="Catalify - %s"
        title={title}
      />
    </>
  )
}