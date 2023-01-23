declare namespace Stock {
  export type StockOptionVariants = {
    id: string;
    name: string;
    options: {
      id: string;
      name: string;
    }[]
  }

  export type StockOption = {
    id: string;
    name: string;
    variants: StockOptionVariants[]
  }
}