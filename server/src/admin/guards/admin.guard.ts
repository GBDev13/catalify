import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = request?.user;

    if (!user) return false;

    const dbUser = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) return false;

    return dbUser.isSuperAdmin;
  }
}
