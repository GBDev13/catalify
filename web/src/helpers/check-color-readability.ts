import { getContrast } from "polished";

export const checkColorReadability = (bgColor: string, lightColor: string, darkColor: string) => {
  const contrastRatio = getContrast(bgColor, lightColor);
  if (contrastRatio >= 2) {
    return lightColor;
  }
  return darkColor
};