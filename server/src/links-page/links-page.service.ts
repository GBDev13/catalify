import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { getMimeType } from 'src/utils/getMimeType';
import { CreateLinksPageDto } from './dto/create-links-page.dto';
import { UpdateLinksPageDto } from './dto/update-links-page.dto';
import { v4 as uuid } from 'uuid';
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
    });

    if (!company) {
      throw new HttpException(
        'Esta empresa não existe',
        HttpStatus.BAD_REQUEST,
      );
    }

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
          : null,
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
}
