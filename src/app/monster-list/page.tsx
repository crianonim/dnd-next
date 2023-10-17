"use client";
import _ from "lodash";
import { monsters } from "@/game/monsters";
import MonsterView from "../components/monsterView";
import MonsterFilter from "./filter";
import { useState } from "react";
import { useStore } from "@/store/arenaStore";
export default function MonsterList() {
  const [selectedType, setSelectedType] = useState("humanoid");
  const spawnMonster = useStore((store) => store.spawnMonster);
  const entities = useStore((store) => store.entities);
  console.log(entities);
  return (
    <div>
      <MonsterFilter onChange={(s: string) => setSelectedType(s)} />
      <div>
        {monsters
          .filter((m) => m.type === selectedType)
          .map((m) => (
            <div key={m.name} onClick={() => spawnMonster(m)}>
              <MonsterView monster={m} />
            </div>
          ))}
      </div>
    </div>
  );
}
