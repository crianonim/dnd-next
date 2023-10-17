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

import React, { useEffect } from "react";
import Arena from "../components/arena";

export default function ArenaPage() {
  const { initArena } = useStore();

  useEffect(() => {
    const [reds, blues] = _.partition(generateEntities(), (e) =>
      ["Gnoll_4", "Cultist_0", "Bandit_1"].includes(e.name)
    );
    initArena(reds, blues);
  }, []);

  return <Arena />;
}
