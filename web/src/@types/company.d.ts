declare namespace Company {
  export type Info = {
    id: string
    slug: string
    name: string
    ownerId: string
    themeColor: string
    logo?: string
  }

  export type Link = {
    id: string
    url: string
  }

  export type Banner = {
    id: string
    url?: string
    picture: string
  }
}