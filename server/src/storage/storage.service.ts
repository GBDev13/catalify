import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { StorageConfig } from './storage-config';
import {
  UploadBase64FileDto,
  UploadFileDto,
} from './dto/upload-base64-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from '@prisma/client';

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor(private readonly prisma: PrismaService) {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });
  }

  async uploadBase64Image({
    base64,
    fileName,
    fileType,
    path = '',
  }: UploadBase64FileDto) {
    try {
      const bucket = this.storage.bucket(StorageConfig.mediaBucket);
      const blob = bucket.file(path + fileName);
      const imageBuffer = Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: fileType,
      });

      const finishPromise = new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${StorageConfig.mediaBucket}/${blob.name}`;

          const createdFile = await this.prisma.file.create({
            data: {
              fileName,
              fileUrl: publicUrl,
              key: blob.name,
            },
          });

          resolve(createdFile);
        });
      });

      blobStream.end(imageBuffer);

      const fileStored = await finishPromise;

      return fileStored as File;
    } catch (err) {
      console.log('erro - uploadBase64Image');
      console.log(err);
    }
  }

  async deleteFile(fileKey: string) {
    const file = this.storage.bucket(StorageConfig.mediaBucket).file(fileKey);

    const deleteResult = await file.delete();

    console.log('deleteResult', deleteResult);

    const fileToDelete = await this.prisma.file.findFirst({
      where: {
        key: fileKey,
      },
    });

    const result = await this.prisma.file.delete({
      where: {
        id: fileToDelete.id,
      },
    });

    return result;
  }

  async uploadFile({ dataBuffer, fileName, path, productId }: UploadFileDto) {
    try {
      const file = this.storage
        .bucket(StorageConfig.mediaBucket)
        .file(path + fileName);

      await file.save(Buffer.from(dataBuffer.buffer));

      const fileStored = await this.prisma.file.create({
        data: {
          fileName,
          fileUrl: `https://storage.googleapis.com/${StorageConfig.mediaBucket}/${file.name}`,
          key: file.name,
          productId,
        },
      });

      return fileStored;
    } catch (err) {
      console.log('erro - uploadFile');
      console.log(err);
    }
  }

  async deleteFilesByIds(ids: string[]) {
    const files = await this.prisma.file.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const deleteResults = await Promise.all(
      files.map((file) => this.deleteFile(file.key)),
    );
    return deleteResults;
  }
}
