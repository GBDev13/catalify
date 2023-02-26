import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order-dto';
import ShortUniqueId from 'short-unique-id';
import { orderProductToWeb } from './parser/order-product-to-web';
import { OrderStatus } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(companySlug: string, createOrderDto: CreateOrderDto) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        subscription: {
          where: {
            status: {
              in: ['ACTIVE', 'CANCELING'],
            },
          },
        },
      },
    });

    const companyHasSubscription = (company?.subscription?.length ?? 0) > 0;

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const stockError = [];

    if (companyHasSubscription) {
      for (const product of createOrderDto.products) {
        if (product.selectedVariants.length <= 0) {
          const productStock = await this.prisma.stock.findFirst({
            where: {
              productId: product.productId,
            },
          });

          if (productStock && productStock.quantity < product.quantity) {
            stockError.push(product.productId);
          }
        } else {
          const productStock = await this.prisma.stock.findFirst({
            where: {
              productId: product.productId,
              OR: [
                {
                  productVariantOptionId: product.selectedVariants?.[0] ?? null,
                  productVariantOptionId2:
                    product.selectedVariants?.[1] ?? null,
                },
                {
                  productVariantOptionId: product.selectedVariants?.[1] ?? null,
                  productVariantOptionId2:
                    product.selectedVariants?.[0] ?? null,
                },
              ],
            },
          });

          if (productStock.quantity < product.quantity) {
            stockError.push(product.productId);
          }
        }
      }
    }

    if (stockError.length > 0) {
      throw new HttpException(
        { invalidQuantity: stockError },
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentDate = new Date();
    const expiresAt = new Date(currentDate);
    expiresAt.setDate(currentDate.getDate() + 3);

    const uid = new ShortUniqueId({ length: 10 });

    const order = await this.prisma.order.create({
      data: {
        id: uid(),
        buyerName: createOrderDto.buyerName,
        buyerPhone: createOrderDto.buyerPhone,
        companyId: company.id,
        products: {
          create: createOrderDto.products.map((product) => ({
            name: product.name,
            price: product.price,
            promoPrice: product.promoPrice,
            quantity: product.quantity,
            product: {
              connect: {
                id: product.productId,
              },
            },
            selectedVariants: {
              connect: product.selectedVariants.map((optId) => ({ id: optId })),
            },
          })),
        },
        expiresAt,
      },
    });

    return order.id;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        products: {
          include: {
            selectedVariants: true,
            product: {
              include: {
                pictures: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    return {
      ...order,
      products: order.products.map((product) => orderProductToWeb(product)),
    };
  }

  async expireOrders() {
    await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.PENDING,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        status: OrderStatus.EXPIRED,
      },
    });
  }

  async completeOrder(orderId: string, user: User) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        products: {
          include: {
            selectedVariants: true,
          },
        },
        company: {
          include: {
            subscription: {
              where: {
                status: {
                  in: ['ACTIVE', 'CANCELING'],
                },
              },
            },
          },
        },
      },
    });

    const companyHasSubscription =
      (order?.company?.subscription?.length ?? 0) > 0;

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new HttpException(
        'Pedido já foi finalizado',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order.company.ownerId !== user.id) {
      throw new HttpException(
        'Você não tem permissão para finalizar este pedido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (companyHasSubscription) {
      order.products.forEach(async (product) => {
        if (product.selectedVariants.length > 0) {
          const ids = product.selectedVariants.map((x) => x.id);

          const stock = await this.prisma.stock.findFirst({
            where: {
              productId: product.productId,
              OR: [
                {
                  productVariantOptionId: ids?.[0] ?? null,
                  productVariantOptionId2: ids?.[1] ?? null,
                },
                {
                  productVariantOptionId2: ids?.[0] ?? null,
                  productVariantOptionId: ids?.[1] ?? null,
                },
              ],
            },
          });

          if (stock) {
            await this.prisma.stock.update({
              where: {
                id: stock.id,
              },
              data: {
                quantity: stock.quantity - product.quantity,
              },
            });
          }
        }

        if (product.selectedVariants.length <= 0) {
          const productStock = await this.prisma.stock.findFirst({
            where: {
              productId: product.productId,
            },
          });
          if (productStock) {
            await this.prisma.stock.update({
              where: {
                id: productStock.id,
              },
              data: {
                quantity: productStock.quantity - product.quantity,
              },
            });
          }
        }
      });
    }

    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.FINISHED,
      },
    });
  }

  async getAllOrders(companyId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: {
          select: {
            price: true,
            promoPrice: true,
            quantity: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
    }));
  }
}
