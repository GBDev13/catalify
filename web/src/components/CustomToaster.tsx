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
    }
  }

  const position = isAdminPage ? 'bottom-center' : 'top-left'

  return (
    <Toaster position={position} toastOptions={toastOptions} />
  )
}