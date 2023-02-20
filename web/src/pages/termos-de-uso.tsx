import { HomeFooter } from "src/components/pages/home/footer";
import { HomeHeader } from "src/components/pages/home/header";

const sections = [
  "O uso do sistema Catalify é de responsabilidade do usuário.",
  "É proibido o uso de dados falsos ou de terceiros para o cadastro no sistema.",
  "O usuário é responsável por manter a segurança de suas informações de login.",
  "O sistema pode ser atualizado ou modificado a qualquer momento sem aviso prévio.",
  "A empresa não se responsabiliza por eventuais falhas técnicas ou interrupções do sistema.",
  "Qualquer conteúdo enviado pelo usuário, como fotos, vídeos e textos, deve ser de sua propriedade ou ter autorização do titular.",
  "É proibido o uso do sistema para atividades ilegais ou fraudulentas.",
  "O usuário é responsável por todas as informações e conteúdos que enviar através do sistema.",
  "A empresa se reserva o direito de encerrar a conta de qualquer usuário que viole estes termos e condições de uso.",
  "O Catalify utiliza o Stripe como meio de pagamento seguro e confiável. Porém, não nos responsabilizamos por quaisquer problemas relacionados ao pagamento, uma vez que o processamento do pagamento é tratado exclusivamente pelo Stripe. Quaisquer problemas relacionados ao pagamento devem ser tratados diretamente com o Stripe.",
  "É proibido criar um catálogo com produtos ilegais, como produtos falsificados, drogas, armas, conteúdo adulto ou qualquer outra atividade ilícita. O Catalify não se responsabiliza por nenhum tipo de transação ilegal que ocorra através da plataforma e tem o direito de encerrar a conta de qualquer usuário que viole essa política.",
  "O Catalify não se responsabiliza por qualquer tipo de dano causado por terceiros, como roubo, furto, violência ou qualquer outro tipo de dano que possa ocorrer durante a realização de uma transação."
]

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col h-full min-h-screen">
      <HomeHeader withSolidBg withoutLinks mode="static" />

      <section className="home-container my-14">
        <h1 className="text-4xl font-semibold text-center">Termos de Uso</h1>

        <ul className="flex flex-col gap-2 list-disc pl-4 mt-6">
          {sections.map((item, i) => (
            <li key={`item-${i}`} className="text-gray-500">
              {item}
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-auto">
        <HomeFooter />
      </div>
    </main>
  )
}