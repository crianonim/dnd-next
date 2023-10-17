import {
  AttackResult,
  Combatant,
  Team,
  attackResultToString,
} from "@/game/arena";
import { AttackAction } from "@/game/monsters";
import { useStore } from "@/store/arenaStore";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TeamView from "./teamView";
import { isNull } from "lodash";
import useStatus from "../hooks/useStatus";

export default function Arena() {
  const { arena, nextCombatant, attack } = useStore();
  const { round, combatants, queue, current } = arena;
  const [attackAction, setAttackAction] = useState<AttackAction | null>(null);
  const [result, setResult] = useState<AttackResult | undefined>();
  const [visibleQueue, setVisibleQueue] = useState(
    queue.slice(queue.findIndex((e) => e == current)).concat([
      "New Round",
      ...queue.slice(
        0,
        queue.findIndex((e) => e == current)
      ),
    ])
  );
  useEffect(() => {
    setVisibleQueue(
      queue.slice(queue.findIndex((e) => e == current)).concat([
        "New Round",
        ...queue.slice(
          0,
          queue.findIndex((e) => e == current)
        ),
      ])
    );
  }, [current, queue]);

  const currentCombatant: Combatant | undefined =
    current !== undefined ? combatants[current] : undefined;

  const currentTeam = currentCombatant?.team;
  const status = useStatus(combatants);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1 w-full">
        <div> Round: {round}</div>
        <div className="text-sm h-5">
          {result && attackResultToString(result)}
        </div>
      </div>
      <div>
        {status === "ongoing" ? (
          <motion.ul
            layoutId={"list"}
            className={
              "flex gap-2 border border-black p-2 overflow-auto items-center"
            }
          >
            <AnimatePresence initial={false}>
              {visibleQueue.map((c) => (
                <motion.li
                  transition={{
                    duration: 1,
                  }}
                  layout
                  key={c}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className={
                      "w-20 p-1 border-2 text-xs " +
                      (c === current
                        ? currentTeam == "red"
                          ? "border-red-300 font-bold border-4"
                          : "border-blue-300 font-bold border-4"
                        : "")
                    }
                    key={c}
                  >
                    {c}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {/* </Reorder.Group> */}
          </motion.ul>
        ) : (
          <div>The battle is over and the winning team is {status}</div>
        )}
      </div>

      <div className="flex flex-col gap-1 border text-sm">
        {status === "ongoing" && (
          <div className="flex  gap-1 p-1 ">
            {currentCombatant &&
              currentCombatant.entity.attacks.map((attack) => (
                <div
                  className={
                    "border flex justify-center rounded-sm cursor-pointer p-1 " +
                    (attack.name === attackAction?.name ? " border-black" : "")
                  }
                  key={attack.name}
                  onClick={() => setAttackAction(attack)}
                >
                  {attack.name}
                </div>
              ))}
            <button
              onClick={() => {
                nextCombatant();
                setAttackAction(null);
              }}
              className="border rounded-sm cursor-pointer p-1"
            >
              Skip turn
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col gap-1 grow border border-red-400">
          <TeamView
            team="red"
            current={current}
            combatants={combatants}
            isAttackPresent={!isNull(attackAction)}
            isCurrentTeam={currentTeam == "red"}
            onAttackedClick={(c) => {
              if (attackAction) {
                const result = attack(arena, c.entity.name, attackAction);
                setResult(result);
                setAttackAction(null);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1 grow border border-blue-400">
          <TeamView
            team="blue"
            current={current}
            combatants={combatants}
            isAttackPresent={!isNull(attackAction)}
            isCurrentTeam={currentTeam == "blue"}
            onAttackedClick={(c) => {
              if (attackAction) {
                const result = attack(arena, c.entity.name, attackAction);
                setResult(result);
                setAttackAction(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
