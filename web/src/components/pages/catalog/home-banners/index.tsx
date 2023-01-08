import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

const banners = [
  {
    id: "1",
    imageUrl: "https://img.freepik.com/fotos-gratis/variedade-de-recipientes-de-fundacao-de-alto-angulo_23-2149705543.jpg?w=740&t=st=1673116492~exp=1673117092~hmac=c70badf79079e538bd874ee99bb1ba126b7e5784a2276d58e1c503c3a32f491a",
    url: "/slug1/produtos"
  },
  {
    id: "2",
    imageUrl: "https://s3-alpha-sig.figma.com/img/fdfd/4eb6/6ed6ec440ab7a7410dfe1db0c4b5576b?Expires=1673827200&Signature=C-4Ebvhivl~S0GyiUw36juYvKCaGTHR5OTbS7ampRjUIxrSlFCARHTaV9bXoqPh28X5JZ-ZfuaxeEngg-fz-krKb-hj5R12TTI0OmmJlBd4OJ8WXy-bHEg4Uivwu5dm4REvGLcpWdgOO~a33df~AcDTIsxr0h62WGyuVTU8XwzKDPWXO4idtWGpwTPArcPLyxvB--Hz8JLQHFukWGdCOEIDmZp~VQ6WHTzeOVthKMjw0Y1WK0TF9mes6X4enJxkjHlguzoF9bT4jCt-mHPMgq2RrFctqCB4p-4Nu47jf9kz6d4yrH1GnZsoZLJ2~UeduqqCKVOdKTXuh4KgNVWp6PA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    url: "https://google.com"
  },
  {
    id: "3",
    imageUrl: "https://s3-alpha-sig.figma.com/img/4da2/aee8/6d523894c69d294466f1e18976cfb8da?Expires=1673827200&Signature=OPpbE88W-XN8IaijFH6wn-6FleO5A8GJL1bX7T-A2f-O4aAP5SIyO~JCc-U62hSyDC8qzmeLY32466bgQCFEuSp7h4lr5MfQl0Pe9n3VQmQ5EImUJ3lDyjOt3mvrjwpCrQ51yuhFGAh0HlFvoP1tJgdBLuEAzdRkRBrum03xf~IKzIPWNm76c0WmhQbSzx3Vd0vU3DPG15ttAM3QpgjBE-4CQZJLkgWuc5bhtgphIu3mSml0a-eQ9r3a0plgRAmkigkpHjzcZOOrAEMxyMY6ScxTKiz4x5dOq0rBr6eziJaiH1s7hnftYXrF0r6JKz6cDyNEPhQZKg5ZjeKQQ-B9tQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
  }
]

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

  if (url.startsWith("http")) {
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
  return (
    <section className={clsx("grid gap-4", {
      "auto-rows-[250px] sm:auto-rows-[300px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": banners.length === 3,
      "auto-rows-[250px] sm:auto-rows-[300px] grid-cols-[repeat(auto-fit,minmax(400px,1fr))]": banners.length < 3,
      "auto-rows-[250px] sm:auto-rows-[400px]": banners.length === 1
    })}>
      {banners.map((banner, i) => {
        return (
          <LinkWrapper url={banner?.url} key={banner.id}
            className={clsx("w-full h-full hover:brightness-105 transition-all", {
              "col-span-full lg:col-auto": banners.length === 3 && i === banners.length - 1,
            })}
          >
            <Image width={580} height={i === 0 ? 580 : 280} alt="" className="w-full h-full object-cover rounded-3xl" src={banner.imageUrl} />
          </LinkWrapper>
        )
      })}
    </section>
  )
}