import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { NextSeo } from "next-seo"
import Head from "next/head"
import { useRouter } from "next/router"
import { LinksPage } from "src/components/pages/shared/LinksPage"
import { companyKeys } from "src/constants/query-keys"
import { getPublicCompanyLinks } from "src/services/company"

export default function CompanyLinks() {
  const router = useRouter()
  const slug = router.query.companySlug as string

  const { data: pageData } = useQuery(companyKeys.companyPublicLinksPage(slug), () => getPublicCompanyLinks(slug));

  if(!pageData) return null

  return (
    <main className="w-screen min-h-screen overflow-y-auto flex flex-col">
      <NextSeo
        title={`${pageData.title} - Links`}
        description={pageData?.headLine}
      />

      {pageData?.logo && (
        <Head>
          <link rel="icon" href={pageData.logo} />
        </Head>
      )}

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
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()

  const slug = params?.companySlug as string

  await queryClient.prefetchQuery(companyKeys.companyPublicLinksPage(slug), () => getPublicCompanyLinks(slug))
  const data = queryClient.getQueryData(companyKeys.companyPublicLinksPage(slug))

  if(!data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}