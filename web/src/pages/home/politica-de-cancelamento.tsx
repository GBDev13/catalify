import { HomeHeader } from "src/components/pages/home/header";
import { LandingSEO } from "src/components/pages/shared/LandingSEO";
import { motion } from 'framer-motion'
import { fadeAnimProps } from "src/lib/animations";
import { HomeFooter } from "src/components/pages/home/footer";
import { LIMITS } from "src/constants/constants";

export default function CancellationPolicy() {
  return (
    <main className="min-h-screen flex flex-col">
      <HomeHeader withSolidBg withoutLinks mode="static" />
      
      <LandingSEO title="Política de Cancelamento" />

      <section className="home-container my-14">
        <h1 className="text-4xl font-semibold text-center">Política de Cancelamento</h1>

        <motion.div className="mt-10" {...fadeAnimProps} viewport={undefined}>
          <h2 className="text-2xl font-semibold">Cancelamento</h2>
          <p className="text-gray-500 mt-2">
            Entendemos que as necessidades dos nossos clientes podem mudar a qualquer momento. Por esse motivo, oferecemos um plano de pagamento mensal, sem contratos a longo prazo. Se por algum motivo você precisar cancelar sua conta, você tem este direito a qualquer momento, sem taxas de cancelamento ou multas. Basta acessar sua conta e cancelar seu plano. Você não será cobrado novamente a partir do próximo ciclo de faturamento.
          </p>
        </motion.div>

        <motion.div className="mt-4" {...fadeAnimProps} viewport={undefined}>
          <h2 className="text-2xl font-semibold">Oque o usuário perde após o cancelamento?</h2>
          <ul className="flex flex-col mt-2 gap-2">
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Quantidade de Produtos: &nbsp;</strong>
              Usuários que cancelarem o plano retornarão aos limites do plano gratuito, ou seja, {LIMITS.FREE.MAX_PRODUCTS} produtos. Caso o usuário tenha mais de {LIMITS.FREE.MAX_PRODUCTS} produtos cadastrados, desabilitaremos a edição dos produtos mais antigos até que o usuário atinja o limite de {LIMITS.FREE.MAX_PRODUCTS} produtos, porém os produtos não serão excluídos.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Quantidade de Categorias: &nbsp;</strong>
              Assim como nos produtos, o limite retornará ao do plano gratuito, ou seja, {LIMITS.FREE.MAX_CATEGORIES} categorias. Caso o usuário tenha mais de {LIMITS.FREE.MAX_CATEGORIES} categorias cadastradas, desabilitaremos a edição das categorias mais antigas até que o usuário atinja o limite de {LIMITS.FREE.MAX_CATEGORIES} categorias, porém as categorias não serão excluídas.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Quantidade de Imagens por Produto: &nbsp;</strong>
              Caso o usuário tenha produtos que ultrapassem o limite de {LIMITS.FREE.MAX_IMAGES_PER_PRODUCT} imagens, as imagens serão mantidas. Apenas não será possível adicionar novas imagens.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Quantidade de Variações por Produto: &nbsp;</strong>
              Caso o usuário tenha produtos que ultrapassem o limite de {LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT} variação, a variações serão mantidas. Apenas não será possível adicionar novas variações.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Quantidade de Links de Contato: &nbsp;</strong>
              Caso o usuário tenha mais de {LIMITS.FREE.MAX_CONTACT_LINKS} links de contato, os links mais antigos serão deletados até que o usuário atinja o limite de {LIMITS.FREE.MAX_CONTACT_LINKS} links de contato.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Controle de Estoque: &nbsp;</strong>
              Caso o usuário tenha produtos com controle de estoque, o controle de estoque será desabilitado.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Destaque de Produtos: &nbsp;</strong>
              O destaque de todos os produtos será removido.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Página de Links: &nbsp;</strong>
              A página de links será desabilitada mas os dados não serão excluídos.
            </li>
            <li className="text-slate-500">
              <strong className="text-gray-600 font-semibold">Banners de Destaque: &nbsp;</strong>
              Todos os banners de destaque serão removidos.
            </li>
          </ul>
          <p className="text-slate-500 text-center text-sm mt-6">
            Caso o usuário tenha alguma dúvida sobre o cancelamento, entre em contato conosco através do email <a href="mailto:contato@catalify.com.br" className="text-indigo-500">contato@catalify.com.br</a>
          </p>
        </motion.div>
      </section>
      <div className="mt-auto">
        <HomeFooter />
      </div>
    </main>

  )
}