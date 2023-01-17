import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { getMimeType } from 'src/utils/getMimeType';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { v4 as uuid } from 'uuid';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyLinksDto } from './dto/update-company-links-dto';
import { MAX_COMPANY_BANNERS, MAX_COMPANY_LINKS } from 'src/config/limits';
import { UpdateCompanyBannerImagesDto } from './dto/update-company-banner-images-dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: User) {
    const userAlreadyHaveCompany = await this.prisma.company.findFirst({
      where: {
        ownerId: user.id,
      },
    });

    if (userAlreadyHaveCompany) {
      throw new HttpException(
        'Esta conta já está vinculada a uma empresa existente',
        HttpStatus.CONFLICT,
      );
    }

    const slugAlreadyExists = await this.prisma.company.findUnique({
      where: {
        slug: createCompanyDto.slug,
      },
    });

    if (slugAlreadyExists) {
      throw new HttpException('Este slug já está em uso', HttpStatus.CONFLICT);
    }

    const { logo, ...createDto } = createCompanyDto;

    const createdCompany = await this.prisma.company.create({
      data: {
        ...createDto,
        ownerId: user.id,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        companyId: createdCompany.id,
      },
    });

    if (logo) {
      const mimeType = getMimeType(logo);

      if (mimeType) {
        const createdLogo = await this.storageService.uploadBase64Image({
          base64: logo,
          fileName: `${uuid()}.${mimeType.split('/')[1]}`,
          fileType: mimeType,
          path: 'company-logos/',
        });

        await this.prisma.company.update({
          where: {
            id: createdCompany.id,
          },
          data: {
            logoId: createdLogo.id,
          },
        });
      }
    }

    return createdCompany;
  }

  async update(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    user: User,
  ) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        logo: true,
      },
    });

    if (!companyExists) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (companyExists.ownerId !== user.id) {
      throw new HttpException(
        'Você não tem permissão para atualizar esta empresa',
        HttpStatus.FORBIDDEN,
      );
    }

    const slugAlreadyExists = await this.prisma.company.findUnique({
      where: {
        slug: updateCompanyDto.slug,
      },
    });

    if (slugAlreadyExists && slugAlreadyExists.id !== companyId) {
      throw new HttpException('Este slug já está em uso', HttpStatus.CONFLICT);
    }

    const { logo, ...updateDto } = updateCompanyDto;

    let newLogoId: string | null = companyExists?.logoId ?? null;

    if ((logo || logo === null) && companyExists.logoId) {
      await this.storageService.deleteFile(companyExists.logo.key);
      newLogoId = null;
    }

    if (logo) {
      const mimeType = getMimeType(logo);

      if (mimeType) {
        const createdLogo = await this.storageService.uploadBase64Image({
          fileType: mimeType,
          base64: logo,
          fileName: `${uuid()}.${mimeType.split('/')[1]}`,
          path: 'company-logos/',
        });

        newLogoId = createdLogo.id;
      }
    }

    await this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        ...updateDto,
        logoId: newLogoId,
      },
    });
  }

  async getByUserId(userId: string): Promise<Company> {
    const company = await this.prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      throw new HttpException(
        'Esta conta não está vinculada a uma empresa',
        HttpStatus.NOT_FOUND,
      );
    }

    return company;
  }

  async getLinks(companyId: string) {
    const links = await this.prisma.companyLinks.findMany({
      where: {
        companyId,
      },
    });

    return links.map((link) => ({
      id: link.id,
      url: link.url,
      createdAt: link.createdAt,
    }));
  }

  async updateLinks(
    companyId: string,
    updateCompanyLinksDto: UpdateCompanyLinksDto,
    user: User,
  ) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!companyExists) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (companyExists.ownerId !== user.id) {
      throw new HttpException(
        'Você não tem permissão para atualizar esta empresa',
        HttpStatus.FORBIDDEN,
      );
    }

    const { links: urls } = updateCompanyLinksDto;

    const existingLinks = await this.prisma.companyLinks.findMany({
      where: { companyId },
    });

    const existingUrls = new Set(existingLinks.map((link) => link.url));
    const newUrls = urls.filter((url) => !existingUrls.has(url));
    const deletedUrls = existingLinks
      .filter((link) => !urls.includes(link.url))
      .map((link) => link.url);
    const updatedUrls = urls.filter((url) => {
      const matchingLink = existingLinks.find((link) => link.url === url);
      return matchingLink && matchingLink.url !== url;
    });

    if (
      existingLinks.length - deletedUrls.length + newUrls.length >
      MAX_COMPANY_LINKS
    ) {
      throw new HttpException(
        `A empresa só pode ter até ${MAX_COMPANY_LINKS} links`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newUrls.length > 0) {
      await this.prisma.companyLinks.createMany({
        data: newUrls.map((url) => ({ url, companyId })),
      });
    }
    if (deletedUrls.length > 0) {
      await this.prisma.companyLinks.deleteMany({
        where: { url: { in: deletedUrls } },
      });
    }
    if (updatedUrls.length > 0) {
      await this.prisma.companyLinks.updateMany({
        where: { url: { in: updatedUrls } },
        data: { url: urls.find((url) => url === url) },
      });
    }
  }

  async getBanners(companyId: string) {
    const banners = await this.prisma.companyBanners.findMany({
      where: {
        companyId,
      },
      include: {
        picture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return banners.map((banner) => ({
      id: banner.id,
      url: banner.url,
      picture: banner.picture.fileUrl,
      createdAt: banner.createdAt,
    }));
  }

  async deleteCompanyBannerById(bannerId: string) {
    const bannerExists = await this.prisma.companyBanners.findUnique({
      where: {
        id: bannerId,
      },
      include: {
        picture: true,
      },
    });

    if (!bannerExists) {
      throw new HttpException('Banner não encontrado', HttpStatus.NOT_FOUND);
    }

    await this.storageService.deleteFile(bannerExists.picture.key);
  }

  async updateBannerImages(
    companyId: string,
    updateCompanyBannerImagesDto: UpdateCompanyBannerImagesDto,
    user: User,
  ) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!companyExists) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    if (companyExists.ownerId !== user.id) {
      throw new HttpException(
        'Você não tem permissão para atualizar esta empresa',
        HttpStatus.FORBIDDEN,
      );
    }

    const { banners } = updateCompanyBannerImagesDto;

    const companyBanners = await this.prisma.companyBanners.findMany({
      where: {
        companyId,
      },
    });

    const bannersToAdd = banners.filter((x) => !x?.id);
    const bannersToRemove = companyBanners.filter(
      (x) => !banners.find((y) => y?.id === x.id),
    );

    if (
      companyBanners.length - bannersToRemove.length + bannersToAdd.length >
      MAX_COMPANY_BANNERS
    ) {
      throw new HttpException(
        `A empresa só pode ter até ${MAX_COMPANY_BANNERS} banners`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const bannersToUpdate = banners.filter((x) => {
      const matchingBanner = companyBanners.find((y) => y.id === x.id);
      return matchingBanner && matchingBanner.url !== x.link;
    });

    if (bannersToAdd.length > 0) {
      await Promise.all(
        bannersToAdd.map(async (banner) => {
          const mimeType = getMimeType(banner.image);

          if (mimeType) {
            const createdBanner = await this.storageService.uploadBase64Image({
              base64: banner.image,
              fileName: `${uuid()}.${mimeType.split('/')[1]}`,
              fileType: mimeType,
              path: 'company-banners/',
            });

            await this.prisma.companyBanners.create({
              data: {
                companyId,
                pictureId: createdBanner.id,
                url: banner.link,
              },
            });
          }
        }),
      );
    }

    if (bannersToRemove.length > 0) {
      await Promise.all(
        bannersToRemove.map(async (banner) => {
          await this.deleteCompanyBannerById(banner.id);
        }),
      );
    }

    if (bannersToUpdate.length > 0) {
      await Promise.all(
        bannersToUpdate.map(async (banner) => {
          await this.prisma.companyBanners.update({
            where: {
              id: banner.id,
            },
            data: {
              url: banner.link,
            },
          });
        }),
      );
    }
  }
}
