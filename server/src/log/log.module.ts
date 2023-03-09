import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
