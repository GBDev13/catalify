import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { UploadBase64FileDto } from './dto/upload-base64-file.dto';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(dataBuffer: Buffer, fileName: string, productId?: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${uuid()}-${fileName}`,
          ACL: 'public-read',
        })
        .promise();

      const fileStorageInDB = {
        fileName: fileName,
        fileUrl: uploadResult.Location,
        key: uploadResult.Key,
        productId: productId,
      };

      const fileStored = await this.prisma.file.create({
        data: fileStorageInDB,
      });

      return fileStored;
    } catch (err) {
      console.log('erro - uploadFile');
      console.log(err);
    }
  }

  async uploadBase64File({
    base64,
    path = '',
    fileName,
    fileType,
  }: UploadBase64FileDto) {
    try {
      console.log('filetype', fileType);
      const buffer = Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      console.log('buffer', buffer);

      const s3 = new S3();

      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: buffer,
          Key: `${!!path?.trim() ? path + '/' : ''}${fileName}`,
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: fileType,
        })
        .promise();

      const fileStorageInDB = {
        fileName: fileName,
        fileUrl: uploadResult.Location,
        key: uploadResult.Key,
      };

      const fileStored = await this.prisma.file.create({
        data: fileStorageInDB,
      });

      return fileStored;
    } catch (err) {
      console.log('erro - uploadBase64File');
      console.log(err);
    }
  }

  async deleteFilesByIds(ids: string[]) {
    // const files = await this.prisma.file.findMany({
    //   where: {
    //     id: {
    //       in: ids,
    //     },
    //   },
    // });
    // const deleteResults = await Promise.all(
    //   files.map((file) => this.deleteFile(file.key)),
    // );
    // return deleteResults;
  }

  async deleteFile(key: string) {
    // const s3 = new S3();
    // const deleteResult = await s3
    //   .deleteObject({
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: key,
    //   })
    //   .promise();
    // const file = await this.prisma.file.findFirst({
    //   where: {
    //     key,
    //   },
    // });
    // await this.prisma.file.delete({
    //   where: {
    //     id: file.id,
    //   },
    // });
    // return deleteResult;
  }
}
