import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiPlusCircle, FiTrash } from "react-icons/fi";
import { CreateCategoryModal } from "src/components/pages/company/dashboard/categories/create-category-modal";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { Table } from "src/components/ui/Table";
import { Tooltip } from "src/components/ui/Tooltip";
import { LIMITS } from "src/constants/constants";
import { productsKey } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
import { deleteCategory, getCategories } from "src/services/products";
import { useCompany } from "src/store/company";

function CompanyProductsCategories() {
  const { company, currentSubscription } = useCompany()
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
        header: 'Criada em',
        cell: (row) => (
          <span className="block w-full">
            {new Date(row?.row?.original?.createdAt!).toLocaleDateString('pt-BR')}
          </span>
        ),
        accessorKey: 'createdAt',
        sortingFn: (a, b) => new Date(a.original.createdAt!).getTime() - new Date(b.original.createdAt!).getTime(),
      },
      {
        header: () => <span className="block w-full text-right">Ações</span>,
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

            {row.row.original.isEditable ? (
              <CreateCategoryModal initialData={row.row.original}>
                <div>
                  <Tooltip content="Editar categoria">
                    <Button variant="TEXT">
                      <FiEdit size={20} />
                    </Button>
                  </Tooltip>
                </div>
              </CreateCategoryModal>
            ) : (
              <Tooltip content="A edição desta categoria está desabilitada">
                <Button variant="TEXT" disabled>
                  <FiEdit size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
        )
      }
    ],
    [handleDeleteCategory]
  );

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

   const checkCount = (e: any) => {
    if(!subscriptionIsValid && categories!?.length >= LIMITS.FREE.MAX_CATEGORIES) {
      toast.error("Você atingiu o limite de categorias para sua conta gratuita")
      e.preventDefault()
    }
   }

  return (
    <>
      <DashboardSEO title="Categorias" />

      <PageTitle title="Categorias">
        <CreateCategoryModal>
          <Button onClick={checkCount}>
            <FiPlusCircle size={20} />
            Adicionar Categoria
          </Button>
        </CreateCategoryModal>
      </PageTitle>

      <Table emptyState={{
        title: 'Sem categorias',
        description: 'Assim que você adicionar uma categoria, ela aparecerá aqui',
      }} columns={cols} data={categories ?? []} initialState={{
        sorting: [
          { id: 'createdAt', desc: true }
        ]
      }} />
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default CompanyProductsCategories;