import { useEffect, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import type { PokemonDetailType } from "../type/pokemon";
import { getPokemonsDetail } from "../api/pokemon";
import { Link, useSearchParams } from "react-router-dom";
import { Modal } from "../components/Modal";

export const Home = () => {
  const [data, setData] = useState<PokemonDetailType[]>([]);
  const [allPokes, setAllPokes] = useState<PokemonDetailType[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const selectedTypes = searchParams.get("types")?.split(",") || [];
  const selectedName = searchParams.get("name");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

  if (loading) return <p>loading...</p>;

  return (
    <>
      <div>
        <button onClick={openModal}>モーダルを開く</button>
        <Modal isOpen={isModalOpen} onClose={closeModal} pokemons={allPokes} />
      </div>
      {data.map((poke) => (
        <Link key={poke.id} to={`/detail/${poke.id}`} state={poke}>
          <PokemonCard data={poke} />
        </Link>
      ))}
    </>
  );
};
