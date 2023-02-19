import { Table } from "src/components/ui/Table"
import { ColumnDef } from '@tanstack/react-table';
import { MouseEvent, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsKey } from "src/constants/query-keys";
import { deleteProduct, getProducts, toggleHighlight } from "src/services/products";
import { useCompany } from "src/store/company";
import { formatCurrency } from "src/helpers/formay-currency";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { FiDownload, FiEdit, FiPlusCircle, FiTrash } from "react-icons/fi";
import { Tooltip } from "src/components/ui/Tooltip";
import Link from "next/link";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import clsx from "clsx";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { LIMITS } from "src/constants/constants";
import { ProductVisibilityToggle } from "src/components/pages/company/dashboard/products/product-visibility-toggle";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { withAuth } from "src/helpers/withAuth";

function CompanyProducts() {
  const { company, currentSubscription } = useCompany()
  const companyId = company?.id

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

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

  const { mutate: handleHighlightProduct } = useMutation((productId: string) => toast.promise(toggleHighlight(productId, companyId!), {
    loading: 'Alterando destaque...',
    success: 'Destaque alterado com sucesso!',
    error: (err) => err.response?.data?.message || 'Erro ao alterar destaque'
  }), {
    onSuccess(_, productId) {
      queryClient.setQueryData<Products.Product[]>(productsKey.all, (oldData) => {
        return oldData?.map(item => {
          if(item.id === productId) {
            return {
              ...item,
              isHighlighted: !item.isHighlighted
            }
          }
          return item
        })
      })
    },
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
          const promoPrice = props.row.original?.promoPrice;
          if (promoPrice) return (
            <div className="flex flex-col w-full">
              <span className="text-gray-500 text-xs line-through">{formatCurrency(props.getValue() as number)}</span>
              <span>{formatCurrency(promoPrice)}</span>
            </div>
          )

          return formatCurrency(props.getValue() as number)
        },
        sortingFn: (a, b) => {
          const aPrice = a.original?.promoPrice ?? a.original?.price
          const bPrice = b.original?.promoPrice ?? b.original?.price

          return aPrice - bPrice
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
        header: "Visível",
        cell: (row) => <ProductVisibilityToggle isVisible={!!row.getValue()} productId={row.row.original.id} />,
        accessorKey: 'isVisible',
        footer: 'Visível no catalogo',
        size: 80
      },
      {
        header: 'Ações',
        size: 80,
        accessorKey: 'id',
        enableSorting: false,
        cell: (row) => {
          const isHighlighted = row.row.original?.isHighlighted
          const productId = String(row.getValue());

          return (
            <div className="flex items-center">
              {subscriptionIsValid && (
                <Tooltip content={isHighlighted ? "Remover destaque" : "Destacar produto"}>
                  <button onClick={() => handleHighlightProduct(productId)} className={clsx("text-slate-500 p-2 hover:text-indigo-500", {
                    "text-indigo-400": isHighlighted,
                  })}>
                    {isHighlighted ? <AiFillStar size={25} /> : <AiOutlineStar size={25} />}
                  </button>
                </Tooltip>
              )}
              <Tooltip content="Editar produto">
                <Link href={`./products/edit/${productId}`}>
                  <Button variant="TEXT">
                    <FiEdit size={20} />
                  </Button>
                </Link>
              </Tooltip>
  
  
              <ConfirmationPopover onConfirm={() => handleDeleteProduct(productId)} message="Tem certeza que deseja deletar este produto?">
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
      }
    ],
    [handleDeleteProduct, handleHighlightProduct, subscriptionIsValid]
  );

   const checkCount = (e: MouseEvent) => {
    if(!subscriptionIsValid && products?.length >= LIMITS.FREE.MAX_PRODUCTS) {
      toast.error("Você atingiu o limite de produtos para sua conta gratuita")
      e.preventDefault()
    }
   }

  return (
    <>
      <DashboardSEO title="Produtos" />

      <PageTitle title="Produtos">
        <div className="flex items-center gap-2">
          <Button variant="OUTLINE">
            <FiDownload size={20} />
            Importar Produtos
          </Button>
          <Link passHref href="./products/new" onClick={checkCount}>
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

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default CompanyProducts;