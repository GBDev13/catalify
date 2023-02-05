import { Prisma } from '@prisma/client';

export class Product implements Prisma.ProductUncheckedCreateInput {
  id?: string;
  name: string;
  price: number;
  promoPrice?: number;
  description?: string;
  categoryId?: string;
  companyId: string;
  isVisible?: boolean;
}
