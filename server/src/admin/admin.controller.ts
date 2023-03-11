import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';

@Controller('super')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('companies')
  @UseGuards(AdminGuard)
  async getCompanies() {
    return this.adminService.getCompanies();
  }

  @Get('files')
  @UseGuards(AdminGuard)
  async getFiles() {
    return this.adminService.getFiles();
  }
}
