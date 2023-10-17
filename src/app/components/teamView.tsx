import { Combatant, Team } from "@/game/arena";
import CombatantViewMini from "./combatantsMini";

interface TeamViewProps {
  team: Team;
  combatants: Record<string, Combatant>;
  isCurrentTeam: boolean;
  current: string | undefined;
  isAttackPresent: boolean;
  onAttackedClick: (c: Combatant) => void;
}

const TeamView = ({
  team,
  combatants,
  isCurrentTeam,
  current,
  isAttackPresent,
  onAttackedClick,
}: TeamViewProps) => (
  <div
    className={
      "flex flex-col gap-1 p-1 " +
      (isAttackPresent && isCurrentTeam ? "opacity-50" : "opacity-100")
    }
  >
    {Object.values(combatants)
      .filter((c) => c.team == team)
      .map((c) => (
        <div
          className={
            "cursor-pointer border shadow " +
            (c.entity.name === current ? " border-black" : "")
          }
          key={c.entity.name}
          onClick={() => {
            if (
              isAttackPresent &&
              !isCurrentTeam &&
              c.entity.state !== "dead"
            ) {
              onAttackedClick(c);
            }
          }}
        >
          <CombatantViewMini combatant={c} />
        </div>
      ))}
  </div>
);

export default TeamView;
