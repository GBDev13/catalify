import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  async createSubscription(customerId: string) {
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
