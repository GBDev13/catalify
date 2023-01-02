import { Prisma } from '@prisma/client';

export class ProductVariantOption
  implements Prisma.ProductVariantOptionUncheckedCreateInput
{
  id?: string;
  name: string;
  companyId: string;
  productVariantId: string;
}
