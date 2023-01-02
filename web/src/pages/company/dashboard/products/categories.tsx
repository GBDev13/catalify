import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiPlusCircle, FiTrash } from "react-icons/fi";
import { CreateCategoryModal } from "src/components/pages/company/dashboard/categories/create-category-modal";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { Table } from "src/components/ui/Table";
import { Tooltip } from "src/components/ui/Tooltip";
import { productsKey } from "src/constants/query-keys";
import { deleteCategory, getCategories } from "src/services/products";
import { useCompany } from "src/store/company";

export default function CompanyProductsCategories() {
  const { company } = useCompany()
  const companyId = company?.id

  const { data: categories } = useQuery(productsKey.categories, () => getCategories(companyId!), {
    enabled: !!companyId
  })

  const queryClient = useQueryClient()

  const { mutate: handleDeleteCategory } = useMutation((categoryId: string) => toast.promise(deleteCategory(categoryId, companyId!), {
    loading: 'Deletando categoria...',
    success: 'Categoria deletada com sucesso!',
    error: 'Erro ao deletar categoria'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(productsKey.categories)
    }
  })

  const cols = useMemo<ColumnDef<Products.Category>[]>(
    () => [
      {
        header: 'Nome',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Nome'
      },
      {
        header: () => <span className="block text-right">Ações</span>,
        accessorKey: 'id',
        cell: (row) => (
          <div className="flex items-center justify-end">
            <ConfirmationPopover onConfirm={() => handleDeleteCategory(String(row.getValue()))} message="Tem certeza que deseja deletar esta categoria?">
              <div>
                <Tooltip content="Excluir categoria">
                  <Button variant="TEXT">
                    <FiTrash size={20} />
                  </Button>
                </Tooltip>
              </div>
            </ConfirmationPopover>

            <CreateCategoryModal initialData={row.row.original}>
              <div>
                <Tooltip content="Editar categoria">
                  <Button variant="TEXT">
                    <FiEdit size={20} />
                  </Button>
                </Tooltip>
              </div>
            </CreateCategoryModal>
          </div>
        )
      }
    ],
    []
   );

  return (
    <>
      <PageTitle title="Categorias">
        <CreateCategoryModal>
          <Button>
            <FiPlusCircle size={20} />
            Adicionar Categoria
          </Button>
        </CreateCategoryModal>
      </PageTitle>

      <Table columns={cols} data={categories ?? []} />
    </>
  )
}