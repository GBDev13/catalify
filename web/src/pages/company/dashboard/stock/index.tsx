import { AddStockDialog } from "src/components/pages/company/dashboard/stock/add-stock-dialog";
import { PageTitle } from "src/components/pages/shared/PageTitle";

export default function CompanyStock() {
  return (
    <>
      <PageTitle title="Estoque">
        <AddStockDialog />
      </PageTitle>
    </>
  )
}