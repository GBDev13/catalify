import Link from "next/link"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import { Logo } from "src/assets/Logo"

const socialMedias = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/catalifyapp",
    icon: <FaFacebook />
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/catalifyapp",
    icon: <FaInstagram />
  },
  {
    name: "Twitter",
    url: "https://www.twitter.com/catalifyapp",
    icon: <FaTwitter />
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/catalifyapp",
    icon: <FaYoutube />
  }
]

const navLinks = [
  {
    name: "Política de privacidade",
    url: "/politica-de-privacidade"
  },
  {
    name: "Termos de uso",
    url: "/termos-de-uso"
  }
]

export const HomeFooter = () => {
  return (
    <footer className="bg-indigo-500 text-white py-10">
      <div className="home-container flex items-start flex-col gap-4 sm:gap-0 justify-between sm:flex-row">
        <div className="w-full sm:max-w-[250px]">
          <Logo />
          <p className="text-white/70 mt-2">Catálogo digital que simplifica suas vendas!</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {socialMedias.map(social => (
              <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white/100 transition-colors">
                <span className="text-2xl">{social.icon}</span>
              </a>
            ))}

          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <h4 className="font-semibold text-xl">Links Úteis</h4>
          {navLinks.map(link => (
            <Link className="font-light text-white/50 hover:text-white/100 transition-colors" key={link.name} href={link.url}>{link.name}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}