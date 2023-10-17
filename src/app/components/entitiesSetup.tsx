import { useStore } from "@/store/arenaStore";
import EntityMiniView from "./entityMini";
import { useMemo, useState } from "react";
import { Entity } from "@/game/entity";
import { isUndefined } from "lodash";
import Arena from "./arena";

const getEntityByName = (entities: Entity[], name: string) =>
  entities.find((e) => e.name === name);

const EntitiesSetup = () => {
  const entities = useStore((store) => store.entities);
  const initArena = useStore((store) => store.initArena);
  const [showArena, setShowArena] = useState(false);
  const [blues, setBlues] = useState<string[]>([]);
  const [reds, setReds] = useState<string[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);

  const unassigned = useMemo(
    () =>
      entities
        .map((e) => e.name)
        .filter((e) => !blues.includes(e) && !reds.includes(e)),
    [blues, reds, entities]
  );

  return (
    <div>
      {showArena ? (
        <Arena />
      ) : (
        <div>
          <div>
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
                  setShowArena(true);
                }}
              >
                Go to the Arena
              </button>
            ) : (
              <p>Make sure each team has at least one member!</p>
            )}
          </div>
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
        </div>
      )}
    </div>
  );
};

export default EntitiesSetup;
