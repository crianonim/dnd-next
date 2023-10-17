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

const EntitiesSetup = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [blues, setBlues] = useState<string[]>([]);
  const [reds, setReds] = useState<string[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  console.log({ dragged });
  useEffect(() => {
    setEntities(generateEntities());
  }, []);
  const unassigned = useMemo(
    () =>
      entities
        .map((e) => e.name)
        .filter((e) => !blues.includes(e) && !reds.includes(e)),
    [blues, reds, entities]
  );
  return (
    <div className="flex">
      <div
        className="w-40 border p-1"
        onDrop={() => {
          if (dragged && !unassigned.includes(dragged)) {
            setBlues((prev) => prev.filter((e) => e !== dragged));
            setReds((prev) => prev.filter((e) => e !== dragged));
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <div>Unassigned</div>
        {unassigned
          .map((e) => entities.find((en) => en.name === e))

          .map(
            (e) =>
              e && (
                <div
                  key={e.name}
                  draggable
                  onDragStart={() => setDragged(e.name)}
                >
                  <EntityMiniView entity={e} />
                </div>
              )
          )}
      </div>
      <div
        className="w-40 border border-blue-500 p-1"
        onDrop={() => {
          if (dragged && !blues.includes(dragged)) {
            setBlues((prev) => [...prev, dragged]);
            setReds((prev) => prev.filter((e) => e !== dragged));
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        {" "}
        <div>Blue Team</div>
        {blues
          .map((e) => entities.find((en) => en.name === e))

          .map(
            (e) =>
              e && (
                <div
                  key={e.name}
                  draggable
                  onDragStart={() => setDragged(e.name)}
                >
                  <EntityMiniView entity={e} />
                </div>
              )
          )}
      </div>
      <div
        className="w-40 border border-red-500 p-1"
        onDrop={() => {
          if (dragged && !reds.includes(dragged)) {
            setBlues((prev) => prev.filter((e) => e !== dragged));
            setReds((prev) => [...prev, dragged]);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <div>Red Team</div>
        {reds
          .map((e) => entities.find((en) => en.name === e))

          .map(
            (e) =>
              e && (
                <div
                  key={e.name}
                  draggable
                  onDragStart={() => setDragged(e.name)}
                >
                  <EntityMiniView entity={e} />
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default EntitiesSetup;
