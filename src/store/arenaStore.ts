import {
  Arena,
  advanceQueueInArena,
  initArena,
  AttackResult,
  attack,
} from "@/game/arena";
import { Entity, spawnMonster } from "@/game/entity";
import { AttackAction, Monster } from "@/game/monsters";
import _ from "lodash";
import { create } from "zustand";

type Actions = {
  // ArenaActions
  nextCombatant: () => void;
  initArena: (reds: Entity[], blues: Entity[]) => void;
  attack: (
    arena: Arena,
    defenderId: string,
    attackAction: AttackAction
  ) => AttackResult | undefined;
  // Entities Actions
  setEntities: (entities: Entity[]) => void;
  spawnMonster: (monster: Monster) => void;
  setReds: (names: string[]) => void;
  setBlues: (names: string[]) => void;
};

type State = {
  arena: Arena;
  entities: Entity[];
  blues: string[];
  reds: string[];
};

export const useStore = create<State & Actions>((set) => ({
  arena: {
    combatants: {},
    queue: [],
    round: 1,
  },
  entities: [],
  blues: [],
  reds: [],
  nextCombatant: () =>
    set((state) => ({ arena: advanceQueueInArena(state.arena) })),
  initArena: (reds: Entity[], blues: Entity[]) =>
    set(() => ({ arena: initArena(reds, blues) })),
  attack: (arena: Arena, defenderId: string, attackAction: AttackAction) => {
    const [newArena, result] = attack(arena, defenderId, attackAction);
    set(() => ({ arena: newArena }));
    return result;
  },
  setEntities: (entities: Entity[]) => set(() => ({ entities })),
  spawnMonster: (monster: Monster) =>
    set(({ entities }) => {
      const newMonster = spawnMonster(monster, "_" + entities.length);
      return { entities: [...entities, newMonster] };
    }),
  setBlues: (names: string[]) => set(() => ({ blues: names })),
  setReds: (names: string[]) => set(() => ({ reds: names })),
}));
