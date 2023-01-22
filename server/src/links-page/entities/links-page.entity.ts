import { Prisma } from '@prisma/client';

export class LinksPage implements Prisma.CompanyLinksPageUncheckedCreateInput {
  title: string;
  headLine?: string;
  textColor: string;
  textColor2: string;
  boxColor: string;
  boxMode: string;
  bgColor: string;
  bgColor2: string;
  bgMode: string;
  logoMode: string;
  companyId: string;
}
