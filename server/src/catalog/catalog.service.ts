import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyCatalog(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        logo: true,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      themeColor: company.themeColor,
      name: company.name,
      logo: company?.logo ? company.logo.fileUrl : undefined,
      slug: company.slug,
    };
  }

  async getCompanyCatalogCategories(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        categories: true,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    return company.categories.map((category) => ({
      slug: category.slug,
      name: category.name,
    }));
  }

  async getCompanyCatalogProducts(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const products = await this.prisma.product.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        pictures: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      promoPrice: product?.promoPrice,
      picture: product?.pictures?.length
        ? product.pictures[0]?.fileUrl
        : undefined,
    }));
  }
}
