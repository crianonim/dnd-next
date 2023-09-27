import _ from "lodash";
import { monsters } from "@/game/monsters";
import MonsterView from "../components/monsterView";
export default function MonsterList() {
  return (
    <div>
      <div>
        {monsters
          .filter((m) => m.type === "humanoid")
          .map((m) => (
            <MonsterView key={m.name} monster={m} />
          ))}
      </div>
    </div>
  );
}
