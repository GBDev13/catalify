import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalog } from "src/services/catalog"
import { useCatalog } from "src/store/catalog"

export default function CompanyLinks() {
  const router = useRouter()
  const slug = router.query.companySlug as string

  const { setCatalogInfo, setCatalogColors, info } = useCatalog()

  useQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug), {
    onSuccess: (data) => {
      setCatalogInfo(data)
      setCatalogColors(data.themeColor)
    }
  });

  return (
    <main className="w-screen min-h-screen h-screen bg-primary overflow-y-auto flex flex-col items-center justify-center p-4">
      {info?.logo ? (
        <img className="max-h-[150px] object-contain" src={info.logo} />
      ) : (
        <h1 className="text-readable font-semibold text-5xl">{info?.name}</h1>
      )}

      <div className="flex flex-col gap-4 w-full max-w-[400px] mt-10">
        {info.links?.map((link, index) => (
          <a key={index} href={link} className="w-full p-2 rounded-full bg-readable text-primary text-xl text-center">
            {link}
          </a>
        ))}
      </div>
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

  await queryClient.prefetchQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug))
  const company = queryClient.getQueryData(catalogKeys.companyCatalog(slug))

  if(!company) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 10, // 10 hours
  }
}