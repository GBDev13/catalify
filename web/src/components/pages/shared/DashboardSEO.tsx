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
        titleTemplate="%s - Catalify"
        title={title}
        openGraph={{
          title: `${title} - Catalify`,
          type: "website",
          images: [
            {
              url: "/images/og-image.png",
              width: 800,
              height: 420,
              alt: "Catalify"
            }
          ]
        }}
      />
    </>
  )
}