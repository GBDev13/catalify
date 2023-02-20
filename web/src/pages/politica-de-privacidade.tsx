import { HomeFooter } from "src/components/pages/home/footer";
import { HomeHeader } from "src/components/pages/home/header";

const sections = [
  {
    description: "A privacidade dos nossos usuários é muito importante para nós. Esta política de privacidade descreve as informações que coletamos e como as usamos. Ao utilizar nossa aplicação, você concorda com a coleta e uso de informações de acordo com esta política."
  },
  {
    title: "Informações que coletamos",
    description: "Podemos coletar informações pessoais identificáveis, como nome, endereço de e-mail e informações de pagamento. Também podemos coletar informações não pessoais, como informações de uso e dispositivos."
  },
  {
    title: "Uso de informações",
    description: "As informações coletadas são usadas para fornecer e manter nossa aplicação, melhorar a experiência do usuário e fornecer suporte ao cliente. Podemos usar as informações para entrar em contato com os usuários e fornecer atualizações sobre a aplicação ou serviços relacionados."
  },
  {
    title: "Compartilhamento de informações",
    description: "Não compartilhamos informações pessoais com terceiros, exceto quando exigido por lei. Também podemos compartilhar informações não pessoais com terceiros para fins de análise e marketing."
  },
  {
    title: "Segurança das informações",
    description: "Tomamos medidas de segurança para proteger as informações dos usuários. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Não podemos garantir a segurança absoluta das informações."
  },
  {
    title: "Alterações nesta política de privacidade",
    description: "Podemos atualizar esta política de privacidade periodicamente. As alterações entrarão em vigor assim que publicadas nesta página."
  },
  {
    title: "Contato",
    description: "Se você tiver alguma dúvida sobre esta política de privacidade, entre em contato conosco através do e-mail contato@catalify.com.br"
  }
]

export default function PrivacyPolicy() {
  return (
    <main>
      <HomeHeader withSolidBg withoutLinks mode="static" />

      <section className="home-container my-14">
        <h1 className="text-4xl font-semibold text-center">Política de Privacidade</h1>

        {sections.map((section, i) => (
          <div key={`section-${i}`} className="mt-10">
            {section.title && <h2 className="text-2xl font-semibold">{section.title}</h2>}
            <p className="text-gray-500 mt-2">{section.description}</p>
          </div>
        ))}
      </section>
      <HomeFooter />
    </main>
  )
}