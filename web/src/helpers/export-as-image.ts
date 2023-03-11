import html2canvas from "html2canvas";
  
const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  // @ts-ignore
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  
  fakeLink.href = blob;
  
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  
  fakeLink.remove();
};

export const exportAsImage = async (element: HTMLElement, imageFileName: string) => {
  const canvas = await html2canvas(element, {
    scale: 2
  });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};