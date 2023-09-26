"use client";
import * as roll from "@/game/roll";
import _ from "lodash";
import Roller from "./features/roller";
import { useState } from "react";
import { monsters, alignments } from "@/game/monsters";
import MonsterView from "./components/monsterView";
export default function Home() {
  const [result, setResult] = useState(0);
  console.log(alignments);
  const toParse = "2d4";
  console.log({ toParse }, roll.parseRoll(toParse));
  return (
    <div>
      <div className="flex items-center gap-2">
        <Roller setResult={setResult} />
        <div>{result}</div>
      </div>

      <div>
        <h2>Monster list:</h2>
        {monsters
          .filter((m) => m.type === "humanoid")
          .map((m) => (
            <MonsterView key={m.name} monster={m} />
          ))}
      </div>
    </div>
  );
}
