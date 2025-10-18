import { cn } from "@/lib/utils";
import { NodeProps } from "@xyflow/react";

function AxisEndPointNode({
  data,
}: NodeProps & {
  data: {
    type:
      | "vertical"
      | "horizon"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
    width?: number;
    height?: number;
  };
}) {
  return (
    <div
      className={cn({
        "-translate-x-3": data.type !== "vertical",
        "-translate-y-3": data.type !== "horizon",
        "cursor-nwse-resize": ["top-left", "bottom-right"].includes(data.type),
        "cursor-nesw-resize": ["top-right", "bottom-left"].includes(data.type),
        "cursor-col-resize": data.type === "horizon",
        "cursor-row-resize": data.type === "vertical",
      })}
      style={{
        width: data.width ?? 24,
        height: data.height ?? 24,
      }}
    />
  );
}

export default AxisEndPointNode;
