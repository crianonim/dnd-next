"use client";
import _ from "lodash";
import { monsters } from "@/game/monsters";
import MonsterView from "../components/monsterView";
import MonsterFilter from "./filter";
import { useState } from "react";
import { useStore } from "@/store/arenaStore";
import MonsterMini from "../components/monsterMini";
export default function MonsterList() {
  const [selectedType, setSelectedType] = useState("humanoid");
  const [details, setDetails] = useState(false);
  const spawnMonster = useStore((store) => store.spawnMonster);
  const entities = useStore((store) => store.entities);
  console.log(entities);
  return (
    <div>
      <MonsterFilter
        onDetailsChange={(e) => setDetails(e.target.checked)}
        onTypeChange={(s: string) => setSelectedType(s)}
      />
      <div>
        {monsters
          .filter((m) => m.type === selectedType)
          .map((m) => (
            <div
              key={m.name}
              className="cursor-pointer hover:bg-slate-200"
              onClick={() => spawnMonster(m)}
            >
              {details ? (
                <MonsterView monster={m} />
              ) : (
                <MonsterMini monster={m} />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
