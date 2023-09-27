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
export const allMonsterTypes = monsterTypeSchema.options.map((x) => x.value);

export type MonsterType = z.infer<typeof monsterTypeSchema>;

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

export type DamageType = z.infer<typeof damageTypeSchema>;
const damageSchema = z.object({
  damage_type: z.object({ name: damageTypeSchema }),
  damage_dice: z.string(),
});

export const attackActionSchema = z.object({
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

export const getMonsterByName = (name: string): Monster =>
  monsters.find((x) => x.name === name) || thug;

export const calculateMod = (x: number) => Math.floor((x - 10) / 2);

export const thug: Monster = {
  name: "Thug",
  type: "humanoid",
  alignment: "any non-good alignment",
  size: "Medium",
  armor_class: [{ type: "armor", value: 11 }],
  hit_points: 32,
  hit_dice: "5d8",
  hit_points_roll: "5d8+10",
  speed: { walk: "30 ft." },
  strength: 15,
  dexterity: 11,
  constitution: 14,
  intelligence: 10,
  wisdom: 10,
  charisma: 11,
  challenge_rating: 0.5,
  xp: 100,
  actions: [
    { name: "Multiattack", desc: "The thug makes two melee attacks." },
    {
      name: "Mace",
      desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) bludgeoning damage.",
      attack_bonus: 4,
      damage: [{ damage_type: { name: "Bludgeoning" }, damage_dice: "1d6+2" }],
    },
    {
      name: "Heavy Crossbow",
      desc: "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage.",
      attack_bonus: 2,
      damage: [{ damage_type: { name: "Piercing" }, damage_dice: "1d10" }],
    },
  ],
};
