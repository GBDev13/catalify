import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { FileModule } from './file/file.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrderModule } from './order/order.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from './stripe/stripe.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    CompanyModule,
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    FileModule,
    CatalogModule,
    OrderModule,
    TasksModule,
    ScheduleModule.forRoot(),
    StripeModule.forRoot(process.env.STRIPE_KEY, {
      apiVersion: '2022-11-15',
    }),
    PaymentGatewayModule,
    SubscriptionModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
