import {
  Arena,
  advanceQueueInArena,
  initArena,
  AttackResult,
  attack,
} from "@/game/arena";
import { Entity } from "@/game/entity";
import { AttackAction } from "@/game/monsters";
import _ from "lodash";
import { create } from "zustand";

type Actions = {
  nextCombatant: () => void;
  initArena: (reds: Entity[], blues: Entity[]) => void;
  attack: (
    arena: Arena,
    defenderId: string,
    attackAction: AttackAction
  ) => AttackResult | undefined;
};
export const useStore = create<{ arena: Arena } & Actions>((set) => ({
  arena: {
    combatants: {},
    queue: [],
    round: 1,
  },

  nextCombatant: () =>
    set((state) => ({ arena: advanceQueueInArena(state.arena) })),
  initArena: (reds: Entity[], blues: Entity[]) =>
    set(() => ({ arena: initArena(reds, blues) })),
  attack: (arena: Arena, defenderId: string, attackAction: AttackAction) => {
    const [newArena, result] = attack(arena, defenderId, attackAction);
    set(() => ({ arena: newArena }));
    return result;
  },
}));
