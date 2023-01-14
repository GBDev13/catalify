export const orderStatusToText = (status: Catalog.OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "Aguardando"
    case "FINISHED":
      return "Finalizado"
    case "EXPIRED":
      return "Expirado"
    default:
      return "Aguardando"
  }
}