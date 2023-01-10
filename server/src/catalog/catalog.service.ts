import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { productDetailedToWeb, productToWeb } from './parser/product-to-web';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
  ) {}

  async getCompanyCatalog(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        logo: true,
        links: true,
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
      links: company.links.map((link) => link.url),
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

    return {
      products: products.filter((x) => !x?.isHighlighted).map(productToWeb),
      highlights: products.filter((x) => x?.isHighlighted).map(productToWeb),
    };
  }

  async getCompanyCatalogBanners(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    return await this.companyService.getBanners(company.id);
  }

  async getCompanyCatalogProductBySlug(
    companySlug: string,
    productSlug: string,
  ) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug: productSlug,
        company: {
          slug: companySlug,
        },
      },
      include: {
        pictures: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        category: true,
      },
    });

    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return productDetailedToWeb(product);
  }
}
