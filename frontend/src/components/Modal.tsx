import { useState } from "react";
import type { PokemonDetailType } from "../type/pokemon";
import { useSearchParams } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pokemons: PokemonDetailType[];
};

export const Modal = (props: Props) => {
  const { isOpen, onClose, pokemons } = props;
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [, setSearchParams] = useSearchParams();
  const [inputName, setInputName] = useState<string>();
  if (!isOpen) {
    return null;
  }
  const allTypes = [
    ...new Set(pokemons.flatMap((p) => p.types.map((t) => t.type.name))),
  ];
  const handleCheck = (type: string) => {
    if (selectedTypes.includes(type)) {
      const newSelectedTypes = selectedTypes.filter((t) => t !== type);
      setSelectedTypes(newSelectedTypes);
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSearch = () => {
    if (selectedTypes.length && inputName) {
      setSearchParams({ types: selectedTypes.join(","), name: inputName });
    } else if (!selectedTypes.length && inputName) {
      setSearchParams({ name: inputName });
    } else if (selectedTypes.length && !inputName) {
      setSearchParams({ types: selectedTypes.join(",") });
    } else if (!selectedTypes.length && !inputName) {
      setSearchParams();
    }
    onClose();
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSearchParams();
    onClose();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>ポケモン検索</h2>
        <label id="poke-name" />
        <input id="poke-name" onChange={handleChangeName} value={inputName} />
        {allTypes.map((type) => {
          return (
            <div key={type}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleCheck(type)}
              />
              <p>{type}</p>
            </div>
          );
        })}
        <button onClick={handleReset}>検索条件をリセット</button>
        <button onClick={handleSearch}>検索</button>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};
