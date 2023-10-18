import { useStore } from "@/store/arenaStore";
import EntityMiniView from "./entityMini";
import { useMemo, useState } from "react";

const EntitiesSetup = () => {
  const entities = useStore((store) => store.entities);
  const blues = useStore((store) => store.blues);
  const reds = useStore((store) => store.reds);
  const setBlues = useStore((store) => store.setBlues);
  const setReds = useStore((store) => store.setReds);

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
      <div>
        <div></div>
        <div className="flex">
          <div
            className="w-40 border p-1"
            onDrop={() => {
              if (dragged && !unassigned.includes(dragged)) {
                setBlues(blues.filter((e) => e !== dragged));
                setReds(reds.filter((e) => e !== dragged));
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
                setBlues([...blues, dragged]);
                setReds(reds.filter((e) => e !== dragged));
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
                setBlues(blues.filter((e) => e !== dragged));
                setReds([...reds, dragged]);
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
    </div>
  );
};

export default EntitiesSetup;
