import { LinksPageService } from './links-page.service';
import { CreateLinksPageDto } from './dto/create-links-page.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateLinksPageDto } from './dto/update-links-page.dto';

@Controller('links-page')
export class LinksPageController {
  constructor(private readonly linksPageService: LinksPageService) {}

  @Post('/:companyId')
  create(
    @Body() createLinksPageDto: CreateLinksPageDto,
    @Param('companyId') companyId: string,
  ) {
    return this.linksPageService.create(companyId, createLinksPageDto);
  }

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
}
