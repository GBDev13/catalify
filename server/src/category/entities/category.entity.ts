import { Prisma } from '@prisma/client';

export class Category implements Prisma.CategoryUncheckedCreateInput {
  id?: string;
  name: string;
  companyId: string;
}
