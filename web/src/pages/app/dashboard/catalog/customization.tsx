import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import { BannersForm } from "src/components/pages/company/dashboard/catalog/banners-form";
import { CatalogDetails } from "src/components/pages/company/dashboard/catalog/catalog-details";
import { LinksForm } from "src/components/pages/company/dashboard/catalog/links-form";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { TipIcon } from "src/components/ui/TipIcon";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
import { useCompany } from "src/store/company";

function CatalogCustomization() {
  const router = useRouter();

  const { currentSubscription } = useCompany();
  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  return (
    <>
      <DashboardSEO title="Customizações" />

      <PageTitle title="Customizações">
        <Link passHref href='/dashboard'>
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <CatalogDetails /> 
        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6 flex items-center gap-2">
            Links de Contato
            <TipIcon size={20} tip="Os links irão ficar no rodapé de todas as páginas do catálogo, recomendamos adicionar todas as redes sociais da empresa!" />
          </h4>

          <LinksForm />      
        </div>

        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6 flex items-center gap-2">
            Banners de destaque
            <TipIcon size={20} tip="Esses banners serão usados na página principal do catálogo, eles são ótimos para divulgar promoções ou algo do tipo." />
          </h4>

          {subscriptionIsValid ? (
            <BannersForm />
          ) : (
            <div className="flex flex-col items-center gap-2 text-sm">
              <p className="text-slate-500 text-center">Para acessar essa funcionalidade, é necessário ter uma <span className="text-indigo-500 font-semibold">assinatura premium.</span></p>
              <Link passHref href="/dashboard/plans">
                <Button size="SMALL" className="!px-10 !py-2.5 !min-h-0">Ver planos</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default CatalogCustomization;