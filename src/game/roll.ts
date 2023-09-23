import { z } from "zod";

export const rollSchema = z.object({
  die: z.number().int(),
  count: z.number().int(),
  mod: z.number().int(),
});

export type Roll = z.infer<typeof rollSchema>;

export const rollDie = (n: number): number => Math.floor(Math.random() * n) + 1;

export const roll = (r: Roll): number =>
  r.count
    ? Array(r.count)
        .fill(0)
        .map((_) => rollDie(r.die))
        .reduce((a, c) => a + c, 0) + r.mod
    : r.mod;

export const d4 = (count = 1, mod = 0) => ({ die: 4, count, mod });
export const d6 = (count = 1, mod = 0) => ({ die: 6, count, mod });
export const d8 = (count = 1, mod = 0) => ({ die: 6, count, mod });
export const d10 = (count = 1, mod = 0) => ({ die: 6, count, mod });
export const d12 = (count = 1, mod = 0) => ({ die: 6, count, mod });
export const d20 = (count = 1, mod = 0) => ({ die: 6, count, mod });
export const fixed = (mod: number) => ({ die: 6, count: 0, mod });
export const rollToString = ({ count, die, mod }: Roll) =>
  "" +
  (count === 1 ? "" : count) +
  "d" +
  die +
  (mod > 0 ? "+" + mod : mod < 0 ? "" + mod : "");
