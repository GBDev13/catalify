import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OnboardingDto } from 'src/auth/dto/onboarding.dto';
import { CompanyService } from 'src/company/company.service';
import { LogService } from 'src/log/log.service';
import { MailService } from 'src/mail/mail.service';
import { TOKENS_DURATION } from 'src/stripe/constants';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly logService: LogService,
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

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async sendEmailVerification({
    userId,
    email,
    firstName,
  }: {
    userId: string;
    email: string;
    firstName: string;
  }) {
    const emailToken = await this.tokenService.createToken({
      expiresIn: TOKENS_DURATION.EMAIL_VERIFICATION,
      type: 'EMAIL_VERIFICATION',
      userId: userId,
    });

    await this.mailService.sendMail({
      subject: 'Verificação de email',
      to: [
        {
          email: email,
          name: firstName,
        },
      ],
      template: {
        name: 'verify-email',
        context: {
          name: firstName,
          href: `${process.env.FRONT_END_URL}/onboarding?token=${emailToken.token}`,
        },
      },
    });
  }

  async onboard(onboardingDto: OnboardingDto) {
    let userId: string;

    await this.logService.log(
      'New user onboarding',
      `Company: ${onboardingDto?.company?.name}`,
      `https://${onboardingDto?.company?.slug}.catalify.com.br`,
    );

    try {
      const user = await this.create(onboardingDto.user);

      userId = user.id;

      const company = await this.companyService.create(
        onboardingDto.company,
        user,
      );

      await this.prisma.siteDetail.create({
        data: {
          company: {
            connect: { id: company.id },
          },
          faviconFileId: company?.logoId ?? null,
        },
      });

      await this.sendEmailVerification({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
      });

      return {
        user,
        company,
      };
    } catch (error) {
      if (userId) {
        await this.deleteUserIfExists(userId);
      }

      throw error;
    }
  }

  async deleteUserIfExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user) {
      if (user.companyId) {
        await this.companyService.deleteCompanyById(user.companyId);
      }
      await this.prisma.user.delete({ where: { id } });
    }
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateEmailVerified(id: string, emailVerified: boolean) {
    await this.prisma.user.update({
      where: { id },
      data: {
        emailVerifiedAt: emailVerified ? new Date() : null,
      },
    });
  }
}
