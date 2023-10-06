import { z } from "zod";
import {
  AttackAction,
  DamageType,
  Monster,
  attackActionSchema,
  calculateMod,
  getMonsterByName,
  isAttackAction,
  monsterSchema,
} from "./monsters";
import _ from "lodash";
import * as roll from "./roll";

export const entityStateSchema = z.union([
  z.literal("active"),
  z.literal("dead"),
]);

export type EntityState = z.infer<typeof entityStateSchema>;

export const entitySchema = z.object({
  name: z.string(),
  state: entityStateSchema,
  maxHP: z.number().int(),
  ac: z.number().int(),
  currentHP: z.number().int(),
  monsterName: z.string(),
  attacks: z.array(attackActionSchema),
  monster: monsterSchema,
});

const generateMonsterName = (m: Monster, id: string): string => m.name + id;

export const spawnMonster = (m: Monster, id: string): Entity => {
  const hp = roll.roll(roll.parseRoll(m.hit_points_roll));
  return {
    name: generateMonsterName(m, id),
    state: "active",
    maxHP: hp,
    currentHP: hp,
    // todo - multiple acs
    ac: m.armor_class.reduce((acc, cur) => Math.max(cur.value, acc), 0),
    monsterName: m.name,
    attacks: m.actions ? m.actions.filter(isAttackAction) : [],
    monster: m,
  };
};
export type Entity = z.infer<typeof entitySchema>;

export const generateEntities: () => Entity[] = () =>
  ["Cultist", "Bandit", "Gnoll", "Bat", "Orc", "Orc", "Orc"]
    .map(getMonsterByName)
    .map((m, i) => spawnMonster(m, "_" + i));
