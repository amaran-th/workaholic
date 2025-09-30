import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";

export default function AxisEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  return <BaseEdge id={id} path={edgePath} className="stroke-4 stroke-black" />;
}
