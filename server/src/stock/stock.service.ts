import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async getStocksGroupedByProduct() {
    return this.prisma.stock.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
    });
  }

  async getStockOptions(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        companyId,
        stock: {
          none: {},
        },
      },
      include: {
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        variants: product.variants.map((variant) => {
          return {
            id: variant.id,
            name: variant.name,
            options: variant.options.map((option) => {
              return {
                id: option.id,
                name: option.name,
              };
            }),
          };
        }),
      };
    });
  }
}
