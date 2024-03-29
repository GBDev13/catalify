import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LIMITS } from 'src/config/limits';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    companyId: string,
    hasSubscription: boolean,
  ): Promise<Category> {
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
      const categoriesCount = await this.prisma.category.count({
        where: {
          companyId,
        },
      });
      if (categoriesCount >= LIMITS.FREE.MAX_CATEGORIES) {
        throw new HttpException(
          'Você atingiu o limite de categorias para sua conta gratuita',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const createdCategory = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        companyId,
      },
    });

    return createdCategory;
  }

  async getByCompanyId(companyId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        companyId,
      },
    });

    return categories;
  }

  async update(category: Category, companyId: string) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: category.id,
      },
    });

    if (!categoryExists) {
      throw new HttpException(
        'Esta categoria não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!categoryExists.isEditable) {
      throw new HttpException(
        'Esta categoria não pode ser editada',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (categoryExists.companyId !== companyId) {
      throw new HttpException(
        'Você não tem permissão para atualizar esta categoria',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
      },
    });
  }

  async delete(id: string, companyId: string) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryExists) {
      throw new HttpException(
        'Esta categoria não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (categoryExists.companyId !== companyId) {
      throw new HttpException(
        'Você não tem permissão para deletar esta categoria',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
