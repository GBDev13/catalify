import { signOut, useSession } from "next-auth/react"

export default function CompanyDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
      <button onClick={() => signOut()}>sign out</button>
      <h1>Company Dashboard</h1>
    </div>
  )
}