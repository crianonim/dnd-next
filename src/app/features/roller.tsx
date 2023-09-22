"use client";
import { Roll, roll, rollToString } from "@/game/roll";
import { Dispatch, SetStateAction, useState } from "react";

type RollerProps = {
  setResult: Dispatch<SetStateAction<number>>;
};

function Roller({ setResult }: RollerProps) {
  const [count, setCount] = useState("1");
  const [die, setDie] = useState("6");
  const [mod, setMod] = useState("0");

  const rollDef: Roll = {
    die: parseInt(die),
    count: parseInt(count) || 1,
    mod: parseInt(mod) || 0,
  };

  const rollRoller = () => setResult(roll(rollDef));
  return (
    <div className="flex p-1 border rounded gap-2 items-center">
      <input
        className="w-10"
        value={count}
        type="number"
        onChange={(e) => setCount(e.target.value)}
      />
      <select value={die} onChange={(e) => setDie(e.target.value)}>
        {[4, 6, 8, 10, 12, 20].map((d) => (
          <option key={d} value={d}>
            {"d" + d}
          </option>
        ))}
      </select>
      <input
        className="w-10"
        value={mod}
        type="number"
        onChange={(e) => setMod(e.target.value)}
      />

      <button
        className="border rounded p-1 bg-slate-800 text-white"
        onClick={rollRoller}
      >
        {" "}
        {rollToString(rollDef)}
      </button>
    </div>
  );
}

export default Roller;
