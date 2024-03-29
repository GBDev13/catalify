import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { LogModule } from 'src/log/log.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, CompanyModule, MailModule, TokenModule, LogModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
