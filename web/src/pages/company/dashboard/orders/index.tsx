import { Table } from "src/components/ui/Table"
import { ColumnDef } from '@tanstack/react-table';
import { MouseEvent, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersKeys, productsKey } from "src/constants/query-keys";
import { deleteProduct, getProducts, toggleHighlight } from "src/services/products";
import { useCompany } from "src/store/company";
import { formatCurrency } from "src/helpers/formay-currency";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { FiDownload, FiEdit, FiEye, FiPlusCircle, FiTrash } from "react-icons/fi";
import { Tooltip } from "src/components/ui/Tooltip";
import Link from "next/link";
import { ConfirmationPopover } from "src/components/pages/shared/ConfirmationPopover";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import clsx from "clsx";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { LIMITS } from "src/constants/constants";
import { getOrders } from "src/services/orders";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { withAuth } from "src/helpers/withAuth";

function CompanyOrders() {
  const { company, currentSubscription } = useCompany()
  const companyId = company?.id!

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  const { data: orders } = useQuery(ordersKeys.companyOrders(companyId), () => getOrders(companyId), {
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

  const renderStatus = (status: Orders.OrderStatus) => {
    switch(status) {
      case 'PENDING':
        return (
          <span className="bg-yellow-500 text-white rounded px-2 py-0.5">
            Pendente
          </span>
        )
      case 'FINISHED':
        return (
          <span className="bg-green-500 text-white rounded px-2 py-0.5">
            Concluído
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="bg-red-500 text-white rounded px-2 py-0.5">
            Expirado
          </span>
        )
    }
  }

  const renderTotal = (products: Orders.OrderProduct[]) => {
    const total = products?.reduce((acc, item) => {
      return acc + ((item?.promoPrice ?? item.price) * item.quantity)
    }, 0)

    return formatCurrency(total)
  }

  const renderDate = (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const cols = useMemo<ColumnDef<Orders.Order>[]>(
    () => [
      {
        header: 'Cliente',
        cell: (row) => row.renderValue(),
        accessorKey: 'buyerName',
      },
      {
        header: 'Status',
        cell: (row) => renderStatus(row.getValue() as Orders.OrderStatus),
        accessorKey: 'status',
      },
      {
        header: 'Total',
        cell: (row) => renderTotal(row.getValue() as Orders.OrderProduct[]),
        accessorKey: 'products',
      },
      {
        header: 'Data',
        cell: (row) => renderDate(row.getValue() as string),
        accessorKey: 'createdAt',
      },
      {
        header: 'Ações',
        accessorKey: 'id',
        cell: (row) => (
          <div className="flex">
            <Tooltip content="Ver detalhes pedido">
              <Link href={`/company/dashboard/orders/details/${row.getValue()}`}>
                <Button variant="TEXT">
                  <FiEye size={20} />
                </Button>
              </Link>
            </Tooltip>
          </div>
        )
      }
    ],
    []
  );

  return (
    <>
      <DashboardSEO title="Pedidos" />

      <PageTitle title="Pedidos" />

      <Table emptyState={{
        title: 'Sem Pedidos',
        description: 'Assim que você receber um pedido, ele aparecerá aqui',
      }} columns={cols} data={orders ?? []} />
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default CompanyOrders;