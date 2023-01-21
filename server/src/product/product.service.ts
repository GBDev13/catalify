import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductVariantService } from 'src/product-variant/product-variant.service';
import { StorageService } from 'src/storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, VariationDto } from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductVariations,
} from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuid } from 'uuid';
import { LIMITS } from 'src/config/limits';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async create(
    createProductDto: CreateProductDto & { images: Express.Multer.File[] },
    companyId: string,
    hasSubscription: boolean,
  ): Promise<Product> {
    try {
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

      if (!hasSubscription) {
        const productsCount = await this.prisma.product.count({
          where: {
            companyId,
          },
        });

        if (productsCount >= LIMITS.FREE.MAX_PRODUCTS) {
          throw new HttpException(
            'Você atingiu o limite de produtos para sua conta gratuita',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const { images, variations, ...dto } = createProductDto;

      const createdProduct = await this.prisma.product.create({
        data: {
          ...dto,
          companyId,
        },
      });

      if (variations) {
        const typedVariations = JSON.parse(
          variations,
        ) as unknown as VariationDto[];

        await Promise.all(
          typedVariations.map(async (variation) => {
            const createdVariation = await this.prisma.productVariant.create({
              data: {
                name: variation.name,
                productId: createdProduct.id,
                companyId,
              },
            });
            await this.prisma.productVariantOption.createMany({
              data: variation.options.map((option) => ({
                companyId,
                name: option,
                productVariantId: createdVariation.id,
              })),
            });
          }),
        );
      }

      if (images) {
        await Promise.all(
          images.map(async (image) => {
            return this.storageService.uploadFile({
              dataBuffer: image.buffer,
              fileName: `${uuid()}.${image.mimetype.split('/')[1]}`,
              productId: createdProduct.id,
              path: 'products/',
            });
          }),
        );
      }

      return createdProduct;
    } catch (error) {
      console.log('error during product creation', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
    updateProductDto: UpdateProductDto & { images: Express.Multer.File[] },
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

    const { variations, images, imagesToRemove, ...updateDto } =
      updateProductDto;

    if (imagesToRemove) {
      await this.storageService.deleteFilesByIds(
        typeof imagesToRemove === 'string' ? [imagesToRemove] : imagesToRemove,
      );
    }

    if (images) {
      await Promise.all(
        images.map(async (image) => {
          return await this.storageService.uploadFile({
            dataBuffer: image.buffer,
            fileName: `${uuid()}.${image.mimetype.split('/')[1]}`,
            productId,
            path: 'products/',
          });
        }),
      );
    }

    if (variations) {
      const parsedVariations = JSON.parse(
        variations,
      ) as unknown as UpdateProductVariations;
      await this.productVariantService.addVariations(
        parsedVariations,
        companyId,
        productId,
      );
      await this.productVariantService.updateVariations(parsedVariations);
      await this.productVariantService.deleteVariations(parsedVariations);
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateDto,
        categoryId: updateDto?.categoryId || null,
        promoPrice: updateDto?.promoPrice || null,
      },
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
          return await this.storageService.deleteFile(picture.key);
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

  async getById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
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
        pictures: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return product;
  }

  async toggleHighlight(companyId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new HttpException(
        'Este produto não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (product.companyId !== companyId) {
      throw new HttpException(
        'Este produto não pertence a esta empresa',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isHighlighted: !product.isHighlighted,
      },
    });
  }
}
