import { NextSeo } from "next-seo"
import Head from "next/head"

type LandingSEOProps = {
  title: string
}

export const LandingSEO = ({ title }: LandingSEOProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg" />
      </Head>
      <NextSeo
        titleTemplate="Catalify | %s"
        title={title}
      />
    </>
  )
}