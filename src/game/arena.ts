import _ from "lodash";
import { z } from "zod";
import * as entity from "./entity";
import * as roll from "./roll";
import { Entity } from "./entity";
import { AttackAction, DamageType, calculateMod } from "./monsters";
const teamSchema = z.union([z.literal("red"), z.literal("blue")]);

export type Team = z.infer<typeof teamSchema>;

export const combatantSchema = z.object({
  entity: entity.entitySchema,
  initiative: z.number(),
  team: teamSchema,
});

export type Combatant = z.infer<typeof combatantSchema>;

export const enterCombat = (entity: Entity, team: Team): Combatant => ({
  entity,
  team,
  initiative: calculateMod(entity.monster.dexterity) + roll.roll(roll.d20()),
});
const arenaSchema = z.object({
  combatants: z.record(combatantSchema),
  queue: z.array(z.string()),
  current: z.string().optional(),
  round: z.number().int(),
});

export type Arena = z.infer<typeof arenaSchema>;

export const establishQueue = (
  combatants: Record<string, Combatant>
): string[] =>
  _.sortBy(
    Object.values(combatants).filter((c) => c.entity.state != "dead"),
    "initiative"
  )
    .toReversed()
    .map((c) => c.entity.name);

export const initArena = (reds: Entity[], blues: Entity[]): Arena => {
  const combatantsList = reds
    .map((e) => enterCombat(e, "red"))
    .concat(blues.map((e) => enterCombat(e, "blue")));
  const combatants = Object.fromEntries(
    combatantsList.map((c) => [c.entity.name, c])
  );
  const queue: string[] = establishQueue(combatants);
  const current: string = queue[0];
  return { combatants, queue, current, round: 1 };
};

export const nextInQueue = (
  queue: string[],
  current: string
): [string, boolean] => {
  const index = queue.findIndex((c) => c === current) + 1;
  const [newIndex, endRound] =
    index >= queue.length ? [0, true] : [index, false];
  const newCurrent: string = queue[newIndex];
  console.log(newCurrent, { endRound });
  return [newCurrent, endRound];
};

export const advanceQueueInArena = (arena: Arena): Arena => {
  if (!arena.current) return arena;
  const [newCurrent, endRound] = nextInQueue(arena.queue, arena.current);
  const newRound = endRound ? arena.round + 1 : arena.round;
  return { ...arena, current: newCurrent, round: newRound };
};

export const currentTeam = (
  combatants: Record<string, Combatant>,
  current?: string
): Team | undefined =>
  current !== undefined ? combatants[current].team : undefined;

export const oppositeTeam = (t: Team) => (t === "red" ? "blue" : "red");

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
    : {
        ...defender,
        currentHP: defender.currentHP - result.damageTotal,
        state: defender.currentHP - result.damageTotal > 0 ? "active" : "dead",
      };

export const updateCombatant = (
  combatants: Record<string, Combatant>,
  id: string,
  fn: (c: Combatant) => Combatant
): Record<string, Combatant> => {
  const combatant = combatants[id];
  if (!combatant) return combatants;
  return { ...combatants, [id]: fn(combatant) };
};

export const attack = (
  arena: Arena,
  defenderId: string,
  attackAction: AttackAction
): [Arena, undefined | AttackResult] => {
  const defender = arena.combatants[defenderId];
  if (!defender) return [arena, undefined];
  const result = attackEntity(defender.entity, attackAction);

  if (result.type === "success") {
    const newDefender = applyDamage(result, defender.entity);
    console.log("IN DAMAGE", newDefender);
    const newCombatants = updateCombatant(
      arena.combatants,
      defenderId,
      (c) => ({
        ...c,
        entity: newDefender,
      })
    );
    return [
      advanceQueueInArena({
        ...arena,
        combatants: newCombatants,
        queue: establishQueue(newCombatants),
      }),
      result,
    ];
  } else return [advanceQueueInArena(arena), result];
};
