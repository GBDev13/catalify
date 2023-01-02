import { Prisma } from '@prisma/client';

export class ProductVariant
  implements Prisma.ProductVariantUncheckedCreateInput
{
  id?: string;
  name: string;
  companyId: string;
  productId: string;
}
