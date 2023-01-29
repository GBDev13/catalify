import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LIMITS } from 'src/config/limits';
import { UpdateProductVariations } from 'src/product/dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

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
  ) {
    const variationsIdCountChecked = [];

    const createdVariations = [];
    const createdOptions = [];

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

    const hasStock = await this.prisma.stock.findFirst({
      where: {
        productId,
      },
    });

    if (hasStock) {
      if (createdVariations.length > 0) {
        const options = await this.prisma.productVariantOption.findMany({
          where: {
            productVariantId: {
              in: createdVariations.map((x) => x.id),
            },
          },
        });

        await this.prisma.stock.createMany({
          data: options.map((option) => ({
            companyId,
            productId,
            productVariantOptionId: option.id,
            quantity: 0,
          })),
        });
      }

      if (createdOptions.length > 0) {
        await this.prisma.stock.createMany({
          data: createdOptions.map((option) => ({
            companyId,
            productId,
            productVariantOptionId: option.id,
            quantity: 0,
          })),
        });
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

  async deleteVariations(parsedVariations: UpdateProductVariations) {
    for (const removed of parsedVariations.removed || []) {
      try {
        if (removed.type === 'variation') {
          await this.prisma.productVariant.delete({
            where: {
              id: removed.id,
            },
          });
        } else if (removed.type === 'option') {
          await this.prisma.productVariantOption.delete({
            where: {
              id: removed.id,
            },
          });
        }
      } catch (error) {
        throw new HttpException(
          'Erro ao remover variações',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
