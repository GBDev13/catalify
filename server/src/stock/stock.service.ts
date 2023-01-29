import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreateProductStockDto } from './dto/create-product-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async getStocksGroupedByProduct(companyId: string) {
    const productsStock = await this.prisma.stock.findMany({
      where: {
        companyId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return productsStock.reduce((acc, stock) => {
      const product = acc.find((x) => x.id === stock.product.id);
      if (product) {
        product.total += stock.quantity;
      } else {
        acc.push({
          id: stock.product.id,
          productName: stock.product.name,
          total: stock.quantity,
          hasVariants: !!stock?.productVariantOptionId,
        });
      }
      return acc;
    }, []);
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
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            options: {
              orderBy: {
                createdAt: 'asc',
              },
            },
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

  async createProductStock(
    companyId: string,
    productId: string,
    currentUser: User,
    createProductStockDto: CreateProductStockDto,
  ) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (company.ownerId !== currentUser.id) {
      throw new HttpException(
        'Você não tem permissão para adicionar estoque',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hasVariants = createProductStockDto.stockQuantity.every(
      (x) => !!x?.stockOptionId,
    );

    if (hasVariants) {
      await this.prisma.stock.createMany({
        data: createProductStockDto.stockQuantity.map((stockQuantity) => {
          return {
            productId,
            companyId,
            quantity: stockQuantity.quantity,
            productVariantOptionId: stockQuantity.stockOptionId,
          };
        }),
      });
      return;
    }

    const productStock = createProductStockDto.stockQuantity[0];
    await this.prisma.stock.create({
      data: {
        productId,
        companyId,
        quantity: productStock.quantity,
      },
    });
  }

  async deleteProductStock(
    companyId: string,
    productId: string,
    currentUser: User,
  ) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (company.ownerId !== currentUser.id) {
      throw new HttpException(
        'Você não tem permissão para adicionar estoque',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.stock.deleteMany({
      where: {
        productId,
      },
    });
  }

  async getProductStock(productId: string) {
    return await this.prisma.stock.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        productVariantOption: {
          include: {
            productVariant: true,
          },
        },
      },
    });
  }

  async updateProductStock(
    companyId: string,
    productId: string,
    currentUser: User,
    updateProductStockDto: UpdateProductStockDto,
  ) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (company.ownerId !== currentUser.id) {
      throw new HttpException(
        'Você não tem permissão para adicionar estoque',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await Promise.all(
      updateProductStockDto.stockQuantity.map(async (stockQuantity) => {
        await this.prisma.stock.update({
          where: {
            id: stockQuantity.productStockId,
          },
          data: {
            quantity: stockQuantity.quantity,
          },
        });
      }),
    );
    return;
  }
}
