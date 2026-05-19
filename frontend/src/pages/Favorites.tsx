import { useEffect, useState } from "react";
import { getPokemonsDetail } from "../api/pokemon";
import type { PokemonDetailType } from "../type/pokemon";
import { PokemonCard } from "../components/PokemonCard";

function Favorites() {
  const [data, setData] = useState<PokemonDetailType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/favorites");
        const favorites: number[] = await res.json();
        const Data = await getPokemonsDetail(1, 151);
        setData(Data.filter((data) => favorites.includes(data.id)));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>loading...</div>;

  return (
    <>
      {data.map((d) => {
        return <PokemonCard key={d.id} data={d} />;
      })}
    </>
  );
}

export default Favorites;
