"use client";
import { useState } from "react";
import EntitiesSetup from "./components/entitiesSetup";
import MonsterList from "./monster-list/page";
import { useStore } from "@/store/arenaStore";
import { Entity } from "@/game/entity";
import Arena from "./components/arena";
import { Button, Space } from "antd";

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
        <div className="flex flex-col items-start gap-1">
          <Space>
            <Button onClick={() => setStep("monsters")}>Spawn Monster</Button>
            {blues.length > 0 && reds.length > 0 ? (
              <Button
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
              </Button>
            ) : (
              <p className="text-sm">
                Make sure each team has at least one member!
              </p>
            )}
          </Space>
          <EntitiesSetup />{" "}
        </div>
      ) : step === "arena" ? (
        <div>
          <Space>
            <Button onClick={() => setStep("entities")}>Back to Teams</Button>
            <Button
              onClick={() => {
                initArena(
                  reds
                    .map((e: string) => getEntityByName(entities, e))
                    .filter((x): x is Entity => !!x),

                  blues
                    .map((e: string) => getEntityByName(entities, e))
                    .filter((x): x is Entity => !!x)
                );
              }}
            >
              Restart battle
            </Button>
          </Space>
          <Arena />
        </div>
      ) : (
        <div>
          <Button onClick={() => setStep("entities")}>Back to Teams</Button>
          <MonsterList />
        </div>
      )}
    </div>
  );
}
