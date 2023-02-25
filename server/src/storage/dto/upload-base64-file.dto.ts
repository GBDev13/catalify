export type UploadBase64FileDto = {
  base64: string;
  fileName: string;
  fileType: string;
  path?: string;
  fileSizeLimit?: number;
};

export type UploadFileDto = {
  dataBuffer: Buffer;
  fileName: string;
  productId?: string;
  path?: string;
  fileSizeLimit?: number;
};
