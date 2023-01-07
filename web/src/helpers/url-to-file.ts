export const urlToFile = async (url: string, fileName: string) => {
  const response = await fetch(url);
  const file = await response.blob();
  return new File([file], fileName, { type: file.type });
}