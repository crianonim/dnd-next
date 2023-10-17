import { Combatant } from "@/game/arena";

export default function CombatantViewMini({
  combatant,
}: {
  combatant: Combatant;
}) {
  return (
    <div
      className={
        "gap-1 flex flex-col text-sm p-1 " +
        (combatant.entity.state == "active"
          ? "bg-inherit"
          : "bg-slate-700 text-white opacity-50")
      }
    >
      <div className="flex gap-1 justify-between">
        {" "}
        <span className="font-bold ">{combatant.entity.name}</span>
        <span>
          {combatant.entity.currentHP}/{combatant.entity.maxHP}
        </span>
      </div>
      <div className="flex gap-1 justify-between">
        Initiative <span className="">{combatant.initiative}</span>
      </div>
    </div>
  );
}
