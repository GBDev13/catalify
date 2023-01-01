import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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
}
