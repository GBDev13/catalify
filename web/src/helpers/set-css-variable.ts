export const setCssVariable = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
}

export const setScrollColors = (thumb: string, track: string) => {
  setCssVariable('--color-scroll-thumb', thumb)
  setCssVariable('--color-scroll-track', track)
}