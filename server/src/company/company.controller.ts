import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyLinksDto } from './dto/update-company-links-dto';
import { UpdateCompanyBannerImagesDto } from './dto/update-company-banner-images-dto';

@Controller('/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getUserCompany(@CurrentUser() user: User) {
    return this.companyService.getByUserId(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @Body() createUserDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companyService.create(createUserDto, user);
  }

  @Put('/:companyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companyService.update(companyId, updateCompanyDto, user);
  }

  @Get('/:companyId/links')
  async getCompanyLinks(@Param('companyId') companyId: string) {
    return this.companyService.getLinks(companyId);
  }

  @Put('/:companyId/links')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompanyLinks(
    @Param('companyId') companyId: string,
    @Body() updateCompanyLinksDto: UpdateCompanyLinksDto,
    @CurrentUser() user: User,
  ) {
    return this.companyService.updateLinks(
      companyId,
      updateCompanyLinksDto,
      user,
    );
  }

  @Get('/:companyId/banners')
  async getCompanyBanners(@Param('companyId') companyId: string) {
    return this.companyService.getBanners(companyId);
  }

  @Put('/:companyId/banners')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompanyBanners(
    @Param('companyId') companyId: string,
    @Body() updateCompanyBannersDto: UpdateCompanyBannerImagesDto,
    @CurrentUser() user: User,
  ) {
    return this.companyService.updateBannerImages(
      companyId,
      updateCompanyBannersDto,
      user,
    );
  }
}
