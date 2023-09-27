import { z } from "zod";
import {
  AttackAction,
  DamageType,
  Monster,
  attackActionSchema,
  getMonsterByName,
  isAttackAction,
} from "./monsters";
import _ from "lodash";
import * as roll from "./roll";

const entitySchema = z.object({
  name: z.string(),
  maxHP: z.number().int(),
  ac: z.number().int(),
  currentHP: z.number().int(),
  monsterName: z.string(),
  attacks: z.array(attackActionSchema),
});

const generateMonsterName = (m: Monster, id: string): string => m.name + id;

export const spawnMonster = (m: Monster, id: string): Entity => {
  const hp = roll.roll(roll.parseRoll(m.hit_points_roll));
  return {
    name: generateMonsterName(m, id),
    maxHP: hp,
    currentHP: hp,
    // todo - multiple acs
    ac: m.armor_class.reduce((acc, cur) => Math.max(cur.value, acc), 0),
    monsterName: m.name,
    attacks: m.actions ? m.actions.filter(isAttackAction) : [],
  };
};
export type Entity = z.infer<typeof entitySchema>;

export const generateEntities: () => Entity[] = () =>
  ["Cultist", "Bandit", "Gnoll", "Bat", "Orc", "Orc", "Orc"]
    .map(getMonsterByName)
    .map((m, i) => spawnMonster(m, "_" + i));

export type AttackResult =
  | { type: "failure"; attackTotal: number }
  | {
      type: "success";
      attackTotal: number;
      damageTotal: number;
      damageDetails: [number, DamageType][];
    };

export const attackEntity = (
  defender: Entity,
  attackAction: AttackAction
): AttackResult => {
  const attackRoll = roll.roll(roll.d20());
  const attackTotal = attackRoll + attackAction.attack_bonus;
  const success = attackTotal >= defender.ac;

  if (!success) {
    console.log(
      `Attack ${attackTotal} (${attackRoll} + ${attackAction.attack_bonus}) against AC ${defender.ac} failed`
    );
    return {
      type: "failure",
      attackTotal,
    };
  }
  const damageDetails: [number, DamageType][] = attackAction.damage.map(
    (dam) => [roll.roll(roll.parseRoll(dam.damage_dice)), dam.damage_type.name]
  );
  const damageTotal = damageDetails.reduce(
    (acc, cur: [number, DamageType]) => cur[0] + acc,
    0
  );

  console.log(
    `Attack ${attackTotal} (${attackRoll} + ${
      attackAction.attack_bonus
    }) against AC ${defender.ac} ${
      success ? ` succeeded and dealt ${damageTotal} dmg ` : " failed"
    }`
  );
  return { type: "success", attackTotal, damageTotal, damageDetails };
};

export const attackResultToString = (result: AttackResult): string =>
  result.type === "success"
    ? `Attack roll ${result.attackTotal} was successful and dealt ${result.damageTotal} damage.`
    : `Attack roll ${result.attackTotal} was unsuccessful`;

export const applyDamage = (result: AttackResult, defender: Entity): Entity =>
  result.type === "failure"
    ? defender
    : { ...defender, currentHP: defender.currentHP - result.damageTotal };
