import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import { BannersForm } from "src/components/pages/company/dashboard/catalog/banners-form";
import { LinksForm } from "src/components/pages/company/dashboard/catalog/links-form";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { TipIcon } from "src/components/ui/TipIcon";

export default function CatalogCustomization() {
  const router = useRouter();

  const finalSlashIndex = router.asPath.lastIndexOf('/')
  const previousPath = router.asPath.slice(0, finalSlashIndex)

  return (
    <>
      <PageTitle title="Customizações">
        <Link passHref href={previousPath}>
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6 flex items-center gap-2">
            Links
            <TipIcon size={20} tip="Os links irão ficar no rodapé de todas as páginas do catálogo, recomendamos adicionar todas as redes sociais da empresa!" />
          </h4>

          <LinksForm />      
        </div>

        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6 flex items-center gap-2">
            Banners de destaque
            <TipIcon size={20} tip="Esses banners serão usados na página principal do catálogo, eles são ótimos para divulgar promoções ou algo do tipo." />
          </h4>

          <BannersForm />
        </div>
      </section>
    </>
  )
}