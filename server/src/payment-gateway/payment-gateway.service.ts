/// <reference types="stripe-event-types" />

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import { SubscriptionService } from 'src/subscription/subscription.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentGatewayService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async getSubscriptionProduct() {
    const product = await this.stripe.products.retrieve(
      process.env.SUBSCRIPTION_PRODUCT_ID,
    );
    return product;
  }

  async createSubscriptionCheckout(customerEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: customerEmail,
      },
      include: {
        company: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (user?.company?.subscription.some((x) => x.status === 'ACTIVE')) {
      throw new HttpException('Você já possui uma inscrição ativa', 400);
    }

    const subscription = await this.getSubscriptionProduct();

    const successUrl = `${process.env.FRONT_END_URL}/success`;
    const cancelUrl = `${process.env.FRONT_END_URL}/cancel-order`;

    const customerId = await this.createCustomer(customerEmail);

    await this.prisma.company.update({
      where: {
        id: user.company.id,
      },
      data: {
        customerId,
      },
    });

    const checkoutSession = await this.stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'subscription',
      currency: 'brl',
      customer: customerId,
      locale: 'pt-BR',
      allow_promotion_codes: true,
      line_items: [
        {
          price: String(subscription.default_price),
          quantity: 1,
        },
      ],
    });

    return checkoutSession.url;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.DiscriminatedEvent;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SIGNATURE,
      ) as Stripe.DiscriminatedEvent;
    } catch {
      throw new HttpException('Invalid signature', 400);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        await this.subscriptionService.createSubscription(
          String(paymentIntent.customer),
        );
        break;
      case 'customer.subscription.deleted':
        console.log('customer.subscription.deleted');
        const subscriptionData = event.data.object;
        await this.subscriptionService.cancelSubscription(
          String(subscriptionData.customer),
        );
        break;
      case 'customer.subscription.updated':
        console.log('customer.subscription.updated');
        const updatedSubscription = event.data.object;
        const { status, customer } = updatedSubscription;

        if (status === 'canceled') {
          console.log('cancelou');
          await this.subscriptionService.cancelSubscription(String(customer));
        } else if (status === 'active') {
          const isExpired =
            new Date(updatedSubscription.current_period_end * 1000) <
            new Date();

          if (isExpired) {
            console.log('expirou');
            await this.subscriptionService.expireSubscription(String(customer));
          } else if (updatedSubscription.cancel_at_period_end) {
            console.log('cancelou 2');
            await this.subscriptionService.cancelSubscription(
              String(customer),
              updatedSubscription.cancel_at,
            );
          } else {
            console.log('atualizou');
            const company = await this.prisma.company.findFirst({
              where: {
                customerId: String(updatedSubscription.customer),
              },
            });
            if (company) {
              await this.subscriptionService.enableDisabledPremiumBenefits(
                company.id,
              );
            }
          }
        }
        break;
      default:
        break;
    }
  }

  async createCustomer(userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        company: true,
      },
    });

    if (user?.company?.customerId) return user.company.customerId;

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: [user.firstName, user?.lastName].join(' '),
      metadata: {
        userId: user.id,
      },
    });

    await this.prisma.company.update({
      where: {
        id: user.company.id,
      },
      data: {
        customerId: customer.id,
      },
    });

    return customer.id;
  }
}
