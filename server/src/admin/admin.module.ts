import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [PrismaModule],
})
export class AdminModule {}
