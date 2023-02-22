import { HttpException, Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail-dto';
import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly mailjet: Client;
  constructor() {
    this.mailjet = new Client({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });
  }

  async sendMail(mailDto: SendMailDto) {
    let html = null;
    if (mailDto.template) {
      console.log(process.cwd());

      const template = Handlebars.compile(
        readFileSync(
          `./src/mail/templates/${mailDto.template.name}.hbs`,
          'utf8',
        ),
      );
      html = template({ ...mailDto.template.context });
    }

    try {
      const data: SendEmailV3_1.Body = {
        Messages: [
          {
            From: mailDto?.from
              ? {
                  Email: mailDto.from.email,
                  Name: mailDto.from.name,
                }
              : {
                  Email: 'sistema@catalify.com.br',
                  Name: 'Catalify',
                },
            To: mailDto.to.map((x) => ({
              Email: x.email,
              Name: x.name,
            })),
            Subject: mailDto.subject,
            HTMLPart: html ?? mailDto.content,
          },
        ],
      };
      const result: LibraryResponse<SendEmailV3_1.Response> = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

      const { Status } = result.body.Messages[0];

      if (Status !== 'success') {
        throw new HttpException('Ocorreu um erro ao enviar o email', 500);
      }

      return Status;
    } catch (err) {
      console.log('mail err', err);
      throw new HttpException('Ocorreu um erro ao enviar o email', 500);
    }
  }
}
