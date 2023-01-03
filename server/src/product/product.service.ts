import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto & { images: Express.Multer.File[] },
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

    const { images, ...dto } = createProductDto;

    const createdProduct = await this.prisma.product.create({
      data: {
        ...dto,
        companyId,
      },
    });

    if (images) {
      await Promise.all(
        images.map(async (image) => {
          return await this.fileService.uploadFile(
            image.buffer,
            image.originalname,
            createdProduct.id,
          );
        }),
      );
    }

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

  async delete(companyId: string, productId: string) {
    const productExists = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        pictures: true,
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

    if (productExists.pictures.length > 0) {
      await Promise.all(
        productExists.pictures.map(async (picture) => {
          return await this.fileService.deleteFile(picture.key);
        }),
      );
    }

    const deletedProduct = await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return deletedProduct;
  }
}
