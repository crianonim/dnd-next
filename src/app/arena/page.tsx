"use client";
import {
  Entity,
  generateEntities,
  attackEntity,
  AttackResult,
  attackResultToString,
  applyDamage,
  Combatant,
  enterCombat,
} from "@/game/entity";
import { AttackAction } from "@/game/monsters";
import _ from "lodash";

import React, { useEffect, useMemo, useState } from "react";

function EntityView({
  entity,
  onClick,
  onAttackAction,
}: {
  entity: Entity;
  onClick: (e: string) => void;
  onAttackAction: (a: AttackAction) => void;
}) {
  return (
    <div
      className={
        "gap-1 flex flex-col text-sm border rounded shadow p-1 " +
        (entity.state == "active"
          ? "bg-white"
          : "bg-slate-700 text-white opacity-50")
      }
    >
      <div className="flex gap-1 justify-between">
        {" "}
        <span
          className="font-bold cursor-pointer"
          onClick={() =>
            entity.state === "active" ? onClick(entity.name) : undefined
          }
        >
          {entity.name}
        </span>
        <span>
          {entity.currentHP}/{entity.maxHP}
        </span>
      </div>
      <div className="flex gap-1">
        {entity.state == "active" &&
          entity.attacks.map((attack) => (
            <div
              className=" bg-slate-200 border rounded-sm cursor-pointer"
              key={attack.name}
              onClick={() => onAttackAction(attack)}
            >
              {attack.name}
            </div>
          ))}
      </div>
    </div>
  );
}

function CombatantViewMini({ combatant }: { combatant: Combatant }) {
  return (
    <div
      className={
        "gap-1 flex flex-col text-sm border rounded shadow p-1 " +
        (combatant.entity.state == "active"
          ? "bg-white"
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

const getEntityByName = (
  name: string,
  entities: Entity[]
): Entity | undefined => entities.find((e) => e.name === name);

const nextCombatant = (combatants: Combatant[], current: string): string => {
  const index = combatants.findIndex((c) => c.entity.name === current) + 1;
  const newIndex = index >= combatants.length ? 0 : index;
  const newCurrent: Combatant = combatants[newIndex];
  console.log(newCurrent.entity.name);
  return newCurrent.entity.name;
};
export default function Arena() {
  const [defender, setDefender] = useState<string | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [attackAction, setAttackAction] = useState<AttackAction | null>(null);
  console.log({ combatants }, { entities });
  const [result, setResult] = useState<AttackResult | null>(null);
  useEffect(() => setEntities(generateEntities()), []);
  useEffect(() => {
    const combatants = entities.map((e) =>
      enterCombat(
        e,
        ["Gnoll_4", "Cultist_0", "Bandit_1"].includes(e.name) ? "red" : "blue"
      )
    );
    setCombatants(combatants);
    setCurrent(
      _.sortBy(combatants, "initiative").toReversed()[0]?.entity.name || null
    );
  }, [entities]);
  const defenderEntity = defender && getEntityByName(defender, entities);
  const queue: Combatant[] = useMemo(
    () =>
      _.sortBy(
        combatants.filter((c) => c.entity.state === "active"),
        "initiative"
      ).toReversed(),
    [combatants]
  );
  const currentCombatant: Combatant | null = useMemo(
    () => combatants.find((c) => c.entity.name === current) || null,
    [current]
  );
  console.log({ attackAction });
  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-40">
          <div className="text-sm ">
            {result && attackResultToString(result)}
          </div>
          <div>
            {defenderEntity && (
              <div className="flex flex-col gap-1 border rounded border-red-500 p-1">
                <div className="text-small">Defender</div>
                <EntityView
                  entity={defenderEntity}
                  onClick={() => {}}
                  onAttackAction={() => {}}
                />
              </div>
            )}
          </div>
          {entities
            .filter((ent) => ent !== defenderEntity)
            .map((e) => (
              <EntityView
                key={e.name}
                entity={e}
                onClick={setDefender}
                onAttackAction={(a) => {
                  console.log({ a }, defenderEntity);
                  if (defenderEntity && e.state === "active") {
                    const result = attackEntity(defenderEntity, a);
                    setResult(result);
                    if (result.type === "success") {
                      const newDefender = applyDamage(result, defenderEntity);
                      console.log("IN DAMAGE", newDefender);
                      setEntities((prev) =>
                        prev.map((d) =>
                          d.name === newDefender.name ? newDefender : d
                        )
                      );
                    }
                  }
                }}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1 w-40 border border-red-400">
          <div>
            {combatants
              .filter((c) => c.team == "red")
              .map((c) => (
                <div
                  key={c.entity.name}
                  onClick={() => {
                    if (attackAction) {
                      const result = attackEntity(c.entity, attackAction);
                      setResult(result);
                      if (result.type === "success") {
                        const newDefender = applyDamage(result, c.entity);
                        console.log("IN DAMAGE", newDefender);
                        setEntities((prev) =>
                          prev.map((d) =>
                            d.name === newDefender.name ? newDefender : d
                          )
                        );
                      }
                      if (current) setCurrent(nextCombatant(queue, current));

                      setAttackAction(null);
                    }
                  }}
                >
                  <CombatantViewMini combatant={c} />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 w-40 border border-blue-400">
          <div>
            {combatants
              .filter((c) => c.team == "blue")
              .map((c) => (
                <CombatantViewMini key={c.entity.name} combatant={c} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 border">
          <div>
            <button
              onClick={() => {
                if (current) setCurrent(nextCombatant(queue, current));
              }}
            >
              Skip turn
            </button>
            {currentCombatant &&
              currentCombatant.entity.attacks.map((attack) => (
                <div
                  className={
                    " bg-slate-200 border rounded-sm cursor-pointer " +
                    (attack.name === attackAction?.name
                      ? "border-2 border-black"
                      : "")
                  }
                  key={attack.name}
                  onClick={() => setAttackAction(attack)}
                >
                  {attack.name}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-2 border-black p-2">
        {queue.map((c) => (
          <div
            className={
              "w-20 border text-xs h-20 " +
              (c.entity.name === current ? "bg-red-300" : "bg-white")
            }
            key={c.entity.name}
          >
            {c.entity.name}
          </div>
        ))}
      </div>
    </div>
  );
}
