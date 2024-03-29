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
import { ImportProductsDto } from './dto/import-products.dto';
import { IMAGE_LIMITS } from 'src/config/image';

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
    let productId: string;
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

      const {
        images,
        variations,
        categoriesIds: categoriesIdsDto,
        ...dto
      } = createProductDto;
      const categoriesIds = (
        Array.isArray(categoriesIdsDto) ? categoriesIdsDto : [categoriesIdsDto]
      ).filter(Boolean);

      const categoriesLength = categoriesIds?.length ?? 0;

      if (
        !hasSubscription &&
        categoriesLength > LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de categorias por produto para sua conta gratuita. (${LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (categoriesLength > LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT) {
        throw new HttpException(
          `Você atingiu o limite de categorias por produto. (${LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        !hasSubscription &&
        images.length > LIMITS.FREE.MAX_IMAGES_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de imagens por produto para sua conta gratuita. (${LIMITS.FREE.MAX_IMAGES_PER_PRODUCT} imagens por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (images.length > LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT) {
        throw new HttpException(
          `Você atingiu o limite de imagens por produto. (${LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT} imagens por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (variations) {
        const typedVariations = JSON.parse(
          variations,
        ) as unknown as VariationDto[];

        if (
          !hasSubscription &&
          typedVariations.length > LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT
        ) {
          throw new HttpException(
            `Você atingiu o limite de variações por produto para sua conta gratuita. (${LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT} variações por produto)`,
            HttpStatus.BAD_REQUEST,
          );
        } else if (
          typedVariations.length > LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT
        ) {
          throw new HttpException(
            `Você atingiu o limite de variações por produto. (${LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT} variações por produto)`,
            HttpStatus.BAD_REQUEST,
          );
        }

        typedVariations.forEach((variation) => {
          if (
            !hasSubscription &&
            variation.options.length > LIMITS.FREE.MAX_OPTIONS_PER_VARIATION
          ) {
            throw new HttpException(
              `Você atingiu o limite de opções por variação para sua conta gratuita. (${LIMITS.FREE.MAX_OPTIONS_PER_VARIATION} opções por variação)`,
              HttpStatus.BAD_REQUEST,
            );
          } else if (
            variation.options.length > LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION
          ) {
            throw new HttpException(
              `Você atingiu o limite de opções por variação. (${LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION} opções por variação)`,
              HttpStatus.BAD_REQUEST,
            );
          }
        });
      }

      const createdProduct = await this.prisma.product.create({
        data: {
          ...dto,
          categories: {
            connect: categoriesIds?.map((id) => ({ id })),
          },
          companyId,
        },
      });

      productId = createdProduct.id;

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
              fileSizeLimit: IMAGE_LIMITS.baseLimit,
            });
          }),
        );
      }

      return createdProduct;
    } catch (error) {
      if (productId) await this.delete(companyId, productId);

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getByCompanyId(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        companyId,
      },
      include: {
        categories: true,
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
    hasSubscription: boolean,
  ) {
    const productExists = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        pictures: true,
        variants: true,
        categories: true,
      },
    });

    if (!productExists) {
      throw new HttpException(
        'Este produto não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!productExists.isEditable) {
      throw new HttpException(
        'Este produto não pode ser editado',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (productExists.companyId !== companyId) {
      throw new HttpException(
        'Este produto não pertence a esta empresa',
        HttpStatus.BAD_REQUEST,
      );
    }

    const {
      variations,
      images,
      imagesToRemove,
      categoriesIds: categoriesIdsDto,
      ...updateDto
    } = updateProductDto;
    const categoriesIds = (
      Array.isArray(categoriesIdsDto) ? categoriesIdsDto : [categoriesIdsDto]
    ).filter(Boolean);

    const categoriesLength = categoriesIds?.length ?? 0;

    if (
      !hasSubscription &&
      categoriesLength > LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT
    ) {
      throw new HttpException(
        `Você atingiu o limite de categorias por produto para sua conta gratuita. (${LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (categoriesLength > LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT) {
      throw new HttpException(
        `Você atingiu o limite de categorias por produto. (${LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (imagesToRemove) {
      await this.storageService.deleteFilesByIds(
        typeof imagesToRemove === 'string' ? [imagesToRemove] : imagesToRemove,
      );
    }

    if (images) {
      const removeCount = imagesToRemove
        ? typeof imagesToRemove === 'string'
          ? 1
          : imagesToRemove.length
        : 0;
      const currentLength = productExists.pictures.length - removeCount;

      if (
        !hasSubscription &&
        currentLength + images.length > LIMITS.FREE.MAX_IMAGES_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de imagens por produto para sua conta gratuita. (${LIMITS.FREE.MAX_IMAGES_PER_PRODUCT} imagens por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (
        currentLength + images.length >
        LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de imagens por produto. (${LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT} imagens por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await Promise.all(
        images.map(async (image) => {
          return await this.storageService.uploadFile({
            dataBuffer: image.buffer,
            fileName: `${uuid()}.${image.mimetype.split('/')[1]}`,
            productId,
            path: 'products/',
            fileSizeLimit: IMAGE_LIMITS.baseLimit,
          });
        }),
      );
    }

    if (variations) {
      const parsedVariations = JSON.parse(
        variations,
      ) as unknown as UpdateProductVariations;

      const newVariationsCount =
        productExists.variants.length +
        parsedVariations.added.filter((x) => x.type === 'variation').length -
        parsedVariations.removed.filter((x) => x.type === 'variation').length;

      if (
        !hasSubscription &&
        newVariationsCount > LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de variações por produto para sua conta gratuita. (${LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT} variações por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (
        newVariationsCount > LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de variações por produto. (${LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT} variações por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      }

      parsedVariations.added.forEach((variation) => {
        if (variation.type === 'variation') {
          if (
            !hasSubscription &&
            variation.options.length > LIMITS.FREE.MAX_OPTIONS_PER_VARIATION
          ) {
            throw new HttpException(
              `Você atingiu o limite de opções por variação para sua conta gratuita. (${LIMITS.FREE.MAX_OPTIONS_PER_VARIATION} opções por variação)`,
              HttpStatus.BAD_REQUEST,
            );
          } else if (
            variation.options.length > LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION
          ) {
            throw new HttpException(
              `Você atingiu o limite de opções por variação. (${LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION} opções por variação)`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      });

      const hasStock = await this.prisma.stock.findMany({
        where: {
          productId,
        },
        include: {
          productVariantOption: {
            include: {
              productVariant: true,
            },
          },
          productVariantOption2: {
            include: {
              productVariant: true,
            },
          },
        },
      });

      await this.productVariantService.updateVariations(parsedVariations);
      await this.productVariantService.deleteVariations(parsedVariations);
      await this.productVariantService.addVariations(
        parsedVariations,
        companyId,
        productId,
        hasSubscription,
        hasStock,
      );
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateDto,
        categories: {
          disconnect: productExists.categories.map((category) => ({
            id: category.id,
          })),
          connect: categoriesIds?.map((id) => ({ id })),
        },
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
        categories: true,
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

  async toggleHighlight(
    companyId: string,
    productId: string,
    hasSubscription: boolean,
  ) {
    if (!hasSubscription) {
      throw new HttpException(
        'Você não possui uma assinatura premium para destacar produtos',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  async toggleIsVisible(companyId: string, productId: string) {
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
        isVisible: !product.isVisible,
      },
    });
  }

  async importProducts(
    importDto: ImportProductsDto,
    companyId: string,
    hasSubscription: boolean,
  ) {
    if (importDto.products.length >= 500) {
      throw new HttpException(
        'Não é possível importar mais de 500 produtos por vez',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check all categories length
    importDto.products.forEach((product) => {
      const categoriesLength = product.categoriesNames?.length ?? 0;

      if (
        !hasSubscription &&
        categoriesLength > LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT
      ) {
        throw new HttpException(
          `Você atingiu o limite de categorias por produto para sua conta gratuita. (${LIMITS.FREE.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (categoriesLength > LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT) {
        throw new HttpException(
          `Você atingiu o limite de categorias por produto. (${LIMITS.PREMIUM.MAX_CATEGORIES_PER_PRODUCT} categorias por produto)`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

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

    const products = await this.prisma.product.findMany({
      where: {
        companyId,
      },
    });

    if (
      !hasSubscription &&
      products.length + importDto.products.length > LIMITS.FREE.MAX_PRODUCTS
    ) {
      throw new HttpException(
        `Não é possível importar essa lista de produtos pois irá exceder o limite de produtos para sua conta gratuita. (${LIMITS.FREE.MAX_PRODUCTS} produtos)`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await Promise.all(
      importDto.products.map(async (product) => {
        const createdProduct = await this.prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            promoPrice: product.promoPrice,
            isVisible: product.visible,
            isHighlighted: product.highlight,
            companyId,
          },
        });

        if (product?.categoriesNames) {
          await Promise.all(
            product.categoriesNames.map(async (categoryName) => {
              let categoryId = null;

              const category = await this.prisma.category.findFirst({
                where: {
                  companyId,
                  name: categoryName,
                },
              });

              if (category) {
                categoryId = category.id;
              }

              if (!categoryId) {
                const createdCategory = await this.prisma.category.create({
                  data: {
                    name: categoryName,
                    companyId,
                  },
                });

                categoryId = createdCategory.id;
              }

              await this.prisma.product.update({
                where: {
                  id: createdProduct.id,
                },
                data: {
                  categories: {
                    connect: {
                      id: categoryId,
                    },
                  },
                },
              });
            }),
          );
        }
      }),
    );
  }

  async getProductsVariantsToCopy(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new HttpException(
        'Esta empresa não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const products = await this.prisma.product.findMany({
      where: {
        companyId,
        variants: {
          some: {
            options: {
              some: {
                id: {
                  not: undefined,
                },
              },
            },
          },
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

    return products.map((product) => ({
      productName: product.name,
      variants: product.variants.map((variant) => ({
        name: variant.name,
        options: variant.options.map((option) => option.name),
      })),
    }));
  }
}
