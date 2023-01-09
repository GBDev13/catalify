export const productsKey = {
  all: ['products'],
  categories: ['categories'],
  single: (productId: string) => ['product', productId],
}

export const companyKeys = {
  userCompanyInfo: (userId: string) => ['company', userId],
  companyLinks: (companyId: string) => [companyId, 'links'],
  companyBanners: (companyId: string) => [companyId, 'banners'],
}

export const catalogKeys = {
  companyCatalog: (slug: string) => ['catalog', slug],
  companyCategories: (slug: string) => [slug, 'catalog-categories'],
  companyProducts: (slug: string) => [slug, 'catalog-products'],
  companyBanners: (slug: string) => [slug, 'catalog-banners'],
}