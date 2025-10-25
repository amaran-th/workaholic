"use client";

import AxisEdge from "@/lib/react-flow/edges/AxisEdge";
import AxisEndPointNode from "@/lib/react-flow/nodes/AxisEndPointNode";
import IntersectionNode from "@/lib/react-flow/nodes/IntersectionNode";
import QuadrantNode from "@/lib/react-flow/nodes/QuadrantNode";
import TaskNode from "@/lib/react-flow/nodes/TaskNode";
import {
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useMatrixFlow from "../../hooks/useMatrixFlow";

const nodeTypes = {
  task: TaskNode,
  quadrant: QuadrantNode,
  axisEndPoint: AxisEndPointNode,
  intersection: IntersectionNode,
};

const edgeTypes = {
  axis: AxisEdge,
};

function TaskMatrix() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { handleNodeDrag, handleNodeDragStop } = useMatrixFlow(
    setNodes,
    setEdges
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onNodeDragStart={onNodeDragStart}
      onNodeDrag={handleNodeDrag}
      onNodeDragStop={handleNodeDragStop}
      // onDrop={onDropNode}
      // onDragOver={onDragOver}
      minZoom={0.2}
      maxZoom={2}
      zoomOnDoubleClick={false}
      autoPanOnNodeDrag={false}
      fitView
    />
  );
}

export default TaskMatrix;
