import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyLinksDto } from './dto/update-company-links-dto';
import { UpdateCompanyBannerImagesDto } from './dto/update-company-banner-images-dto';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionGuard } from 'src/subscription/guards/subscription.guard';
import { CurrentSubscriptionIsValid } from 'src/subscription/decorators/current-subscription.decorator';

@Controller('/company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

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
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompanyLinks(
    @Param('companyId') companyId: string,
    @Body() updateCompanyLinksDto: UpdateCompanyLinksDto,
    @CurrentUser() user: User,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.companyService.updateLinks(
      companyId,
      updateCompanyLinksDto,
      user,
      validSubscription,
    );
  }

  @Get('/:companyId/banners')
  async getCompanyBanners(@Param('companyId') companyId: string) {
    return this.companyService.getBanners(companyId);
  }

  @Put('/:companyId/banners')
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompanyBanners(
    @Param('companyId') companyId: string,
    @Body() updateCompanyBannersDto: UpdateCompanyBannerImagesDto,
    @CurrentUser() user: User,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.companyService.updateBannerImages(
      companyId,
      updateCompanyBannersDto,
      user,
      validSubscription,
    );
  }

  @Get('/:companySlug/subscription')
  async getSubscriptionByCompanySlug(
    @Param('companySlug') companySlug: string,
  ) {
    return this.subscriptionService.getSubscriptionByCompanySlug(companySlug);
  }

  @Get('/:companyId/overview')
  async getCompanyOverview(@Param('companyId') companyId: string) {
    return this.companyService.getCompanyOverview(companyId);
  }
}
