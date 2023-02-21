import Link from "next/link"

export const ExampleBanner = () => {
  return (
    <div className="w-full bg-primary text-readable min-h-max py-3 px-2 flex items-center justify-center text-xs text-center md:text-base">
      <span>
        Esse catálogo é um exemplo, todo o conteúdo é fictício. Para criar o seu catálogo, acesse <Link href="/" className="underline transition-colors hover:text-indigo-500">catalify.com.br</Link>
      </span>
    </div>
  )
}