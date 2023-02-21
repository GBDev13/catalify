import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { lighten } from 'polished'
import { setCssVariable, setScrollColors } from 'src/helpers/set-css-variable'
import { checkColorReadability } from 'src/helpers/check-color-readability'

type CatalogInfo = {
  slug: string;
  name: string
  logo: string
  phone: string
  links: string[]
}

type CatalogColors = {
  primary: string
  lighter: string
  readableColor: string
}

type CatalogStore = {
  info: CatalogInfo;
  colors: CatalogColors
  setCatalogInfo: (info: CatalogInfo) => void; 
  setCatalogColors: (companyColor: string) => void;
}

export const useCatalog = create<CatalogStore>()(
  devtools(
    immer((set, get) => ({
      info: {} as CatalogInfo,
      colors: {} as CatalogColors,
      setCatalogInfo: (info) => {
        set((state) => {
          state.info = info
        })
      },
      setCatalogColors: (companyColor) => {
        set((state) => {
          state.colors = {
            primary: companyColor,
            readableColor: checkColorReadability(companyColor, '#fff', '#000'),
            lighter: lighten(0.25, companyColor)
          }
          setCssVariable('--color-primary', state.colors.primary)
          setCssVariable('--color-primary-light', state.colors.lighter)
          setCssVariable('--color-readable', state.colors.readableColor)
          setScrollColors(state.colors.primary, state.colors.lighter)
        })
      }
    })),
  ),
)