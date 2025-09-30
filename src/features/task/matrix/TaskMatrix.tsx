"use client";

import AxisEdge from "@/features/task/matrix/edges/AxisEdge";
import useMatrixFlow from "@/features/task/matrix/hooks/useMatrixFlow";
import AxisEndPointNode from "@/features/task/matrix/nodes/AxisEndPointNode";
import IntersectionNode from "@/features/task/matrix/nodes/IntersectionNode";
import TaskNode from "@/features/task/matrix/nodes/TaskNode";

import {
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import QuadrantNode from "./nodes/QuadrantNode";

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
  const { getZoom } = useReactFlow();
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
