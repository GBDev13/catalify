import { useRouter } from "next/router"
import { DefaultToastOptions, Toaster } from "react-hot-toast"

export const CustomToaster = () => {
  const router = useRouter();

  const companySlug = router.query?.companySlug;

  const isAdminPage = !companySlug;

  const toastOptions: DefaultToastOptions = isAdminPage ? {} : {
    duration: 5000,
    success: {
      className: "!bg-primary !text-white",
      iconTheme: {
        primary: 'white',
        secondary: 'var(--color-primary)',
      }
    },
    error: {
      className: "!bg-red-500 !text-white",
      iconTheme: {
        primary: 'white',
        secondary: '#ef4444',
      }
    }
  }

  const position = isAdminPage ? 'bottom-center' : 'top-left'

  return (
    <Toaster position={position} toastOptions={toastOptions} />
  )
}