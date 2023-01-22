export const productsKey = {
  all: ['products'],
  categories: ['categories'],
  single: (productId: string) => ['product', productId],
}

export const companyKeys = {
  userCompanyInfo: (userId: string) => ['company', userId],
  companyLinks: (companyId: string) => [companyId, 'links'],
  companyBanners: (companyId: string) => [companyId, 'banners'],
  companySubscription: (companyId: string) => [companyId, 'subscription'],
  companyLinksPageCustomization: (companyId: string) => [companyId, 'links-page-customization'],
  companyLinksPageLinks: (companyId: string) => [companyId, 'links-page-links'],
  companyPublicLinksPage: (companySlug: string) => [companySlug, 'public-links-page'],
}

export const catalogKeys = {
  companyCatalog: (slug: string) => ['catalog', slug],
  companyCategories: (slug: string) => [slug, 'catalog-categories'],
  companyProducts: (slug: string) => [slug, 'catalog-products'],
  companyBanners: (slug: string) => [slug, 'catalog-banners'],
  companyProduct: (productSlug: string) => [`product-${productSlug}`],
  companyFilteredProducts: (slug: string, page: number, categories: string[], order: string, search: string) => [`filtered-products-${slug}`, page, `categories-${categories.join(',')}`, order, search],
  orderById: (orderId: string) => ['order', orderId],
}