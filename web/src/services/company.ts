import { getBase64 } from 'src/helpers/get-base64'
import api from 'src/lib/axios'

export const getUserCompany = async () => {
  const { data } = await api.get('/company')
  return data
}

export type UpdateCompanyDto = Omit<Company.Info, 'logo' | 'id' | 'ownerId'> & { logo?: File | null }

export const updateCompany = async (companyId: string, dto: UpdateCompanyDto) => {
  let companyLogo: string | undefined = undefined

  if (dto?.logo) {
    companyLogo = await getBase64(dto.logo)
  }

  return await api.put(`/company/${companyId}`, {
    ...dto,
    logo: companyLogo ?? dto?.logo,
  })
}

export const getCompanyLinks = async (companyId: string) => {
  const { data } = await api.get<Company.Link[]>(`/company/${companyId}/links`)
  return data
}

export const updateCompanyLinks = async (companyId: string, links: string[]) => {
  return await api.put(`/company/${companyId}/links`, { links })
}

export const getCompanyBanners = async (companyId: string) => {
  const { data } = await api.get<Company.Banner[]>(`/company/${companyId}/banners`)
  return data
}

export type UpdateBannerDto = {
  id?: string
  link?: string;
  image?: File
}

export const updateCompanyBanners = async (companyId: string, banners: UpdateBannerDto[]) => {
  let bannersWithBase64 = []

  for (const banner of banners) {
    if (banner.image) {
      const base64 = await getBase64(banner.image)
      bannersWithBase64.push({ image: base64, link: !!banner?.link?.trim() ? banner.link : undefined, id: banner?.id })
    }
  }

  return await api.put(`/company/${companyId}/banners`, { banners: bannersWithBase64 })
}

export const getCompanySubscriptionBySlug = async (slug: string) => {
  const { data } = await api.get<Company.Subscription[]>(`/company/${slug}/subscription`)
  return data
}

export const getCompanyLinksPageCustomization = async (companyId: string) => {
  const { data } = await api.get<Company.LinksPageCustomization>(`/links-page/${companyId}`)
  return data
}

export type UpdateLinksPageCustomizationDto = Omit<Company.LinksPageCustomization, 'logo'> & {
  logo?: File | null
}

export const updateCompanyLinksPageCustomization = async (companyId: string, dto: UpdateLinksPageCustomizationDto) => {
  let linksPageLogo: string | undefined = undefined

  if (dto?.logo) {
    linksPageLogo = await getBase64(dto.logo)
  }

  return await api.put(`/links-page/${companyId}`, {
    ...dto,
    logo: linksPageLogo ?? dto?.logo,
  })
}