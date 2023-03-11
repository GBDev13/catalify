import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash } from "react-icons/fi";
import { ManageStockDialog } from "src/components/pages/company/dashboard/stock/manage-stock-dialog";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { Table } from "src/components/ui/Table";
import { Tooltip } from "src/components/ui/Tooltip";
import { companyKeys, stockKeys } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
import { deleteProductStock, getCompanyStock } from "src/services/stock";
import { useCompany } from "src/store/company";
import { checkSubscriptionSSR } from "src/helpers/chck-subscription-ssr";

function CompanyStock() {
  const { company, currentSubscription } = useCompany();
  const companyId = company?.id!;
  const hasSubscription = isSubscriptionValid(currentSubscription!)

  const { data: stock } = useQuery(companyKeys.companyStock(companyId), () => getCompanyStock(companyId), {
    enabled: !!companyId && hasSubscription
  })

  const queryClient = useQueryClient()

  const { mutate: handleDeleteStock } = useMutation((productId: string) => toast.promise(deleteProductStock(companyId, productId), {
    loading: 'Deletando estoque...',
    success: 'Estoque deletado com sucesso!',
    error: 'Erro ao deletar estoque'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(companyKeys.companyStock(companyId))
      queryClient.invalidateQueries(stockKeys.stockOptions(companyId))
    }
  })

  const cols = useMemo<ColumnDef<Stock.StockTotalItem>[]>(
    () => [
      {
        header: 'Produto',
        cell: (row) => row.renderValue(),
        accessorKey: 'productName'
      },
      {
        header: 'Tem variações?',
        cell: (row) => (
          <>
            {row.getValue() ? 'Sim' : 'Não'}
          </>
        ),
        accessorKey: 'hasVariants'
      },
      {
        header: 'Total',
        cell: (row) => row.renderValue(),
        accessorKey: 'total'
      },
      {
        header: () => <span className="block w-full text-right">Ações</span>,
        accessorKey: 'id',
        cell: (row) => (
          <div className="flex items-center justify-end">
            <ConfirmationPopover onConfirm={() => handleDeleteStock(String(row.getValue()))} message="Tem certeza que deseja deletar o estoque deste produto?">
              <div>
                <Tooltip content="Excluir estoque">
                  <Button variant="TEXT">
                    <FiTrash size={20} />
                  </Button>
                </Tooltip>
              </div>
            </ConfirmationPopover>

            <ManageStockDialog selectedProductId={String(row.getValue())}>
              <div>
                <Tooltip content="Editar quantidade de estoque">
                  <Button variant="TEXT">
                    <FiEdit size={20} />
                  </Button>
                </Tooltip>
              </div>
            </ManageStockDialog>
          </div>
        )
      }
    ],
    [handleDeleteStock]
  );

  const router = useRouter()
  const productStockId = router.query.productId as string

  const [manageIsOpen, setManageIsOpen] = useState(false)

  useEffect(() => {
    if (productStockId) {
      setManageIsOpen(true)
    }
  }, [productStockId, router])

  const handleOpenChange = (isOpen: boolean) => {
    if(productStockId) {
      router.replace('/dashboard/stock', undefined, { shallow: true })
    }
    setManageIsOpen(isOpen)
  }

  return (
    <>
      <DashboardSEO title="Estoque" />

      <PageTitle title="Estoque">
        <ManageStockDialog open={manageIsOpen} selectedProductId={productStockId} onOpenChange={handleOpenChange}>
          <Button>
            Adicionar estoque
          </Button>
        </ManageStockDialog>
      </PageTitle>

      <Table emptyState={{
        title: 'Nenhum Estoque Adicionado',
        description: 'Assim que você adicionar o estoque para algum produto, ele aparecerá aqui',
      }}  columns={cols} data={stock ?? []} />
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return checkSubscriptionSSR(context)
});

export default CompanyStock;