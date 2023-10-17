import { Entity } from "@/game/entity";

const EntityMiniView = ({ entity }: { entity: Entity }) => (
  <div className="border p-1 rounded">{entity.name}</div>
);
export default EntityMiniView;
