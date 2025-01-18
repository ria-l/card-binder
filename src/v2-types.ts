export type tcgset = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: string;
  legalities: {
    unlimited: string;
  };
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
};
