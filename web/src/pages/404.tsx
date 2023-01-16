import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "src/components/ui/Button";

export default function Page404() {
  const { status } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <img src="/images/404.svg" alt="404" className="w-[600px]" />
      <Link className="relative md:-top-10" href={status === 'authenticated' ? '/company/dashboard' : '/'}>
        <Button variant="OUTLINE">Voltar ao início</Button>
      </Link>
    </main>
  )
}