export const VARIANT_MODELS = [
  {
    value: 'sizes',
    label: 'Tamanhos',
    options: ["PP", "P", "M", "G", "GG", "XG", "XGG"]
  }
]

export const IMAGE_TYPES = {
  'image/jpeg': ['image/jpeg'],
  'image/jpg': ['image/jpg'],
  'image/png': ['image/png'],
  'image/webp': ['image/webp'],
}

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const LIMITS = {
  FREE: {
    MAX_CATEGORIES: 5,
    MAX_PRODUCTS: 10,
    MAX_IMAGES_PER_PRODUCT: 3,
    MAX_CONTACT_LINKS: 2,
  },
  PREMIUM: {
    MAX_IMAGES_PER_PRODUCT: 5,
    MAX_CONTACT_LINKS: 10,
    MAX_BANNERS: 3,
  },
};