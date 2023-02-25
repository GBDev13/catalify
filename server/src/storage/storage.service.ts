import { Storage } from '@google-cloud/storage';
import { HttpException, Injectable } from '@nestjs/common';
import { StorageConfig } from './storage-config';
import {
  UploadBase64FileDto,
  UploadFileDto,
} from './dto/upload-base64-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from '@prisma/client';
import * as sharp from 'sharp';
import { IMAGE_COMPRESSION } from 'src/config/image';

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
    fileSizeLimit,
  }: UploadBase64FileDto) {
    const imageBuffer = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const bytes = imageBuffer.byteLength;

    if (fileSizeLimit && bytes > fileSizeLimit) {
      throw new HttpException('Arquivo muito grande', 400);
    }

    const bucket = this.storage.bucket(StorageConfig.mediaBucket);
    const newFileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
    const blob = bucket.file(path + newFileName);

    const compressedBuffer = await sharp(imageBuffer)
      .webp({ quality: IMAGE_COMPRESSION.quality })
      .toBuffer();

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: 'image/webp',
    });

    const finishPromise = new Promise((resolve, reject) => {
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${StorageConfig.mediaBucket}/${blob.name}`;

        const createdFile = await this.prisma.file.create({
          data: {
            fileName: newFileName,
            fileUrl: publicUrl,
            key: blob.name,
          },
        });

        resolve(createdFile);
      });
    });

    blobStream.end(compressedBuffer);

    const fileStored = await finishPromise;

    return fileStored as File;
  }

  async deleteFile(fileKey: string) {
    const file = this.storage.bucket(StorageConfig.mediaBucket).file(fileKey);

    await file.delete();

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

  async uploadFile({
    dataBuffer,
    fileName,
    path,
    productId,
    fileSizeLimit,
  }: UploadFileDto) {
    let compressedBuffer = dataBuffer;
    const bytes = compressedBuffer.byteLength;

    if (fileSizeLimit && bytes > fileSizeLimit) {
      throw new HttpException('Arquivo muito grande', 400);
    }

    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileType = fileName.split('.').pop();
    const isImage = imageTypes.includes(fileType);

    if (isImage) {
      compressedBuffer = await sharp(dataBuffer)
        .webp({ quality: IMAGE_COMPRESSION.quality })
        .toBuffer();
    }

    const newFileName = isImage
      ? fileName.replace(/\.[^/.]+$/, '') + '.webp'
      : fileName;

    const file = this.storage
      .bucket(StorageConfig.mediaBucket)
      .file(path + newFileName);

    await file.save(compressedBuffer);

    const fileStored = await this.prisma.file.create({
      data: {
        fileName: newFileName,
        fileUrl: `https://storage.googleapis.com/${StorageConfig.mediaBucket}/${file.name}`,
        key: file.name,
        productId,
      },
    });

    return fileStored;
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
