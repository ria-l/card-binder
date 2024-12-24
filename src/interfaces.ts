export interface sheetsData {
  'db-all': string[][];
  'db-filenames': string[][];
  'db-owned': string[][];
  'db-cards': string[][];
  'db-binders': string[][];
  'db-sets': string[][];
}

export interface dexCards {
  [card_id: string]: {
    card_id?: string;
    card_visual_type?: string;
    pkmn_forme?: string;
    is_shiny?: boolean;
    is_tera?: boolean;
    is_gold_card?: boolean;
    custom_dex_num?: number;
    file_name?: string;
  };
}
