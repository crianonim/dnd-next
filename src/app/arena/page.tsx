"use client";
import {
  AttackResult,
  Combatant,
  Team,
  attackResultToString,
  enterCombat,
} from "@/game/arena";
import { Entity, generateEntities } from "@/game/entity";
import { AttackAction } from "@/game/monsters";
import { useStore } from "@/store/arenaStore";
import _ from "lodash";

import React, { useEffect, useMemo, useState } from "react";

function CombatantViewMini({ combatant }: { combatant: Combatant }) {
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

export default function Arena() {
  const { arena, nextCombatant, initArena, attack } = useStore();
  const { round, combatants, queue, current } = arena;
  const [attackAction, setAttackAction] = useState<AttackAction | null>(null);
  const [result, setResult] = useState<AttackResult | undefined>();
  const currentCombatant =
    current !== undefined ? combatants[current] : undefined;
  const currentTeam = currentCombatant?.team;
  const oppositeTeam = currentTeam
    ? currentTeam === "red"
      ? "blue"
      : "red"
    : undefined;
  useEffect(() => {
    const [reds, blues] = _.partition(generateEntities(), (e) =>
      ["Gnoll_4", "Cultist_0", "Bandit_1"].includes(e.name)
    );
    initArena(reds, blues);
  }, []);

  const teamView = (team: Team) => (
    <div
      className={
        "flex flex-col gap-1 p-1 " +
        (attackAction && team === currentTeam ? "opacity-50" : "opacity-100")
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
                attackAction &&
                oppositeTeam === team &&
                c.entity.state !== "dead"
              ) {
                const result = attack(arena, c.entity.name, attackAction);
                setResult(result);
                setAttackAction(null);
              }
            }}
          >
            <CombatantViewMini combatant={c} />
            {c.entity.name === current && currentCombatant ? (
              <div className="flex flex-col gap-1 border text-sm">
                <div className="flex flex-col gap-1 p-1 ">
                  <button
                    onClick={() => {
                      nextCombatant();
                      setAttackAction(null);
                    }}
                    className="border rounded-sm cursor-pointer p-1"
                  >
                    Skip turn
                  </button>
                  {currentCombatant &&
                    currentCombatant.entity.attacks.map((attack) => (
                      <div
                        className={
                          "border flex justify-center rounded-sm cursor-pointer p-1 " +
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
            ) : (
              ""
            )}
          </div>
        ))}
    </div>
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1 w-full">
        <div> Round: {round}</div>
        <div className="text-sm h-5">
          {result && attackResultToString(result)}
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col gap-1 grow border border-red-400">
          {teamView("red")}
        </div>
        <div className="flex flex-col gap-1 grow border border-blue-400">
          {teamView("blue")}
        </div>
      </div>
      <div className="flex gap-2 border-2 border-black p-2 overflow-hidden">
        {}
        {queue
          .slice(queue.findIndex((e) => e == current))
          .concat([
            "New Round",
            ...queue.slice(
              0,
              queue.findIndex((e) => e == current)
            ),
          ])
          .map((c) => (
            <div
              className={
                "w-20 p-1 border-2 text-xs " +
                (c === current
                  ? currentTeam == "red"
                    ? "border-red-300 font-bold"
                    : "border-blue-300 font-bold"
                  : "")
              }
              key={c}
            >
              {c}
            </div>
          ))}
      </div>
    </div>
  );
}
