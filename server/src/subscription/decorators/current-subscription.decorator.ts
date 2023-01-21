import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Subscription } from '@prisma/client';

export const CurrentSubscriptionIsValid = createParamDecorator(
  (data: unknown, context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();

    const subscription = request?.subscription as Subscription;

    if (!subscription) return false;

    return ['ACTIVE', 'CANCELING'].includes(subscription.status);
  },
);
