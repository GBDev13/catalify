export const VARIANT_MODELS = [
  {
    value: 'sizes',
    label: 'Tamanhos',
    options: ["PP", "P", "M", "G", "GG", "XG", "XGG"]
  }
]

export const IMAGE_TYPES = {
  'image': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

export const SHEETS_TYPES = {
  'text/csv': ['text/csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
}

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024 // 5MB
export const SHEETS_MAX_SIZE = 8 * 1024 * 1024 // 8MB

export const LIMITS = {
  FREE: {
    MAX_CATEGORIES: 5,
    MAX_PRODUCTS: 10,
    MAX_IMAGES_PER_PRODUCT: 3,
    MAX_VARIATIONS_PER_PRODUCT: 1,
    MAX_OPTIONS_PER_VARIATION: 10,
    MAX_CONTACT_LINKS: 2,
  },
  PREMIUM: {
    MAX_IMAGES_PER_PRODUCT: 5,
    MAX_VARIATIONS_PER_PRODUCT: 2,
    MAX_OPTIONS_PER_VARIATION: 10,
    MAX_CONTACT_LINKS: 10,
    MAX_LINKS_PAGE_LINKS: 10,
    MAX_BANNERS: 3,
  },
};