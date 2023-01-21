import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CompanyStore = {
  company: Company.Info | null
  currentSubscription?: Company.Subscription | null
  setCompany: (company: Company.Info) => void
  setCompanySubscription: (subscriptions: Company.Subscription[]) => void
}

export const useCompany = create<CompanyStore>()(
  devtools(
    immer((set, get) => ({
      company: null,
      activeSubscription: null,
      setCompany: (company) => {
        set((state) => {
          state.company = company
        })
      },
      setCompanySubscription: (subscriptions) => {
        set((state) => {
          state.currentSubscription = subscriptions[0]
        })
      }
    })),
  ),
)