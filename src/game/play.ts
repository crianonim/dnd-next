import * as roll from "./roll";

for (let i = 0; i++; i < 10) {
  console.log(roll.roll({ count: 2, die: 6, mod: 2 }));
}

export const fixed = roll.roll(roll.fixed(100));
export const a = Array(100000)
  .fill(0)
  .map((_) => roll.roll(roll.d4(2)));
