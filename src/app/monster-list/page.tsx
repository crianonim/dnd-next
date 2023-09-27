"use client";
import _ from "lodash";
import { MonsterType, monsters } from "@/game/monsters";
import MonsterView from "../components/monsterView";
import MonsterFilter from "./filter";
import { useState } from "react";
export default function MonsterList() {
  const [selectedType, setSelectedType] = useState("humanoid");
  return (
    <div>
      <MonsterFilter onChange={(s: string) => setSelectedType(s)} />
      <div>
        {monsters
          .filter((m) => m.type === selectedType)
          .map((m) => (
            <MonsterView key={m.name} monster={m} />
          ))}
      </div>
    </div>
  );
}
