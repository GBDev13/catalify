export const productsKey = {
  all: ['products'],
  categories: ['categories'],
  single: (productId: string) => ['product', productId],
}

export const companyKeys = {
  userCompanyInfo: (userId: string) => ['company', userId],
}