"use client";

import { generateEntities } from "@/game/entity";
import _ from "lodash";
import { useEffect } from "react";
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
