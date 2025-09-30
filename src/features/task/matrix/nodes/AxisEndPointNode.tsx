import { cn } from "@/lib/utils";
import { NodeProps } from "@xyflow/react";

function AxisEndPointNode({
  data,
}: NodeProps & {
  data: { type: "vertical" | "horizon"; size: number };
}) {
  return (
    <div
      className={cn({
        "cursor-col-resize -translate-x-3": data.type === "horizon",
        "cursor-row-resize -translate-y-3": data.type === "vertical",
      })}
      style={{
        width: data.type === "horizon" ? 24 : data.size,
        height: data.type === "horizon" ? data.size : 24,
      }}
    />
  );
}

export default AxisEndPointNode;
