"use client";
import * as play from "@/game/play";
import * as roll from "@/game/roll";
import _ from "lodash";
import Roller from "./features/roller";
import { useState } from "react";
export default function Home() {
  const [result, setResult] = useState(0);

  return (
    <div className="flex items-center gap-2">
      <Roller setResult={setResult} />
      <div>{result}</div>
    </div>
  );
}
