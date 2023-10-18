"use client";
import { allMonsterTypes } from "@/game/monsters";
import { Checkbox, Select, Space } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
export type MonsterFilterProps = {
  onTypeChange: (value: string) => void;
  onDetailsChange: (e: CheckboxChangeEvent) => void;
};
export default function MonsterFilter({
  onTypeChange,
  onDetailsChange,
}: MonsterFilterProps) {
  return (
    <div>
      <Space wrap>
        <Checkbox onChange={onDetailsChange}>Details</Checkbox>
        <Select
          defaultValue="humanoid"
          style={{ width: 120 }}
          onChange={onTypeChange}
          options={allMonsterTypes.map((type) => ({
            value: type,
            label: type,
          }))}
        />
      </Space>
    </div>
  );
}
