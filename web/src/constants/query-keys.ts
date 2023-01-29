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
  companyStock: (companyId: string) => [companyId, 'stock'],
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

export const ordersKeys = {
  companyOrders: (companyId: string) => [companyId, 'orders'],
  orderById: (orderId: string) => ['order', orderId],
}

export const stockKeys = {
  stockOptions: (companyId: string) => [companyId, 'stock-options'],
  productStock: (companyId: string, productId: string) => [companyId, 'product-stock', productId],
}