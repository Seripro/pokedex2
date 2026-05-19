import type { PokemonDetailType } from "../type/pokemon";

type Props = {
  data: PokemonDetailType | null;
};

export const PokemonCard = (props: Props) => {
  const { data } = props;
  return (
    <div>
      <img src={data?.sprites.front_default} width="300px" height="300px" />
      <p>No.{data?.id}</p>
      <p>{data?.name}</p>
    </div>
  );
};
