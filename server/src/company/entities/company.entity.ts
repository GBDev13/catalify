import { Prisma } from '@prisma/client';

export class Company implements Prisma.CompanyUncheckedCreateInput {
  id?: string;
  name: string;
  ownerId: string;
  themeColor: string;
  slug: string;
  phone: string;
}
