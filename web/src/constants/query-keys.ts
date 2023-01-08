export const productsKey = {
  all: ['products'],
  categories: ['categories'],
  single: (productId: string) => ['product', productId],
}

export const companyKeys = {
  userCompanyInfo: (userId: string) => ['company', userId],
}

export const catalogKeys = {
  companyCatalog: (slug: string) => ['catalog', slug],
  companyCategories: (slug: string) => [slug, 'catalog-categories'],
  companyProducts: (slug: string) => [slug, 'catalog-products'],
}