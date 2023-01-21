import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = request?.user;

    if (!user) return true;

    const company = await this.prismaService.company.findFirst({
      where: {
        ownerId: user.id,
      },
    });

    if (!company) return true;

    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    request.subscription = subscription;

    return true;
  }
}
