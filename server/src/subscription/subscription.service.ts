import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { LinksPageService } from 'src/links-page/links-page.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly linksPageService: LinksPageService,
  ) {}

  async createSubscription(customerId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    if (!company) {
      throw new HttpException(
        'Ocorreu um erro ao buscar sua empresa',
        HttpStatus.BAD_REQUEST,
      );
    }

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    if (companyHasSubscription) {
      return await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.ACTIVE,
        },
      });
    }

    await this.prisma.subscription.create({
      data: {
        companyId: company.id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    await this.linksPageService.create(company.id, {
      bgColor: company.themeColor,
      bgColor2: company.themeColor,
      textColor: '#000',
      textColor2: '#000',
      title: company.name,
      bgMode: 'solid',
      boxColor: '#fff',
      boxMode: 'solid',
      logoMode: 'free',
    });
  }

  async cancelSubscription(customerId: string, cancelAt?: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    if (companyHasSubscription) {
      if (cancelAt) {
        await this.prisma.subscription.update({
          where: {
            id: companyHasSubscription.id,
          },
          data: {
            status: SubscriptionStatus.CANCELING,
            expiresAt: new Date(cancelAt * 1000),
          },
        });

        return;
      }

      await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.CANCELED,
        },
      });
    }
  }

  async expireSubscription(customerId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    if (companyHasSubscription) {
      await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    }
  }

  async getSubscriptionByCompanySlug(companySlug: string) {
    if (!companySlug) {
      throw new HttpException(
        'Ocorreu um erro ao buscar seu plano atual',
        HttpStatus.BAD_REQUEST,
      );
    }

    const company = await this.prisma.company.findFirst({
      where: {
        slug: companySlug,
      },
      include: {
        subscription: true,
      },
    });
    return company?.subscription ?? [];
  }
}
