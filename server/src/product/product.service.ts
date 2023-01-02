import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    companyId: string,
  ): Promise<Product> {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!companyExists) {
      throw new HttpException(
        'Esta empresa não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        companyId,
      },
    });

    return createdProduct;
  }

  async getByCompanyId(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        companyId,
      },
      include: {
        category: true,
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    return products;
  }

  async update(
    updateProductDto: UpdateProductDto,
    companyId: string,
    productId: string,
  ) {
    const productExists = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productExists) {
      throw new HttpException(
        'Este produto não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (productExists.companyId !== companyId) {
      throw new HttpException(
        'Este produto não pertence a esta empresa',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: updateProductDto,
    });

    return updatedProduct;
  }
}
