import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { addStockFlag } from 'src/utils/addStockFlag';
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
        siteDetail: {
          include: {
            favicon: true,
          },
        },
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
      isExample: company.isExample,
      config: {
        ...company.siteDetail,
        favicon: company?.siteDetail?.favicon?.fileUrl,
      },
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
      include: {
        subscription: {
          where: {
            status: {
              in: ['ACTIVE', 'CANCELING'],
            },
          },
        },
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const companyHasSubscription = (company?.subscription?.length ?? 0) > 0;

    const highlightedProducts = await this.prisma.product.findMany({
      where: {
        companyId: company.id,
        isHighlighted: true,
        isVisible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        stock: companyHasSubscription,
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
        isVisible: true,
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
        stock: companyHasSubscription,
      },
      take: 8,
    });

    const withStock = companyHasSubscription
      ? addStockFlag(products)
      : products;
    const highlightedWithStock = companyHasSubscription
      ? addStockFlag(highlightedProducts)
      : highlightedProducts;

    return {
      products: withStock.map((x) => productToWeb(x, companyHasSubscription)),
      highlights: highlightedWithStock.map((x) =>
        productToWeb(x, companyHasSubscription),
      ),
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
    const company = await this.prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        subscription: {
          where: {
            status: {
              in: ['ACTIVE', 'CANCELING'],
            },
          },
        },
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const companyHasSubscription = (company?.subscription?.length ?? 0) > 0;

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
        categories: true,
        variants: {
          include: {
            options: true,
          },
        },
        ...(companyHasSubscription && {
          stock: {
            include: {
              productVariantOption: true,
              productVariantOption2: true,
            },
          },
        }),
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
      include: {
        subscription: {
          where: {
            status: {
              in: ['ACTIVE', 'CANCELING'],
            },
          },
        },
      },
    });

    if (!company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    const companyHasSubscription = (company?.subscription?.length ?? 0) > 0;

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
      isVisible: true,
      ...(!!search && {
        name: {
          search,
        },
      }),
      ...(categories && {
        categories: {
          some: {
            slug: {
              in: categories,
            },
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
        stock: companyHasSubscription,
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

    const withStockFlag = companyHasSubscription
      ? addStockFlag(products)
      : products;

    return {
      total,
      offset: PAGE_SIZE * page,
      limit: PAGE_SIZE,
      products: withStockFlag.map((x) =>
        productToWeb(x, companyHasSubscription),
      ),
    };
  }

  async getAllSlugs() {
    const slugs = await this.prisma.company.findMany({
      select: {
        slug: true,
      },
    });
    return slugs.map((x) => x.slug);
  }
}
