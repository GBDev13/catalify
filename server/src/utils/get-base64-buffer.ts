export function getBase64Buffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}
