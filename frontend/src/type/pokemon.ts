export type Pokemon = {
  id: string;
  name: string;
  sprites: {
    front_default: string;
  };
};

export type PokemonNameAndUrl = {
  name: string;
  url: string;
};

export type PokemonDetailType = {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
  };
};
