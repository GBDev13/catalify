export const checkoutCartToWhatsApp = (slug: string, orderId: string, buyerName: string) => {
  let message = `Olá, sou ${buyerName}, acabei de escolher estes produtos e desejo finalizar o pedido.\n`;
  message += `\n*Detalhes do Pedido*:\n`;
  message += `${location.origin}/pedido/${orderId}`;
  return message;
}