import { Table } from "src/components/ui/Table"
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsKey } from "src/constants/query-keys";
import { getProducts } from "src/services/products";
import { useCompany } from "src/store/company";
import { formatCurrency } from "src/helpers/formay-currency";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { FiDownload, FiEdit, FiPlusCircle, FiTrash } from "react-icons/fi";
import { Tooltip } from "src/components/ui/Tooltip";
import Link from "next/link";

export default function CompanyProducts() {
  const { company } = useCompany()
  const companyId = company?.id

  const { data: products } = useQuery(productsKey.all, () => getProducts(companyId!), {
    enabled: !!companyId
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
        cell: (row) => row.row.original?.name ?? 'Sem categoria',
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
              <Button variant="TEXT" onClick={() => console.log('edit', row.getValue())}>
                <FiEdit size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Excluir produto">
              <Button variant="TEXT" onClick={() => console.log('remove', row.getValue())}>
                <FiTrash size={20} />
              </Button>
            </Tooltip>
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

      <Table columns={cols} data={products ?? []} />
    </>
  )
}