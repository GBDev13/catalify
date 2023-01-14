import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CartItem = Products.CatalogProduct & {
  quantity: number
  cartId: string
  variants?: {
    id: string;
    name: string;
    option: string;
    optionId: string;
  }[]
}

type CartStore = {
  cartIsOpen: boolean
  setCartIsOpen: (isOpen: boolean) => void
  cartItems: CartItem[]
  addProductToCart: (product: Omit<CartItem, 'quantity' | 'cartId'>) => void
  removeProductById: (cartId: string) => void;
  resetCart: () => void;
}

export const useCart = create<CartStore>()(
  devtools(
    immer((set, get) => ({
      cartItems: [],
      cartIsOpen: false,
      setCartIsOpen: (isOpen) => {
        set((state) => {
          state.cartIsOpen = isOpen
        })
      },
      addProductToCart: (product) => {
        set((state) => {
          const existingProduct = state.cartItems.find((item) => {
            return (item.name === product.name) && (item.variants?.length === product.variants?.length) && (item.variants?.every((variant, index) => {
              return variant.optionId === product.variants?.[index].optionId
            }))
          })

          if(existingProduct) {
            existingProduct.quantity++
          } else {
            state.cartItems.push({
              ...product,
              cartId: crypto.randomUUID(),
              quantity: 1
            })
          }
        })
      },
      removeProductById: (cartId) => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (item) => item.cartId !== cartId
          )
        })
      },
      resetCart: () => {
        set((state) => {
          state.cartItems = []
        })
      }
    })),
  ),
)