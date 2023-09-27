import {
  Monster,
  calculateMod,
  Action,
  isAttackAction,
  getAttackTypeFromDesc,
} from "@/game/monsters";
import { averageRollResult, parseRoll } from "@/game/roll";
import React from "react";

type MonsterViewProps = {
  monster: Monster;
};

const showNumberWithSign = (x: number): string => (x >= 0 ? "+" + x : "" + x);

const characteristics: [string, (m: Monster) => number][] = [
  ["STR", (m: Monster) => m.strength],
  ["DEX", (m: Monster) => m.dexterity],
  ["CON", (m: Monster) => m.constitution],
  ["INT", (m: Monster) => m.intelligence],
  ["WIS", (m: Monster) => m.wisdom],
  ["CHA", (m: Monster) => m.charisma],
];

const showCharacteristic = (
  monster: Monster,
  name: string,
  fn: (m: Monster) => number
) => (
  <div key={name} className="flex flex-col justify-center items-center">
    <div className="font-bold">{name}</div>
    <div>
      {fn(monster)} ({showNumberWithSign(calculateMod(fn(monster)))})
    </div>
  </div>
);

const showAction = (a: Action) => (
  <div key={a.name}>
    <div className="">
      {isAttackAction(a) ? (
        <div className="">
          <span className="font-bold italic">{a.name}. </span>
          <span className="italic">{getAttackTypeFromDesc(a.desc)}:</span>
          <span>
            {" "}
            {showNumberWithSign(a.attack_bonus)} to hit. Hit:{" "}
            {a.damage
              .map(
                (d) =>
                  averageRollResult(parseRoll(d.damage_dice)) +
                  " (" +
                  d.damage_dice +
                  ") " +
                  d.damage_type.name.toLowerCase()
              )
              .join(", ")}
          </span>
        </div>
      ) : (
        <div>
          <span className="font-bold italic">{a.name}.</span>
          <div className="italic">{a.desc}</div>
        </div>
      )}
    </div>
  </div>
);

export default function MonsterView({ monster }: MonsterViewProps) {
  return (
    <div className="flex flex-col border p-1 w-[500px]">
      <div className="font-bold text-lg text-amber-900">{monster.name}</div>
      <div className="italic">
        {monster.size} {monster.type}, {monster.alignment}
      </div>

      <div className="flex gap-1">
        <span className="font-bold"> Armor Class</span>{" "}
        {monster.armor_class.map((ac) => (
          <div key={ac.type}>
            {ac.value} ({ac.type})
          </div>
        ))}
      </div>
      <div>
        <span className="font-bold">Hit Points</span> {monster.hit_points} (
        {monster.hit_dice})
      </div>
      <div>
        <span className="font-bold">Speed</span>{" "}
        {Object.entries(monster.speed)
          .map((x) =>
            x[0] == "walk"
              ? x[1]
              : x[0] == "hover"
              ? "(hover)"
              : x[0] + " " + x[1]
          )
          .join(", ")}
      </div>
      <div className="border-y border-black flex justify-between px-4">
        {characteristics.map((char) =>
          showCharacteristic(monster, char[0], char[1])
        )}
      </div>
      <div>
        <span className="font-bold">Challenge</span> {monster.challenge_rating}{" "}
        ({monster.xp} XP)
      </div>
      <div>{monster.actions?.map(showAction)}</div>
    </div>
  );
}
