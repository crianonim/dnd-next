"use client";
import {
  Entity,
  generateEntities,
  attackEntity,
  AttackResult,
  attackResultToString,
  applyDamage,
} from "@/game/entity";
import { AttackAction } from "@/game/monsters";

import React, { useEffect, useState } from "react";

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

const getEntityByName = (
  name: string,
  entities: Entity[]
): Entity | undefined => entities.find((e) => e.name === name);

export default function Arena() {
  const [defender, setDefender] = useState<string | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [result, setResult] = useState<AttackResult | null>(null);
  useEffect(() => setEntities(generateEntities()), []);
  const defenderEntity = defender && getEntityByName(defender, entities);
  return (
    <div>
      <div className="text-sm">{result && attackResultToString(result)}</div>
      <div className="flex flex-col gap-1 w-40">
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
    </div>
  );
}
