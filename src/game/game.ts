import { z } from "zod";
import * as roll from "./roll";

const statSchema = z.number().int().positive();

type Stat = z.infer<typeof statSchema>;

const actionTypeSchema = z.union([
  z.literal("Weapon Melee Attack"),
  z.literal("Melee Spell Attack"),
]);

type ActionType = z.infer<typeof actionTypeSchema>;

const actionSchema = z.object({
  type: actionTypeSchema,
  toHit: z.number().int(),
  onHit: roll.rollSchema,
});

type Action = z.infer<typeof actionSchema>;

const statBlockSchema = z.object({
  name: z.string(),
  ac: statSchema,
  hp: statSchema,
  str: statSchema,
  dex: statSchema,
  con: statSchema,
  int: statSchema,
  wis: statSchema,
  cha: statSchema,
  actions: z.array(actionSchema),
});

type StatBlock = z.infer<typeof statBlockSchema>;

const instanceStatBlock = statBlockSchema.extend({
  currentHp: z.number().int(),
});

const exampleStatBlock: StatBlock = {
  name: "Badger",
  ac: 10,
  hp: 3,
  str: 4,
  dex: 11,
  con: 12,
  int: 2,
  wis: 12,
  cha: 5,
  actions: [{ type: "Weapon Melee Attack", toHit: 2, onHit: roll.fixed(1) }],
};

export type InstanciatedStatBlock = z.infer<typeof instanceStatBlock>;

export const instanciateStatBlock = (sb: StatBlock): InstanciatedStatBlock => ({
  ...sb,
  currentHp: sb.hp,
});
