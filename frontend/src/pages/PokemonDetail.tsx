import { useEffect, useState } from "react";
import type { PokemonDetailType } from "../type/pokemon";
import type { StatName } from "../type/stats";
import { useLocation } from "react-router-dom";

export const PokemonDetail = () => {
  const location = useLocation();
  const poke = location.state;
  const [data, setData] = useState<PokemonDetailType>();
  useEffect(() => {
    const manageState = () => {
      setData(poke);
    };
    manageState();
  }, []);
  return (
    <div>
      <div>
        <img src={data?.sprites.front_default} />
        <p>No.{data?.id}</p>
        <p>{data?.name}</p>
      </div>
      <div>
        {data?.types.map((item) => {
          return <p key={item.type.name}>{item.type.name}</p>;
        })}
        <p>
          高さ：{data ? `${data.height / 10} m` : "情報が存在しません"} 重さ：
          {data ? `${data.weight / 10} kg` : "情報が存在しません"}
        </p>
        {data?.abilities.map((item) => {
          return (
            <div key={item.ability.name}>
              {item.is_hidden ? (
                <p>隠れ特性：{item.ability.name}</p>
              ) : (
                <p>特性：{item.ability.name}</p>
              )}
            </div>
          );
        })}
      </div>
      <div>
        {data?.stats.map((item, index) => {
          const statLabels = {
            hp: "HP",
            attack: "こうげき",
            defense: "ぼうぎょ",
            "special-attack": "とくこう",
            "special-defense": "とくぼう",
            speed: "すばやさ",
          };
          return (
            <p key={index}>
              {statLabels[item.stat.name as StatName]}：{item.base_stat}
            </p>
          );
        })}
      </div>
    </div>
  );
};
