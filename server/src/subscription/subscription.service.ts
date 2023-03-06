import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { LIMITS } from 'src/config/limits';
import { LinksPageService } from 'src/links-page/links-page.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly linksPageService: LinksPageService,
    private readonly storageService: StorageService,
  ) {}

  async createSubscription(customerId: string) {
    console.log('sucesso subscription');
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    if (!company) {
      throw new HttpException(
        'Ocorreu um erro ao buscar sua empresa',
        HttpStatus.BAD_REQUEST,
      );
    }

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });
    console.log('companyHasSubscription', companyHasSubscription);

    if (companyHasSubscription) {
      return await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.ACTIVE,
        },
      });
    }

    await this.prisma.subscription.create({
      data: {
        companyId: company.id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    console.log('criei a subscription');

    await this.enableDisabledPremiumBenefits(company.id);

    await this.linksPageService.create(company.id, {
      bgColor: company.themeColor,
      bgColor2: company.themeColor,
      textColor: '#000',
      textColor2: '#000',
      title: company.name,
      bgMode: 'solid',
      boxColor: '#fff',
      boxMode: 'solid',
      logoMode: 'free',
    });
  }

  async cancelSubscription(customerId: string, cancelAt?: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    if (companyHasSubscription) {
      if (cancelAt) {
        await this.prisma.subscription.update({
          where: {
            id: companyHasSubscription.id,
          },
          data: {
            status: SubscriptionStatus.CANCELING,
            expiresAt: new Date(cancelAt * 1000),
          },
        });

        return;
      }

      await this.disablePremiumBenefits(company.id);

      await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.CANCELED,
        },
      });
    }
  }

  async disablePremiumBenefits(companyId: string) {
    // unlimited products -> 10 products
    // disable older products edition
    const productsCount = await this.prisma.product.count({
      where: {
        companyId,
      },
    });

    if (productsCount > LIMITS.FREE.MAX_PRODUCTS) {
      const products = await this.prisma.product.findMany({
        where: {
          companyId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: productsCount - LIMITS.FREE.MAX_PRODUCTS,
      });

      await this.prisma.product.updateMany({
        where: {
          id: {
            in: products.map((product) => product.id),
          },
        },
        data: {
          isEditable: false,
        },
      });
    }

    // unlimited categories -> 5 categories
    // disable older categories edition
    const categoriesCount = await this.prisma.category.count({
      where: {
        companyId,
      },
    });

    if (categoriesCount > LIMITS.FREE.MAX_CATEGORIES) {
      const categories = await this.prisma.category.findMany({
        where: {
          companyId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: categoriesCount - LIMITS.FREE.MAX_CATEGORIES,
      });

      await this.prisma.category.updateMany({
        where: {
          id: {
            in: categories.map((category) => category.id),
          },
        },
        data: {
          isEditable: false,
        },
      });
    }

    // 5 images per product -> 2 images per product
    // will continue to work with 5 images per product

    // 2 variation per product -> 1 variation per product
    // will continue to work with 2 variations per product

    // 10 contact links -> 2 contact links
    // delete older links
    const linksCount = await this.prisma.companyLinks.count({
      where: {
        companyId,
      },
    });
    if (linksCount > LIMITS.FREE.MAX_CONTACT_LINKS) {
      const links = await this.prisma.companyLinks.findMany({
        where: {
          companyId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: linksCount - LIMITS.FREE.MAX_CONTACT_LINKS,
      });

      await this.prisma.companyLinks.deleteMany({
        where: {
          id: {
            in: links.map((link) => link.id),
          },
        },
      });
    }

    // stock management -> disabled
    // stock will be ignored if has no active subscription

    // highlight products -> disabled
    await this.prisma.product.updateMany({
      where: {
        companyId,
        isHighlighted: true,
      },
      data: {
        isHighlighted: false,
      },
    });

    // links page -> disabled
    // links page will be disabled if has no active subscription

    // home banners -> disabled
    const homeBanners = await this.prisma.companyBanners.findMany({
      where: {
        companyId,
      },
    });
    if (homeBanners.length > 0) {
      await this.storageService.deleteFilesByIds(
        homeBanners.map((banner) => banner.pictureId),
      );
    }
  }

  async enableDisabledPremiumBenefits(companyId: string) {
    await this.prisma.product.updateMany({
      where: {
        companyId,
        isEditable: false,
      },
      data: {
        isEditable: true,
      },
    });

    await this.prisma.category.updateMany({
      where: {
        companyId,
        isEditable: false,
      },
      data: {
        isEditable: true,
      },
    });
  }

  async expireSubscription(customerId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        customerId,
      },
    });

    const companyHasSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId: company.id,
      },
    });

    if (companyHasSubscription) {
      await this.prisma.subscription.update({
        where: {
          id: companyHasSubscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    }
  }

  async getSubscriptionByCompanySlug(companySlug: string) {
    if (!companySlug) {
      throw new HttpException(
        'Ocorreu um erro ao buscar seu plano atual',
        HttpStatus.BAD_REQUEST,
      );
    }

    const company = await this.prisma.company.findFirst({
      where: {
        slug: companySlug,
      },
      include: {
        subscription: true,
      },
    });
    return company?.subscription ?? [];
  }
}
