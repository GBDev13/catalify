import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LogService {
  constructor(private readonly httpService: HttpService) {}
  async log(title: string, message: string, url?: string) {
    try {
      const messageData = {
        embeds: [
          {
            title: title,
            color: 10181046,
            fields: [
              {
                name: 'Content',
                value: message,
              },
            ],
            url,
          },
        ],
      };

      await firstValueFrom(
        this.httpService
          .post(process.env.DISCORD_WEBHOOK_URL, messageData)
          .pipe(),
      );
    } catch (err) {
      console.log('log error', err);
    }
  }
}
