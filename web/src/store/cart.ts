import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CartItem = Products.CatalogProduct & {
  quantity: number
}

type CartStore = {
  cartIsOpen: boolean
  setCartIsOpen: (isOpen: boolean) => void
  cartItems: CartItem[]
  addProductToCart: (product: Products.CatalogProduct) => void
  removeProductById: (productId: string) => void;
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
          const existingProduct = state.cartItems.find(
            (item) => item.id === product.id
          )

          if(existingProduct) {
            existingProduct.quantity++
          } else {
            state.cartItems.push({
              ...product,
              quantity: 1
            })
          }
        })
      },
      removeProductById: (productId) => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== productId
          )
        })
      }
    })),
  ),
)