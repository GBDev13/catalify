import { Prisma } from '@prisma/client';

export class Product implements Prisma.ProductUncheckedCreateInput {
  id?: string;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  companyId: string;
}
