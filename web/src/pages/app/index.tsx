import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

export default function App() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    redirect: {
      destination: session ? "/dashboard" : "/login",
      permanent: false
    }
  }
}