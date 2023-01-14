import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order-dto';
import ShortUniqueId from 'short-unique-id';
import { orderProductToWeb } from './parser/order-product-to-web';

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
}
