import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CompanyStore = {
  company: Company.Info | null
  setCompany: (company: Company.Info) => void
}

export const useCompany = create<CompanyStore>()(
  devtools(
    immer((set, get) => ({
      company: null,
      setCompany: (company) => {
        set((state) => {
          state.company = company
        })
      }
    })),
  ),
)