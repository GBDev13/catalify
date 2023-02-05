import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductVariant, ProductVariantOption, Stock } from '@prisma/client';
import { LIMITS } from 'src/config/limits';
import { UpdateProductVariations } from 'src/product/dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

type HasStock = Stock & {
  productVariantOption: ProductVariantOption & {
    productVariant: ProductVariant;
  };
  productVariantOption2: ProductVariantOption & {
    productVariant: ProductVariant;
  };
};

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductVariantDto: CreateProductVariantDto) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: createProductVariantDto.companyId,
      },
    });

    if (!companyExists) {
      throw new HttpException(
        'Esta empresa não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { options, ...createDto } = createProductVariantDto;

    const createdProductVariant = await this.prisma.productVariant.create({
      data: {
        ...createDto,
        options: {
          createMany: {
            data: options.map((option) => ({
              name: option,
              companyId: createDto.companyId,
            })),
          },
        },
      },
    });

    return createdProductVariant;
  }

  async addVariations(
    parsedVariations: UpdateProductVariations,
    companyId: string,
    productId: string,
    hasSubscription: boolean,
    hasStock: HasStock[],
  ) {
    const variationsIdCountChecked = [];

    const createdVariations = [];
    const createdOptions = [];

    const variantsCount = await this.prisma.productVariant.count({
      where: {
        productId,
      },
    });

    for (const added of parsedVariations.added || []) {
      const variationIsChecked = variationsIdCountChecked.includes(
        added.variationId,
      );

      const isNewVariation = !added?.variationId;

      if (!variationIsChecked) {
        const count = !isNewVariation
          ? await this.prisma.productVariantOption.count({
              where: {
                productVariantId: added.variationId,
              },
            })
          : 0;

        const newOptionsCount = !isNewVariation
          ? parsedVariations.added.filter(
              (x) => x.type === 'option' && x.variationId === added.variationId,
            ).length
          : added?.options?.length;

        const removedOptionsCount = parsedVariations.removed.filter(
          (x) =>
            x.type === 'option' &&
            x.actionType === 'remove' &&
            x.variationId === added.variationId,
        ).length;

        const newCount = count - removedOptionsCount + newOptionsCount;

        if (
          !hasSubscription &&
          newCount > LIMITS.FREE.MAX_OPTIONS_PER_VARIATION
        ) {
          throw new HttpException(
            `Você atingiu o limite de ${LIMITS.FREE.MAX_OPTIONS_PER_VARIATION} opções por variação para sua conta gratuita.`,
            HttpStatus.BAD_REQUEST,
          );
        } else if (newCount > LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION) {
          console.log('caiu 2');
          throw new HttpException(
            `Você atingiu o limite de ${LIMITS.PREMIUM.MAX_OPTIONS_PER_VARIATION} opções por variação para sua conta.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        variationsIdCountChecked.push(added.variationId);
      }

      if (added.type === 'variation') {
        const created = await this.prisma.productVariant.create({
          data: {
            name: added.name,
            companyId,
            productId,
            options: {
              createMany: {
                data: added.options.map((option) => ({
                  name: option,
                  companyId,
                })),
              },
            },
          },
        });
        createdVariations.push(created);
      } else if (added.type === 'option') {
        const created = await this.prisma.productVariantOption.create({
          data: {
            name: added.value,
            companyId,
            productVariantId: added.variationId,
          },
        });
        createdOptions.push(created);
      }
    }

    if (!hasSubscription) return;

    if (hasStock?.length > 0) {
      if (createdVariations.length > 0) {
        await this.prisma.stock.deleteMany({
          where: {
            productId,
          },
        });

        const options = await this.prisma.productVariantOption.findMany({
          where: {
            productVariantId: {
              in: createdVariations.map((x) => x.id),
            },
          },
        });

        const productVariantsOptions =
          await this.prisma.productVariantOption.findMany({
            where: {
              id: {
                notIn: options.map((x) => x.id),
              },
              productVariant: {
                productId,
              },
            },
          });

        if (productVariantsOptions.length > 0) {
          const createDto = options.flatMap((optionOne) => {
            return productVariantsOptions.map((optionTwo) => {
              return {
                companyId,
                productId,
                productVariantOptionId: optionOne.id,
                productVariantOptionId2: optionTwo.id,
                quantity:
                  hasStock.find(
                    (x) => x.productVariantOptionId === optionTwo.id,
                  )?.quantity || 0,
              };
            });
          });

          await this.prisma.stock.createMany({
            data: createDto as any,
          });
        } else {
          const optionsGroupedByVariantId = options.reduce((acc, option) => {
            const variantId = option.productVariantId;
            if (!acc[variantId]) {
              acc[variantId] = [];
            }
            acc[variantId].push(option);
            return acc;
          }, {} as Record<string, ProductVariantOption[]>);

          const keys = Object.keys(optionsGroupedByVariantId);

          const createDto = optionsGroupedByVariantId[keys[0]].flatMap(
            (optionOne) => {
              return optionsGroupedByVariantId[keys[1]].map((optionTwo) => {
                return {
                  companyId,
                  productId,
                  productVariantOptionId: optionOne.id,
                  productVariantOptionId2: optionTwo.id,
                  quantity: 0,
                };
              });
            },
          );

          await this.prisma.stock.createMany({
            data: createDto as any,
          });
        }
      }

      if (createdOptions.length > 0) {
        if (variantsCount < 2) {
          await this.prisma.stock.createMany({
            data: createdOptions.map((x) => ({
              companyId,
              productId,
              productVariantOptionId: x.id,
              quantity: 0,
            })),
          });
          return;
        }

        const productVariations = await this.prisma.productVariant.findMany({
          where: {
            productId,
            id: {
              notIn: createdOptions.map((x) => x.productVariantId),
            },
          },
          include: {
            options: true,
          },
        });

        productVariations.forEach((variation) => {
          variation.options.forEach(async (option) => {
            const stock = hasStock.find(
              (x) =>
                x.productVariantOptionId === option.id ||
                x.productVariantOptionId2 === option.id,
            );

            await Promise.all(
              createdOptions.map(async (createdOption) => {
                const isOptionOne =
                  createdOption.productVariantId ===
                  stock.productVariantOption.productVariantId;

                await this.prisma.stock.create({
                  data: {
                    companyId,
                    productId,
                    quantity: 0,
                    ...(!isOptionOne
                      ? {
                          productVariantOptionId2: createdOption.id,
                          productVariantOptionId: option.id,
                        }
                      : {
                          productVariantOptionId: createdOption.id,
                          productVariantOptionId2: option.id,
                        }),
                  },
                });
              }),
            );
          });
        });

        // const createDto = createdOptions.flatMap((optionOne) => {
        //   return productStock.map((stock) => {
        //     const optionTwo = stock.productVariantOption
        //       ? stock.productVariantOption
        //       : stock.productVariantOption2;

        //     if (optionTwo?.productVariantId === optionOne.productVariantId)
        //       return;

        //     return {
        //       companyId,
        //       productId,
        //       productVariantOptionId2: optionOne.id,
        //       productVariantOptionId: optionTwo.id,
        //       quantity: stock.quantity,
        //     };
        //   });
        // });

        // await this.prisma.stock.createMany({
        //   data: createDto as any,
        // });
        // await this.prisma.stock.createMany({
        //   data: createdOptions.map((option) => ({
        //     companyId,
        //     productId,
        //     productVariantOptionId: option.id,
        //     quantity: 0,
        //   })),
        // });
      }
    }
  }

  async updateVariations(parsedVariations: UpdateProductVariations) {
    for (const updated of parsedVariations.edited || []) {
      try {
        if (updated.type === 'variation') {
          await this.prisma.productVariant.update({
            where: {
              id: updated.id,
            },
            data: {
              name: updated.newValue,
            },
          });
        } else if (updated.type === 'option') {
          await this.prisma.productVariantOption.update({
            where: {
              id: updated.id,
            },
            data: {
              name: updated.newValue,
            },
          });
        }
      } catch (error) {
        throw new HttpException(
          'Erro ao editar variações',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async updateVariationsStock(removedId: string) {
    const currentStock1 = await this.prisma.stock.findMany({
      where: {
        productVariantOption: {
          productVariantId: removedId,
        },
      },
    });

    const newStock1 = currentStock1.reduce((acc, stock) => {
      const optionId = stock.productVariantOptionId2;
      if (!acc.find((x) => x.productVariantOptionId === optionId)) {
        acc.push({
          ...stock,
          productVariantOptionId: optionId,
          productVariantOptionId2: null,
        });
      }
      return acc;
    }, []);

    await this.prisma.stock.deleteMany({
      where: {
        id: {
          in: currentStock1.map((x) => x.id),
        },
      },
    });

    await this.prisma.stock.createMany({
      data: newStock1 as any,
    });

    // section 2

    const currentStock2 = await this.prisma.stock.findMany({
      where: {
        productVariantOption2: {
          productVariantId: removedId,
        },
      },
    });

    const newStock2 = currentStock2.reduce((acc, stock) => {
      const optionId = stock.productVariantOptionId;
      if (!acc.find((x) => x.productVariantOptionId2 === optionId)) {
        acc.push({
          ...stock,
          productVariantOptionId2: optionId,
          productVariantOptionId: null,
        });
      }
      return acc;
    }, []);

    await this.prisma.stock.deleteMany({
      where: {
        id: {
          in: currentStock2.map((x) => x.id),
        },
      },
    });

    await this.prisma.stock.createMany({
      data: newStock2 as any,
    });
  }

  async deleteVariations(parsedVariations: UpdateProductVariations) {
    for (const removed of parsedVariations.removed || []) {
      try {
        if (removed.type === 'variation') {
          await this.updateVariationsStock(removed.id);

          await this.prisma.productVariant.delete({
            where: {
              id: removed.id,
            },
          });
        } else if (removed.type === 'option') {
          await this.prisma.stock.deleteMany({
            where: {
              OR: [
                {
                  productVariantOptionId: removed.id,
                },
                {
                  productVariantOptionId2: removed.id,
                },
              ],
            },
          });

          await this.prisma.productVariantOption.delete({
            where: {
              id: removed.id,
            },
          });
        }
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'Erro ao remover variações',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
