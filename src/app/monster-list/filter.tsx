"use client";
import { allMonsterTypes } from "@/game/monsters";
import { Select, Space } from "antd";
export type MonsterFilterProps = {
  onChange: (value: string) => void;
};
export default function MonsterFilter({ onChange }: MonsterFilterProps) {
  return (
    <div>
      <Space wrap>
        <Select
          defaultValue="humanoid"
          style={{ width: 120 }}
          onChange={onChange}
          options={allMonsterTypes.map((type) => ({
            value: type,
            label: type,
          }))}
        />
      </Space>
    </div>
  );
}
