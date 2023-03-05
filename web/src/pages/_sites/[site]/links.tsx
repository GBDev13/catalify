import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { NextSeo } from "next-seo"
import Head from "next/head"
import { LinksPage } from "src/components/pages/shared/LinksPage"
import { companyKeys } from "src/constants/query-keys"
import { getAllLinksPageSlugs, getPublicCompanyLinks, PublicCompanyLinks } from "src/services/company"

type CompanyLinksProps = {
  pageData: PublicCompanyLinks
}

export default function CompanyLinks({ pageData }: CompanyLinksProps) {
  if(!pageData) return null

  return (
    <main className="w-screen min-h-screen overflow-y-auto flex flex-col">
      <NextSeo
        title={`${pageData.title} - Links`}
        description={pageData?.headLine}
      />

      <Head>
        <link rel="icon" href={pageData?.logo ? pageData.logo : '/favicon.svg'} />
      </Head>

      <LinksPage
        background={pageData.bgColor}
        background2={pageData.bgColor2}
        backgroundMode={pageData.bgMode}
        title={pageData.title}
        headline={pageData?.headLine}
        logo={pageData?.logo}
        logoMode={pageData.logoMode}
        textColor={pageData.textColor}
        textColor2={pageData.textColor2}
        boxColor={pageData.boxColor}
        boxMode={pageData.boxMode}
        links={pageData?.links ?? []}
      />
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllLinksPageSlugs()
  return {
    paths: slugs.map(slug => ({
      params: {
        site: slug
      }
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()

  const slug = params?.site as string

  await queryClient.prefetchQuery(companyKeys.companyPublicLinksPage(slug), () => getPublicCompanyLinks(slug))
  const data = queryClient.getQueryData(companyKeys.companyPublicLinksPage(slug))

  if(!data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      pageData: data,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}