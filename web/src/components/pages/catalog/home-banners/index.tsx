import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalogBanners } from "src/services/catalog"
import { useCatalog } from "src/store/catalog"

type LinkWrapperProps = {
  url?: string;
  children: ReactNode
  className: string
}

const LinkWrapper = ({ url, children, className }: LinkWrapperProps) => {
  if (!url) return (
    <div className={className}>
      {children}
    </div>
  );

  if (!url.startsWith(location.origin)) {
    return (
      <a href={url} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={url} className={className}>
      {children}
    </Link>
  )
}

export const HomeBanners = () => {
  const { slug } = useCatalog(s => s.info);

  const { data: banners } = useQuery(catalogKeys.companyBanners(slug), () => getCompanyCatalogBanners(slug), {
    enabled: !!slug,
  })

  if (!banners || banners.length <= 0) return null;

  return (
    <section className={clsx("grid gap-4", {
      "auto-rows-[250px] sm:auto-rows-[300px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": banners.length === 3,
      "auto-rows-[250px] sm:auto-rows-[300px] grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]": banners.length < 3,
      "auto-rows-[250px] sm:auto-rows-[400px]": banners.length === 1
    })}>
      {banners.map((banner, i) => {
        return (
          <LinkWrapper url={banner?.url} key={banner.id}
            className={clsx("w-full h-full hover:brightness-105 transition-all", {
              "col-span-full lg:col-auto": banners.length === 3 && i === banners.length - 1,
              "cursor-pointer": !!banner?.url
            })}
          >
            <div className="w-full h-full rounded-3xl overflow-hidden relative border border-primaryLight hover:border-primary transition-colors">
              <Image width={580} height={i === 0 ? 580 : 280} alt="" className="w-full h-full relative z-[2] object-contain" src={banner.picture} />
              <img alt="" className="absolute w-full h-full top-0 left-0 object-cover blur-md" src={banner.picture} />
            </div>
          </LinkWrapper>
        )
      })}
    </section>
  )
}