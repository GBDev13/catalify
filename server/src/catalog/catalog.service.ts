import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { productDetailedToWeb, productToWeb } from './parser/product-to-web';

export type OrderOptions = 'recent' | 'lowerPrice' | 'higherPrice';

type CatalogProductFilters = {
  page: number;
  categories?: string[];
  order?: OrderOptions;
  search?: string;
};

const PAGE_SIZE = 9;

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
      phone: company.phone,
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

    const highlightedProducts = await this.prisma.product.findMany({
      where: {
        companyId: company.id,
        isHighlighted: true,
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

    const products = await this.prisma.product.findMany({
      where: {
        companyId: company.id,
        isHighlighted: false,
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
      take: 8,
    });

    return {
      products: products.map(productToWeb),
      highlights: highlightedProducts.map(productToWeb),
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
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return productDetailedToWeb(product);
  }

  async getCompanyCatalogFilteredProducts(
    companySlug: string,
    filters: CatalogProductFilters,
  ) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const { page, categories, order, search } = filters;

    const orderMap = {
      recent: {
        createdAt: 'desc',
      },
      lowerPrice: [
        {
          promoPrice: 'asc',
        },
        {
          price: 'asc',
        },
      ],
      higherPrice: [
        {
          promoPrice: 'desc',
        },
        {
          price: 'desc',
        },
      ],
    } as any;

    const whereQuery = {
      companyId: company.id,
      ...(!!search && {
        name: {
          search,
        },
      }),
      ...(categories && {
        category: {
          slug: {
            in: categories,
          },
        },
      }),
    };

    const total = await this.prisma.product.count({
      where: whereQuery,
    });

    const products = await this.prisma.product.findMany({
      where: whereQuery,
      orderBy: order ? orderMap[order] : undefined,
      include: {
        pictures: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return {
      total,
      offset: PAGE_SIZE * page,
      limit: PAGE_SIZE,
      products: products.map(productToWeb),
    };
  }
}
