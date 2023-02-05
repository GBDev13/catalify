import { LinksPageService } from './links-page.service';
import { CreateLinksPageDto } from './dto/create-links-page.dto';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateLinksPageDto } from './dto/update-links-page.dto';
import { UpdateLinksDto } from './dto/update-links.dto';
import { SubscriptionGuard } from 'src/subscription/guards/subscription.guard';
import { CurrentSubscriptionIsValid } from 'src/subscription/decorators/current-subscription.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('links-page')
export class LinksPageController {
  constructor(private readonly linksPageService: LinksPageService) {}

  @Get('/:companyId')
  getByCompanyId(@Param('companyId') companyId: string) {
    return this.linksPageService.getByCompanyId(companyId);
  }

  @Put('/:companyId')
  update(
    @Body() updateLinksPageDto: UpdateLinksPageDto,
    @Param('companyId') companyId: string,
  ) {
    return this.linksPageService.update(companyId, updateLinksPageDto);
  }

  @Get('/:companyId/links')
  getLinksByCompanyId(@Param('companyId') companyId: string) {
    return this.linksPageService.getLinksByCompanyId(companyId);
  }

  @Put('/:companyId/links')
  @UseGuards(SubscriptionGuard)
  updateLinks(
    @Body() updateLinksDto: UpdateLinksDto,
    @Param('companyId') companyId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.linksPageService.updateLinks(
      companyId,
      updateLinksDto,
      validSubscription,
    );
  }

  @Get('/:companySlug/page-data')
  @IsPublic()
  getPageDataByCompanySlug(@Param('companySlug') companySlug: string) {
    return this.linksPageService.getPageDataByCompanySlug(companySlug);
  }
}
