import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { LinksPageController } from './links-page.controller';
import { LinksPageService } from './links-page.service';

@Module({
  imports: [PrismaModule, StorageModule],
  providers: [LinksPageService],
  controllers: [LinksPageController],
  exports: [LinksPageService],
})
export class LinksPageModule {}
