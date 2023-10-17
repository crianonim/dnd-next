import { Combatant, Team } from "@/game/arena";
import { useMemo } from "react";

export default function useStatus(combatants: Record<string, Combatant>) {
  const numberOfAliveInTeam = (team: Team) =>
    Object.values(combatants).filter(
      (c) => c.entity.state !== "dead" && c.team === team
    ).length;
  const numberOfAliveReds = useMemo(() => {
    const number = numberOfAliveInTeam("red");
    return number;
  }, [combatants]);
  const numberOfAliveBlues = useMemo(() => {
    const number = numberOfAliveInTeam("blue");
    return number;
  }, [combatants]);
  const status = useMemo(() => {
    console.log("recalculating status");
    return numberOfAliveBlues === 0 && numberOfAliveReds == 0
      ? "draw"
      : numberOfAliveBlues == 0
      ? "red"
      : numberOfAliveReds == 0
      ? "blue"
      : "ongoing";
  }, [numberOfAliveReds, numberOfAliveBlues]);
  return status;
}
