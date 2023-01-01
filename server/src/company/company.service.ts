import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: User,
  ): Promise<Company> {
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

    const createdCompany = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
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

    return createdCompany;
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
