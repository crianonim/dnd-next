import { Monster } from "@/game/monsters";
import React from "react";

type MonsterMiniProps = {
  monster: Monster;
};

export default function MonsterMini({ monster }: MonsterMiniProps) {
  return (
    <div className="flex border p-1 gap-1">
      <div className="font-bold text-l">{monster.name}</div>

      <div>
        <span>HP</span> {monster.hit_points}
      </div>
      <div>({monster.xp} XP)</div>
    </div>
  );
}
