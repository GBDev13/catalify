import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash } from "react-icons/fi";
import { ManageStockDialog } from "src/components/pages/company/dashboard/stock/manage-stock-dialog";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { Table } from "src/components/ui/Table";
import { Tooltip } from "src/components/ui/Tooltip";
import { companyKeys, stockKeys } from "src/constants/query-keys";
import { deleteProductStock, getCompanyStock } from "src/services/stock";
import { useCompany } from "src/store/company";

export default function CompanyStock() {
  const { company } = useCompany();
  const companyId = company?.id!;

  const { data: stock } = useQuery(companyKeys.companyStock(companyId), () => getCompanyStock(companyId), {
    enabled: !!companyId
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
    // todo - open dialog when has id in url
  return (
    <>
      <PageTitle title="Estoque">
        <ManageStockDialog>
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