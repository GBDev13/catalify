import { Inject, Injectable } from '@nestjs/common';
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
    const user = await this.prisma.user.findFirst({
      where: {
        customerId,
      },
    });

    const userHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (userHasSubscription) {
      await this.prisma.subscription.update({
        where: {
          id: userHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.ACTIVE,
        },
      });
    }

    await this.prisma.subscription.create({
      data: {
        userId: user.id,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async cancelSubscription(customerId: string, cancelAt?: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        customerId,
      },
    });

    const userHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (userHasSubscription) {
      if (cancelAt) {
        await this.prisma.subscription.update({
          where: {
            id: userHasSubscription.id,
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
          id: userHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.CANCELED,
        },
      });
    }
  }

  async expireSubscription(customerId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        customerId,
      },
    });

    const userHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (userHasSubscription) {
      await this.prisma.subscription.update({
        where: {
          id: userHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    }
  }
}
