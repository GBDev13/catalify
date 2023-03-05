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
        titleTemplate="%s | Catalify"
        title={title}
        canonical="https://catalify.com.br"
        description="Com Catalify, você cria um catálogo digital completo para sua loja online em minutos. Experimente agora e facilite suas vendas!"
        additionalMetaTags={[
          {
            name: "keywords",
            content: "catálogo digital, loja online, produtos, vendas, ferramenta de vendas"
          },
          {
            name: "author",
            content: "Catalify"
          }
        ]}
        openGraph={{
          title: `${title} | Catalify`,
          description: "Com Catalify, você cria um catálogo digital completo para sua loja online em minutos. Experimente agora e facilite suas vendas!",
          type: "website",
          url: "https://catalify.com.br",
          images: [
            {
              url: "https://storage.googleapis.com/catalify-images/static/og-image.png",
              width: 800,
              height: 420,
              alt: "Catalify"
            }
          ]
        }}
        twitter={{
          handle: "@CatalifyBR",
          site: "@CatalifyBR",
          cardType: "summary_large_image"
        }}
      />
    </>
  )
}