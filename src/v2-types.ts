export type tcgSet = {
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

export type tcgCard = {
  id: string;
  name: string;
  supertype: Supertypes;
  subtypes: string[];
  types: Energy[];
  set: {
    id: string;
    name: string;
    series: string;
    ptcgoCode: string;
    releaseDate: string;
  };
  artist: string;
  rarity: Rarities;
  nationalPokedexNumbers: number[];
  images: {
    large: string;
  };
};

export type Card = {
  name: string;
  id: string;
  artist: string;
  customDexNum: number;
  energy: Energy;
  filename: string;
  forme: string;
  isGold: boolean;
  isShiny: boolean;
  isTera: boolean;
  nationalDex: number;
  rarity: Rarities;
  set: string;
  subtype: string;
  supertype: Supertypes;
  visuals: Visuals;
};

type Visuals = 'normal' | '3d' | 'full art' | 'gold' | 'illust';

type Energy =
  | 'Colorless'
  | 'Darkness'
  | 'Dragon'
  | 'Fairy'
  | 'Fighting'
  | 'Fire'
  | 'Grass'
  | 'Lightning'
  | 'Metal'
  | 'Psychic'
  | 'Water';

type Rarities =
  | 'ACE SPEC Rare'
  | 'Amazing Rare'
  | 'Classic Collection'
  | 'Common'
  | 'Double Rare'
  | 'Hyper Rare'
  | 'Illustration Rare'
  | 'LEGEND'
  | 'Promo'
  | 'Radiant Rare'
  | 'Rare'
  | 'Rare ACE'
  | 'Rare BREAK'
  | 'Rare Holo'
  | 'Rare Holo EX'
  | 'Rare Holo GX'
  | 'Rare Holo LV.X'
  | 'Rare Holo Star'
  | 'Rare Holo V'
  | 'Rare Holo VMAX'
  | 'Rare Holo VSTAR'
  | 'Rare Prime'
  | 'Rare Prism Star'
  | 'Rare Rainbow'
  | 'Rare Secret'
  | 'Rare Shining'
  | 'Rare Shiny'
  | 'Rare Shiny GX'
  | 'Rare Ultra'
  | 'Shiny Rare'
  | 'Shiny Ultra Rare'
  | 'Special Illustration Rare'
  | 'Trainer Gallery Rare Holo'
  | 'Ultra Rare'
  | 'Uncommon';

type Supertypes = 'Energy' | 'Pokémon' | 'Trainer';
