import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, CompanyModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
