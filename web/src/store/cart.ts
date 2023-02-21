import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CartItem = Omit<Products.CatalogProduct, 'hasStock'> & {
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
  setCartItems: (cartItems: CartItem[]) => void;
  checkoutFormDialogIsOpen: boolean
  setCheckoutFormDialogIsOpen: (isOpen: boolean) => void
}

export const useCart = create<CartStore>()(
  devtools(
    immer(
      persist((set, get) => ({
        cartItems: [],
        cartIsOpen: false,
        checkoutFormDialogIsOpen: false,
        setCartIsOpen: (isOpen) => {
          set((state) => {
            state.cartIsOpen = isOpen
          })
        },
        setCheckoutFormDialogIsOpen: (isOpen) => {
          set((state) => {
            state.checkoutFormDialogIsOpen = isOpen
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
        },
        setCartItems: (cartItems) => {
          set((state) => {
            state.cartItems = cartItems
          })
        }
      }), {
        name: 'catalify:cart',
        partialize: (state) => ({ cartItems: state.cartItems }),
      })
    ),
  ),
)