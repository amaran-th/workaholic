import { Handle, Position } from "@xyflow/react";

function IntersectionNode({ data }: { data: any }) {
  return (
    <div className="-translate-3">
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
      <Handle type="target" position={Position.Bottom} isConnectable={false} />
      <Handle type="source" position={Position.Top} isConnectable={false} />
      <div className="size-6 bg-white border-4 border-black rotate-45"></div>
    </div>
  );
}

export default IntersectionNode;
