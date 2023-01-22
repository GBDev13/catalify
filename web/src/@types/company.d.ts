declare namespace Company {
  export type Info = {
    id: string
    slug: string
    name: string
    ownerId: string
    themeColor: string
    phone: string
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

  export type SubscriptionStatus =  "ACTIVE" | "CANCELED" | "CANCELING" | "EXPIRED"

  export type Subscription = {
    expiresAt: Date | null;
    id: string;
    status: SubscriptionStatus;
    createdAt: string;
    updatedAt: string;
  }

  export type LinksPageCustomization = {
    title: string;
    headLine?: string;
    textColor: string;
    textColor2: string;
    boxColor: string;
    boxMode: 'solid' | 'outline';
    bgColor: string;
    bgColor2: string;
    bgMode: 'solid' | 'gradient';
    logoMode: 'rounded' | 'free'
    logo?: string;
  }

  export type LinksPageLink = {
    id: string;
    title: string;
    url: string
  }
}