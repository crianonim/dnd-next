"use client";
import { useState } from "react";
import EntitiesSetup from "./components/entitiesSetup";
import MonsterList from "./monster-list/page";
import { useStore } from "@/store/arenaStore";
import { Entity } from "@/game/entity";
import Arena from "./components/arena";

const getEntityByName = (entities: Entity[], name: string) =>
  entities.find((e) => e.name === name);

export default function Home() {
  const [step, setStep] = useState<"monsters" | "entities" | "arena">(
    "entities"
  );
  const entities = useStore((store) => store.entities);
  const initArena = useStore((store) => store.initArena);
  const blues = useStore((store) => store.blues);
  const reds = useStore((store) => store.reds);
  return (
    <div>
      {step == "entities" ? (
        <div>
          <button onClick={() => setStep("monsters")}>
            Spawn from Monster list
          </button>
          {blues.length > 0 && reds.length > 0 ? (
            <button
              onClick={() => {
                initArena(
                  reds
                    .map((e: string) => getEntityByName(entities, e))
                    .filter((x): x is Entity => !!x),

                  blues
                    .map((e: string) => getEntityByName(entities, e))
                    .filter((x): x is Entity => !!x)
                );
                setStep("arena");
              }}
            >
              Go to the Arena
            </button>
          ) : (
            <p>Make sure each team has at least one member!</p>
          )}
          <EntitiesSetup />{" "}
        </div>
      ) : step === "arena" ? (
        <Arena />
      ) : (
        <div>
          <button onClick={() => setStep("entities")}>
            Back to Team select
          </button>
          <MonsterList />
        </div>
      )}
    </div>
  );
}
