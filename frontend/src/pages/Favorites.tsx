import { useEffect, useState } from "react";
import { getPokemonsDetail } from "../api/pokemon";
import type { PokemonDetailType } from "../type/pokemon";
import { PokemonCard } from "../components/PokemonCard";
import type { FavoritesType } from "../type/favorites";

function Favorites() {
  const [data, setData] = useState<PokemonDetailType[]>([]);
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/favorites");
        const favorites: FavoritesType[] = await res.json();
        setFavorites(favorites);
        const Data = await getPokemonsDetail(1, 151);
        const favoriteIds = favorites.map((f) => f.pokemon_id);
        setData(Data.filter((data) => favoriteIds.includes(data.id)));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (id: number) => {
    if (values[id] && values[id].trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:8000/favorites/${id}/memo`,
          {
            method: "PATCH", // POSTメソッドを指定
            headers: {
              "Content-Type": "application/json", // JSONを送ることを伝える
            },
            body: JSON.stringify({ pokemon_id: id, memo: values[id] }), // データをJSON文字列に変換
          },
        );
        console.log(response);
        if (response.ok) {
          const newFavorites = favorites.map((f) => {
            if (f.pokemon_id === id) {
              return { ...f, memo: values[id] };
            } else {
              return f;
            }
          });
          setFavorites(newFavorites);
          setValues((prev) => ({ ...prev, [id]: "" }));
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <>
      {data.map((d) => {
        return (
          <div key={d.id}>
            <PokemonCard data={d} />
            {favorites
              .filter((f) => f.pokemon_id === d.id)
              .map((f) => {
                return (
                  <div key={f.pokemon_id}>
                    <p>{f.memo}</p>
                    <input
                      value={values[f.pokemon_id] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [f.pokemon_id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave(d.id)}>保存</button>
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}

export default Favorites;
