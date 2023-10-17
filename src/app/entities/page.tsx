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
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import EntityMiniView from "../components/entityMini";
import { useStore } from "@/store/arenaStore";
import EntitiesSetup from "../components/entitiesSetup";

const EntitiesSetupPage = () => {
  const setEntities = useStore((store) => store.setEntities);

  useEffect(() => {
    setEntities(generateEntities());
  }, []);

  return <EntitiesSetup />;
};

export default EntitiesSetupPage;
