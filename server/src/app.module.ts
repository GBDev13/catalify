import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrderModule } from './order/order.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from './stripe/stripe.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { StorageModule } from './storage/storage.module';
import { LinksPageModule } from './links-page/links-page.module';
import { StockModule } from './stock/stock.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { LogModule } from './log/log.module';
import { SentryModule } from './sentry/sentry.module';
import { AdminModule } from './admin/admin.module';

import * as Sentry from '@sentry/node';
import '@sentry/tracing';

@Module({
  imports: [
    envModule,
    PrismaModule,
    UserModule,
    AuthModule,
    CompanyModule,
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    CatalogModule,
    OrderModule,
    TasksModule,
    ScheduleModule.forRoot(),
    StripeModule.forRoot(process.env.STRIPE_KEY, {
      apiVersion: '2022-11-15',
    }),
    PaymentGatewayModule,
    SubscriptionModule,
    StorageModule,
    LinksPageModule,
    StockModule,
    TokenModule,
    MailModule,
    LogModule,
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: 1.0,
      debug: true,
      enabled: process.env.NODE_ENV === 'production',
    }),
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
