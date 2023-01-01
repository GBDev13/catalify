import { Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
