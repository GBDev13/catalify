import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { getMimeType } from 'src/utils/getMimeType';
import { CreateLinksPageDto } from './dto/create-links-page.dto';
import { UpdateLinksPageDto } from './dto/update-links-page.dto';
import { v4 as uuid } from 'uuid';
import { UpdateLinksDto } from './dto/update-links.dto';
import { LIMITS } from 'src/config/limits';
import { IMAGE_LIMITS } from 'src/config/image';
@Injectable()
export class LinksPageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(companyId: string, createLinksPageDto: CreateLinksPageDto) {
    const company = await this.prismaService.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        linksPage: true,
      },
    });

    if (!company) {
      throw new HttpException(
        'Esta empresa não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (company.linksPage.length > 0) return company.linksPage;

    const createdLinksPage = await this.prismaService.companyLinksPage.create({
      data: {
        ...createLinksPageDto,
        company: {
          connect: {
            id: companyId,
          },
        },
        logo: company?.logoId
          ? {
              connect: {
                id: company.logoId,
              },
            }
          : undefined,
      },
    });

    return createdLinksPage;
  }

  async getByCompanyId(companyId: string) {
    const linksPage = await this.prismaService.companyLinksPage.findFirst({
      where: {
        companyId,
      },
      include: {
        logo: true,
      },
    });

    if (!linksPage) {
      throw new HttpException(
        'Esta empresa não possui uma página de links',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...linksPage,
      logo: linksPage?.logo ? linksPage.logo.fileUrl : undefined,
    };
  }

  async update(companyId: string, updateLinksPageDto: UpdateLinksPageDto) {
    const linksPage = await this.prismaService.companyLinksPage.findFirst({
      where: {
        companyId,
      },
      include: {
        logo: true,
        company: {
          include: {
            logo: true,
          },
        },
      },
    });

    if (!linksPage) {
      throw new HttpException(
        'Esta empresa não possui uma página de links',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { logo, ...updateDto } = updateLinksPageDto;

    let newLogoId: string | null = linksPage?.logo?.id ?? null;

    if (
      (logo || logo === null) &&
      linksPage?.logo?.id &&
      linksPage.logo.id !== linksPage.company?.logo?.id
    ) {
      await this.storageService.deleteFile(linksPage.logo.key);
      newLogoId = null;
    }

    if (logo) {
      const mimeType = getMimeType(logo);

      if (mimeType) {
        const createdLogo = await this.storageService.uploadBase64Image({
          base64: logo,
          fileName: `${uuid()}.${mimeType.split('/')[1]}`,
          fileType: mimeType,
          path: 'company-links-page-logo/',
          fileSizeLimit: IMAGE_LIMITS.baseLimit,
        });

        newLogoId = createdLogo.id;
      }
    }

    const updatedLinksPage = await this.prismaService.companyLinksPage.update({
      where: {
        id: linksPage.id,
      },
      data: {
        ...updateDto,
        logoId: newLogoId,
      },
    });

    return updatedLinksPage;
  }

  async getLinksByCompanyId(companyId: string) {
    const linksPage = await this.prismaService.companyLinksPage.findFirst({
      where: {
        companyId,
      },
      include: {
        links: true,
      },
    });

    if (!linksPage) {
      throw new HttpException(
        'Esta empresa não possui uma página de links',
        HttpStatus.BAD_REQUEST,
      );
    }

    return linksPage.links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
    }));
  }

  async updateLinks(
    companyId: string,
    updateLinksDto: UpdateLinksDto,
    hasSubscription: boolean,
  ) {
    if (!hasSubscription) {
      throw new HttpException(
        'Você não possui uma assinatura premium para gerenciar links',
        HttpStatus.BAD_REQUEST,
      );
    }

    const linksPage = await this.prismaService.companyLinksPage.findFirst({
      where: {
        companyId,
      },
      include: {
        links: true,
      },
    });

    if (!linksPage) {
      throw new HttpException(
        'Esta empresa não possui uma página de links',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLinks = updateLinksDto.links.filter((x) => !x.originalId);
    const updateLinks = updateLinksDto.links.filter((x) => {
      const hasId = x.originalId;

      if (hasId) {
        const link = linksPage.links.find((link) => link.id === x.originalId);

        if (link.title !== x.title || link.url !== x.url) {
          return true;
        }
      }

      return false;
    });
    const removedLinks = linksPage.links.filter(
      (x) => !updateLinksDto.links.find((link) => link.originalId === x.id),
    );

    const newLinksCount =
      linksPage.links.length - removedLinks.length + newLinks.length;

    if (newLinksCount > LIMITS.PREMIUM.MAX_LINKS_PAGE_LINKS) {
      throw new HttpException(
        `Você atingiu o limite de ${LIMITS.PREMIUM.MAX_LINKS_PAGE_LINKS} links.`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (removedLinks.length) {
      await Promise.all(
        removedLinks.map((link) =>
          this.prismaService.companyLinksPageLink.delete({
            where: {
              id: link.id,
            },
          }),
        ),
      );
    }

    if (updateLinks.length) {
      await Promise.all(
        updateLinks.map((link) =>
          this.prismaService.companyLinksPageLink.update({
            where: {
              id: link.originalId,
            },
            data: {
              title: link.title,
              url: link.url,
            },
          }),
        ),
      );
    }

    if (newLinks.length) {
      await Promise.all(
        newLinks.map((link) =>
          this.prismaService.companyLinksPageLink.create({
            data: {
              title: link.title,
              url: link.url,
              companyLinksPageId: linksPage.id,
            },
          }),
        ),
      );
    }
  }

  async getPageDataByCompanySlug(companySlug: string) {
    const companyHasSubscription =
      await this.prismaService.subscription.findFirst({
        where: {
          status: {
            in: ['ACTIVE', 'CANCELING'],
          },
          company: {
            slug: companySlug,
          },
        },
      });

    if (!companyHasSubscription) {
      throw new HttpException(
        'Esta empresa não possui uma assinatura premium',
        HttpStatus.BAD_REQUEST,
      );
    }

    const linksPage = await this.prismaService.companyLinksPage.findFirst({
      where: {
        company: {
          slug: companySlug,
        },
      },
      include: {
        logo: true,
        links: true,
      },
    });

    if (!linksPage) {
      throw new HttpException(
        'Esta empresa não possui uma página de links',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...linksPage,
      logo: linksPage?.logo ? linksPage.logo.fileUrl : undefined,
      links: linksPage.links.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
      })),
    };
  }

  async getAllSlugsWithPage() {
    const linksPages = await this.prismaService.company.findMany({
      where: {
        linksPage: {
          some: {
            id: {
              not: undefined,
            },
          },
          every: {
            company: {
              subscription: {
                some: {
                  status: {
                    in: ['ACTIVE', 'CANCELING'],
                  },
                },
              },
            },
          },
        },
      },
      select: {
        slug: true,
      },
    });

    return linksPages.map((x) => x.slug);
  }
}
