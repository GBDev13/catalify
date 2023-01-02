import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
}
