import { Table } from "src/components/ui/Table"
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsKey } from "src/constants/query-keys";
import { deleteProduct, getProducts } from "src/services/products";
import { useCompany } from "src/store/company";
import { formatCurrency } from "src/helpers/formay-currency";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { FiDownload, FiEdit, FiPlusCircle, FiTrash } from "react-icons/fi";
import { Tooltip } from "src/components/ui/Tooltip";
import Link from "next/link";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import toast from "react-hot-toast";

export default function CompanyProducts() {
  const { company } = useCompany()
  const companyId = company?.id

  const { data: products } = useQuery(productsKey.all, () => getProducts(companyId!), {
    enabled: !!companyId
  })

  const queryClient = useQueryClient()

  const { mutate: handleDeleteProduct } = useMutation((productId: string) => toast.promise(deleteProduct(productId, companyId!), {
    loading: 'Removendo produto...',
    success: 'Produto removido com sucesso!',
    error: 'Erro ao remover produto'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(productsKey.all)
    }
  })

  const cols = useMemo<ColumnDef<Products.Product>[]>(
    () => [
      {
        header: 'Nome',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Nome'
      },
      {
        header: 'Preço',
        cell(props) {
          return formatCurrency(props.getValue() as number)
        },
        accessorKey: 'price',
        footer: 'Preço'
      },
      {
        header: 'Categoria',
        cell: (row) => row.row.original?.category?.name ?? 'Sem categoria',
        accessorKey: 'category',
        footer: 'Categoria'
      },
      {
        header: 'Ações',
        size: 80,
        accessorKey: 'id',
        cell: (row) => (
          <div className="flex items-center">
            <Tooltip content="Editar produto">
              <Link href={`./products/edit/${String(row.getValue())}`}>
                <Button variant="TEXT">
                  <FiEdit size={20} />
                </Button>
              </Link>
            </Tooltip>


            <ConfirmationPopover onConfirm={() => handleDeleteProduct(String(row.getValue()))} message="Tem certeza que deseja deletar este produto?">
              <div>
                <Tooltip content="Remover produto">
                  <Button variant="TEXT">
                    <FiTrash size={20} />
                  </Button>
                </Tooltip>
              </div>
            </ConfirmationPopover>
          </div>
        )
      }
    ],
    []
   );

  return (
    <>
      <PageTitle title="Produtos">
        <div className="flex items-center gap-2">
          <Button variant="OUTLINE">
            <FiDownload size={20} />
            Importar Produtos
          </Button>
          <Link passHref href="./products/new">
            <Button>
              <FiPlusCircle size={20} />
              Adicionar Produto
            </Button>
          </Link>
        </div>
      </PageTitle>

      <Table emptyState={{
        title: 'Sem produtos',
        description: 'Assim que você adicionar um produto, ele aparecerá aqui',
      }} columns={cols} data={products ?? []} />
    </>
  )
}