import _ from "lodash";
import monstersData from "./data/monsters.json";
import { z } from "zod";

const sizeSchema = z.union([
  z.literal("Gargantuan"),
  z.literal("Huge"),
  z.literal("Large"),
  z.literal("Medium"),
  z.literal("Small"),
  z.literal("Tiny"),
]);

const monsterTypeSchema = z.union([
  z.literal("aberration"),
  z.literal("humanoid"),
  z.literal("dragon"),
  z.literal("elemental"),
  z.literal("monstrosity"),
  z.literal("construct"),
  z.literal("beast"),
  z.literal("plant"),
  z.literal("fiend"),
  z.literal("ooze"),
  z.literal("fey"),
  z.literal("giant"),
  z.literal("celestial"),
  z.literal("undead"),
  z.literal("swarm of Tiny beasts"),
]);

export const acSchema = z.array(
  z.object({
    type: z.string(),
    value: z.number().int(),
  })
);

const damageTypeSchema = z.union([
  z.literal("Bludgeoning"),
  z.literal("Acid"),
  z.literal("Piercing"),
  z.literal("Slashing"),
  z.literal("Lightning"),
  z.literal("Poison"),
  z.literal("Fire"),
  z.literal("Cold"),
  z.literal("Radiant"),
  z.literal("Necrotic"),
  z.literal("Psychic"),
]);
const damageSchema = z.object({
  damage_type: z.object({ name: damageTypeSchema }),
  damage_dice: z.string(),
});

const attackActionSchema = z.object({
  name: z.string(),
  desc: z.string(),
  attack_bonus: z.number(),
  damage: z.array(damageSchema),
});

export type AttackAction = z.infer<typeof attackActionSchema>;
export const isAttackAction = (a: Action): a is AttackAction => {
  return "attack_bonus" in a;
};
const actionSchema = z.union([
  attackActionSchema,
  // else : TODO
  z.object({ name: z.string(), desc: z.string() }),
]);

export const getAttackTypeFromDesc = (desc: string) => desc.split(":")[0];

export type Action = z.infer<typeof actionSchema>;

export const monsterSchema = z.object({
  name: z.string(),
  type: monsterTypeSchema,
  alignment: z.string(),
  size: sizeSchema,
  armor_class: acSchema,
  hit_points: z.number().int(),
  hit_dice: z.string(),
  hit_points_roll: z.string(),
  speed: z.record(z.union([z.string(), z.boolean()])),
  //chars
  strength: z.number().int(),
  dexterity: z.number().int(),
  constitution: z.number().int(),
  intelligence: z.number().int(),
  wisdom: z.number().int(),
  charisma: z.number().int(),
  //xp
  challenge_rating: z.number(),
  xp: z.number(),
  actions: z.array(actionSchema).optional(),
});

export type Monster = z.infer<typeof monsterSchema>;

export const monsters = z.array(monsterSchema).parse(monstersData);

export const alignments = _.uniq(
  monsters.flatMap((x) =>
    x.actions?.flatMap((a) => {
      if ("damage" in a) {
        return a.damage.map((d) => d.damage_type.name);
      }
    })
  )
);

export const calculateMod = (x: number) => Math.floor((x - 10) / 2);
