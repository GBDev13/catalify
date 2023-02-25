import { signOut } from "next-auth/react"
import { LOCALHOST_URL } from "src/constants/config"

export const onSignOut = async () => {
  await signOut({ redirect: false })
  window.location.replace(process.env.NODE_ENV === 'development' ? `http://app.${LOCALHOST_URL}/login` : 'https://app.catalify.com.br/login')
}