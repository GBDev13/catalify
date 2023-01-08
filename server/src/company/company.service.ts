import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { getMimeType } from 'src/utils/getMimeType';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { v4 as uuid } from 'uuid';
import { FileService } from 'src/file/file.service';
import { getFileBuffer } from 'src/utils/getFileBuffer';
import { getBase64Buffer } from 'src/utils/get-base64-buffer';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: User,
  ): Promise<Company> {
    try {
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
          const createdLogo = await this.fileService.uploadBase64File({
            base64: logo,
            fileName: `${uuid()}.${mimeType.split('/')[1]}`,
            fileType: mimeType,
            path: 'companies/logo',
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
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
}
