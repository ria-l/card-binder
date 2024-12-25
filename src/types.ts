export type GSheetsData = {
  [key in
    | 'db-all'
    | 'db-filenames'
    | 'db-owned'
    | 'db-cards'
    | 'db-binders']: string[][];
};

export type Card = {
  card_id?: string;
  custom_dex_num?: number;
  energy?: string;
  file_name?: string;
  forme?: string;
  is_gold?: boolean;
  is_shiny?: boolean;
  is_tera?: boolean;
  national_dex_num?: number;
  set_id?: string;
  subtype?: string;
  supertype?: string;
  visuals?: string;
};

export type SetMeta = { set_id: string; ptcgo_id: string; set_name: string };
