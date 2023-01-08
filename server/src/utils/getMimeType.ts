export function getMimeType(base64: string): string | null {
  const regex = /^data:([a-zA-Z]*\/[a-zA-Z]*);base64,/;
  const matches = base64.match(regex);
  return matches ? matches[1] : null;
}
