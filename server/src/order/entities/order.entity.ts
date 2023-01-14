import { OrderStatus, Prisma } from '@prisma/client';

export class Order implements Prisma.OrderUncheckedCreateInput {
  id: string;
  companyId: string;
  expiresAt: Date;
  buyerName: string;
  buyerPhone: string;
  status: OrderStatus;
}
