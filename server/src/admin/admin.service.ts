import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCompanies() {
    const companies = await this.prismaService.company.findMany({
      where: {
        isExample: false,
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        subscription: true,
        _count: {
          select: {
            products: true,
            categories: true,
            order: true,
          },
        },
      },
    });

    return companies.map((company) => ({
      id: company.id,
      slug: company.slug,
      name: company.name,
      createdAt: company.createdAt,
      owner: company.users[0],
      subscription: company.subscription,
      quantities: {
        products: company._count.products,
        categories: company._count.categories,
        orders: company._count.order,
      },
    }));
  }

  async getFiles() {
    const files = await this.prismaService.file.findMany({
      where: {
        company: {
          none: {
            isExample: true,
          },
        },
      },
    });
    return files;
  }
}
