"use client";
import Roller from "../features/roller";
import { useState } from "react";

import React from "react";

export default function RollerPage() {
  const [result, setResult] = useState(0);
  return (
    <div className="flex items-center gap-2">
      <Roller setResult={setResult} />
      <div>{result}</div>
    </div>
  );
}
