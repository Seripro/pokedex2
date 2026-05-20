import { useEffect, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import type { PokemonDetailType } from "../type/pokemon";
import { getPokemonsDetail } from "../api/pokemon";
import { Link, useSearchParams } from "react-router-dom";
import { Modal } from "../components/Modal";
import type { FavoritesType } from "../type/favorites";

export const Home = () => {
  const [data, setData] = useState<PokemonDetailType[]>([]);
  const [allPokes, setAllPokes] = useState<PokemonDetailType[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const selectedTypes = searchParams.get("types")?.split(",") || [];
  const selectedName = searchParams.get("name");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/favorites");
        const favorites: FavoritesType[] = await res.json();
        const newFavorites = favorites.map((f) => f.pokemon_id);
        setFavorites(newFavorites);
        let allData = await getPokemonsDetail(1, 151);
        setAllPokes(allData);

        // タイプで絞る
        if (selectedTypes.length) {
          for (const type of selectedTypes) {
            allData = allData.filter((poke) => {
              for (const t of poke.types) {
                if (t.type.name === type) {
                  return true;
                }
              }
              return false;
            });
          }
        }

        // 名前の部分一致で絞る
        if (selectedName) {
          allData = allData.filter(
            (poke) => poke.name.indexOf(selectedName) > -1,
          );
        }
        setData(allData);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const handleFavo = async (id: number) => {
    if (data) {
      const response = await fetch("http://localhost:8000/favorites", {
        method: "POST", // POSTメソッドを指定
        headers: {
          "Content-Type": "application/json", // JSONを送ることを伝える
        },
        body: JSON.stringify({ pokemon_id: id }), // データをJSON文字列に変換
      });
      console.log(response);
      setFavorites([...favorites, id]);
    }
  };

  if (loading) return <p>loading...</p>;

  return (
    <>
      <div>
        <button onClick={openModal}>モーダルを開く</button>
        <Modal isOpen={isModalOpen} onClose={closeModal} pokemons={allPokes} />
      </div>
      {data.map((poke) => (
        <div key={poke.id}>
          <Link to={`/detail/${poke.id}`} state={poke}>
            <PokemonCard data={poke} />
          </Link>
          {favorites.includes(poke.id) ? (
            <p>お気に入り済み</p>
          ) : (
            <button onClick={() => handleFavo(poke.id)}>
              お気に入りボタン
            </button>
          )}
        </div>
      ))}
    </>
  );
};
