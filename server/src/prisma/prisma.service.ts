import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      if (
        (params.action === 'create' || params.action === 'update') &&
        ['Category', 'Product'].includes(params.model)
      ) {
        const {
          args: { data },
        } = params;
        data.slug = slugify(`${data.name}`, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        });

        const existent = await this[params.model].count({
          where: {
            slug: {
              startsWith: data.slug,
            },
            companyId: data.companyId,
          },
        });

        if (existent > 0) {
          data.slug = `${data.slug}-${existent + 1}`;
        }
      }
      const result = await next(params);
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
