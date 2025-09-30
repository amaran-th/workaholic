import { NodeProps } from "@xyflow/react";

function QuadrantNode({
  data,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps & { data: { bgcolor: string; width: number; height: number } }) {
  return (
    <div
      style={{
        backgroundColor: data.bgcolor,
        width: data.width,
        height: data.height,
      }}
    >
      ({positionAbsoluteX}, {positionAbsoluteY})
    </div>
  );
}

export default QuadrantNode;
