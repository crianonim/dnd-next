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
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";

import React, { useEffect, useState } from "react";
import Arena from "../components/arena";
import useStatus from "../hooks/useStatus";

export default function ArenaPage() {
  const { initArena, arena } = useStore();
  const [isInitialised, setIsInitialised] = useState(false);
  const status = useStatus(arena.combatants);
  console.log("Page", isInitialised, { status });
  useEffect(() => {
    const [reds, blues] = _.partition(generateEntities(), (e) =>
      ["Gnoll_4", "Cultist_0", "Bandit_1"].includes(e.name)
    );
    initArena(reds, blues);
    setIsInitialised(true);
  }, []);

  return (
    <div className="max-w-[800px] m-auto">
      {isInitialised ? (
        <div>
          {status !== "ongoing" && (
            <button
              onClick={() => {
                const [reds, blues] = _.partition(generateEntities(), (e) =>
                  ["Gnoll_4", "Cultist_0", "Bandit_1"].includes(e.name)
                );
                initArena(reds, blues);
              }}
            >
              Restart
            </button>
          )}{" "}
          <Arena />{" "}
        </div>
      ) : null}
    </div>
  );
}
