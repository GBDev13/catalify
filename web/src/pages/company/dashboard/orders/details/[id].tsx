import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiUser } from "react-icons/fi";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ordersKeys } from "src/constants/query-keys";
import { formatPrice } from "src/helpers/format-price";
import { orderStatusToText } from "src/helpers/order-status-to-text";
import { completeOrder, getOrderById } from "src/services/orders";
import { useCompany } from "src/store/company";

export default function OrderDetails() {
  const router = useRouter()
  const orderId = router.query.id as string

  const { company } = useCompany()
  const companyId = company?.id!

  const { data: order } = useQuery(ordersKeys.orderById(orderId), () => getOrderById(orderId), {
    enabled: !!orderId
  })

  const queryClient = useQueryClient();

  const { mutate: handleCompleteOrder } = useMutation(() => toast.promise(completeOrder(order?.id!), {
    loading: 'Concluindo pedido...',
    success: 'Pedido concluído com sucesso!',
    error: 'Ocorreu um erro ao concluir o pedido'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(ordersKeys.companyOrders(companyId))
      queryClient.setQueryData<Catalog.Order>(ordersKeys.orderById(orderId), (oldData) => {
        if(!oldData) return undefined;
        return {
          ...oldData,
          status: "FINISHED"
        }
      })
    }
  })

  if(!order) return null;
  
  const phone = `${order.buyerPhone.slice(0, 2)} ${order.buyerPhone.slice(2, order.buyerPhone.length)}`
  const formattedCreatedAt = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const total = order.products.reduce((acc, item) => {
    const price = item?.promoPrice ?? item?.price;
    return acc + (price * item.quantity)
  }, 0)

  const formattedTotal = formatPrice(total)

  return (
    <>
      <PageTitle title="Detalhes do Pedido">
        <Button size="SMALL" variant="OUTLINE" onClick={() => router.back()}>
          <FiArrowLeft />
          Voltar
        </Button>
      </PageTitle>
      
        <header className="flex items-center justify-between flex-col gap-2 md:gap-0 md:flex-row my-8 md:my-10">
          <h1 className="text-xl text-gray-600">Pedido <span className="text-indigo-500 font-light">{order.id}</span></h1>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 flex-col md:flex-row">
              <p className="text-lg flex items-center gap-1 text-gray-600">
                <FiUser className="text-indigo-500" size={20} />
                {order.buyerName}
              </p>
              <a className="text-lg flex items-center gap-1 text-gray-600 hover:text-indigo-500 transition-colors" target="_blank" href={`https://wa.me/${order.buyerPhone}?text=${encodeURIComponent(`Olá ${order.buyerName}!`)}`} rel="noreferrer">
                <FaWhatsapp className="text-indigo-500" size={20} />
                {phone}
              </a>
            </div>
            <p className="text-lg flex items-center gap-1 text-gray-600">
              <FiCalendar size={15} className="text-indigo-500" />
              {formattedCreatedAt}
            </p>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between border-b border-b-gray-300 pb-4 mb-4 flex-col gap-2 sm:gap-0 sm:flex-row">
            <h2 className="text-3xl font-semibold text-gray-600">Produtos</h2>
            <h3 className="text-2xl text-gray-600 font-semibold">Total: <span className="text-indigo-500 font-normal">{formattedTotal}</span></h3>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {order.products.map((item, index) => {
                const formattedPrice = formatPrice(item?.promoPrice ?? item?.price);

                return (
                  <div key={`cart-item-${index}`} className="flex gap-4">
                    <img className="w-24 h-24 border border-gray-100 rounded-md" src={item?.picture ?? "/images/product-placeholder.svg"} />
        
                    <div className="flex flex-col">
                      <strong className="font-normal text-gray-500 text-xl line-clamp-2">{`${item.quantity} x ${item.name}`}</strong>
                      {item?.variants && (
                        <span className="text-sm text-gray-400">
                          {item.variants.join(' - ')}
                        </span>
                      )}
                      <span className="text-indigo-500 font-semibold text-lg">{formattedPrice}</span>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="flex items-center justify-between border-t border-t-gray-300 mt-10 pt-10">
            <p className="text-lg text-gray-500 font-semibold">
              {`Status do pedido: `}
              <span className="text-indigo-500">{orderStatusToText(order.status)}</span>
            </p>
            <Button disabled={order.status !== 'PENDING'} onClick={() => handleCompleteOrder()}>
              <FiCheckCircle size={20} />
              Concluir pedido
            </Button>
          </div>
        </section>
    </>
  )
}