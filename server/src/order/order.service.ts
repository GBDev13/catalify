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
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
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
          select: {
            ownerId: true,
          },
        },
      },
    });

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
    order.products.forEach(async (product) => {
      product.selectedVariants.forEach(async (option) => {
        const optionStock = await this.prisma.stock.findFirst({
          where: {
            productVariantOptionId: option.id,
            productId: product.productId,
          },
        });

        await this.prisma.stock.update({
          where: {
            id: optionStock.id,
          },
          data: {
            quantity: optionStock.quantity - product.quantity,
          },
        });
      });
      // const productStock = await this.prisma.stock.findFirst({
      //   where: {
      //     productId: product.productId,
      //   },
      // });

      // await this.prisma.stock.update({
      //   where: {
      //     id: productStock.id,
      //   },
      //   data: {
      //     quantity: productStock.quantity - product.quantity,
      //   },
      // });
    });

    // await this.prisma.order.update({
    //   where: {
    //     id: orderId,
    //   },
    //   data: {
    //     status: OrderStatus.FINISHED,
    //   },
    // });
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
