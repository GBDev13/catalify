import { Prisma } from '@prisma/client';

export class Category implements Prisma.CategoryUncheckedCreateInput {
  id?: string;
  name: string;
  companyId: string;
  isEditable?: boolean;
  createdAt?: Date;
}
