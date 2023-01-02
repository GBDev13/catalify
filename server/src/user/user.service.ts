import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OnboardingDto } from 'src/auth/dto/onboarding.dto';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (emailAlreadyExists) {
      throw new HttpException(
        'Este email já está em uso.',
        HttpStatus.CONFLICT,
      );
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async onboard(onboardingDto: OnboardingDto) {
    const user = await this.create(onboardingDto.user);
    const company = await this.companyService.create(
      onboardingDto.company,
      user,
    );

    return {
      user,
      company,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
