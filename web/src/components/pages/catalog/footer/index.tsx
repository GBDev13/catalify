import Link from 'next/link'
import { Logo } from 'src/assets/Logo'
import { getSocialIconByUrl } from 'src/helpers/get-social-icon-by-url'
import { useCatalog } from 'src/store/catalog'

export const Footer = () => {
  const { name, links, phone } = useCatalog(s => s.info)

  const linksWithPhone = [
    ...(links ?? []),
    ...(links?.some(x => x.includes('wa.me') || x.includes('whatsapp')) ? [] : [`https://wa.me/${phone}`])
  ]
  
  return (
   <footer className="w-full mt-auto">
    <section className="w-full bg-primary text-readable mt-20">
      <div className="w-full max-w-[1200px] mx-auto py-8 px-6 flex items-center justify-center flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between">
        <h4 className="font-semibold text-3xl">{name}</h4>

        <div className="flex items-center gap-4">
          {linksWithPhone?.map((link, index) => (
            <a key={index} href={link} target="_blank" className="hover:scale-90 duration-500 transition-all" rel="noreferrer">
              {getSocialIconByUrl(link)}
            </a>
          ))}
        </div>

      </div>
      <p className="w-full flex items-center justify-center gap-2 text-center border-t border-readable py-4 px-2">Desenvolvido por <Link className="font-bold" href="/">
        <Logo className="text-readable w-[80px]" />
      </Link></p>
    </section>
   </footer> 
  )
}