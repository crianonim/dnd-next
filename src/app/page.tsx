"use client";
import { useState } from "react";
import EntitiesSetup from "./components/entitiesSetup";
import MonsterList from "./monster-list/page";

export default function Home() {
  const [step, setStep] = useState<"monsters" | "entities">("entities");
  return (
    <div>
      {step == "entities" ? (
        <div>
          <button onClick={() => setStep("monsters")}>
            Spawn from Monster list
          </button>
          <EntitiesSetup />{" "}
        </div>
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
