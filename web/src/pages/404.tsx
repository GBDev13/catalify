import { useSession } from "next-auth/react";
import Link from "next/link";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { Button } from "src/components/ui/Button";

export default function Page404() {
  // const { status } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <DashboardSEO title="Página não encontrada" />
      <img src="/images/404.svg" alt="404" className="w-[600px]" />
      {/* <Link className="relative md:-top-10" href={status === 'authenticated' ? '/dashboard' : '/'}>
        <Button variant="OUTLINE">Voltar ao início</Button>
      </Link> */}
    </main>
  )
}