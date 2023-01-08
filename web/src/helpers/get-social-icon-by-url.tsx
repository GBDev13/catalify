import { FaFacebook, FaInstagram, FaLink, FaTwitter, FaWhatsapp } from 'react-icons/fa'

export const getSocialIconByUrl = (url: string) => {
  if (url.includes('instagram')) {
    return <FaInstagram size={25} />
  }

  if (url.includes('facebook')) {
    return <FaFacebook size={25} />
  }

  if (url.includes('twitter')) {
    return <FaTwitter size={25} />
  }

  if (url.includes('whatsapp')) {
    return <FaWhatsapp size={25} />
  }

  return <FaLink size={20} />
}