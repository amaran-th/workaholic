"use client";

import {
  patchPositionApi,
  useGetCenterPositionQuery,
} from "@/features/member/member-api";
import { quadrantColorMap } from "@/lib/data";
import {
  selectedDateAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edge, Node } from "@xyflow/react";
import { useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { patchTaskPositionApi, useGetMatrixTasksQuery } from "../task-api";
import { EdgeType, NodeType } from "../types/task";

export default function useMatrixFlow(
  setNodes: Dispatch<SetStateAction<Node[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>
) {
  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const queryClient = useQueryClient();
  const [localBorderPosition, setLocalBorderPosition] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({ left: 0, right: 0, top: 0, bottom: 0 });
  const { data: centerPosition } = useGetCenterPositionQuery();

  useEffect(() => {
    if (centerPosition) {
      setLocalBorderPosition(centerPosition);
    }
  }, [centerPosition]);
  const { data: tasks } = useGetMatrixTasksQuery(taskFilter);

  const [currentNodesFetching, setCurrentNodesFetching] =
    useState<boolean>(true);

  const patchTask = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: { positionX: number; positionY: number; positionDate: string };
    }) => patchTaskPositionApi({ taskId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });

  const updatePosition = useMutation({
    mutationFn: patchPositionApi,
    onSuccess: () => {
      // 성공 시 캐시 무효화 → centerPosition 재조회
      queryClient.invalidateQueries({
        queryKey: ["member-position"],
      });
    },
  });

  useEffect(() => {
    if (!tasks || !centerPosition) {
      return;
    }

    const initialNodes: Node[] = [
      {
        id: "q1",
        position: {
          x: centerPosition.left,
          y: centerPosition.top,
        },
        data: {
          bgcolor: quadrantColorMap.FIRST,
          right: 0,
          left: centerPosition.left,
          bottom: 0,
          top: centerPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q2",
        position: {
          x: 0,
          y: centerPosition.top,
        },
        data: {
          bgcolor: quadrantColorMap.SECOND,
          right: centerPosition.right,
          left: 0,
          bottom: 0,
          top: centerPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q3",
        position: {
          x: centerPosition.left,
          y: 0,
        },
        data: {
          bgcolor: quadrantColorMap.THIRD,
          right: 0,
          left: centerPosition.left,
          bottom: centerPosition.bottom,
          top: 0,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q4",
        position: {
          x: 0,
          y: 0,
        },
        data: {
          bgcolor: quadrantColorMap.FORTH,
          right: centerPosition.right,
          left: 0,
          bottom: centerPosition.bottom,
          top: 0,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "left",
        position: {
          x: centerPosition.left,
          y: centerPosition.top,
        },
        data: {
          type: "horizon",
          height: centerPosition.bottom - centerPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "right",
        position: {
          x: centerPosition.right,
          y: centerPosition.top,
        },
        data: {
          type: "horizon",
          height: centerPosition.bottom - centerPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "top",
        position: {
          x: centerPosition.left,
          y: centerPosition.top,
        },
        data: {
          type: "vertical",
          width: centerPosition.right - centerPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "bottom",
        position: {
          x: centerPosition.left,
          y: centerPosition.bottom,
        },
        data: {
          type: "vertical",
          width: centerPosition.right - centerPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "top-left",
        position: {
          x: centerPosition.left,
          y: centerPosition.top,
        },
        data: {
          type: "top-left",
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "top-right",
        position: {
          x: centerPosition.right,
          y: centerPosition.top,
        },
        data: {
          type: "top-right",
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "bottom-left",
        position: {
          x: centerPosition.left,
          y: centerPosition.bottom,
        },
        data: {
          type: "bottom-left",
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "bottom-right",
        position: {
          x: centerPosition.right,
          y: centerPosition.bottom,
        },
        data: {
          type: "bottom-right",
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "center",
        position: {
          x: 0,
          y: 0,
        },
        data: {},
        type: "intersection",
        deletable: false,
        selectable: false,
        draggable: false,
      },
      {
        id: "top-label",
        position: {
          x: -56,
          y: centerPosition.top - 48,
        },
        data: { value: "중요한 일" },
        type: "label",
        deletable: false,
        selectable: false,
        draggable: false,
      },
      {
        id: "left-label",
        position: {
          x: centerPosition.left - 128,
          y: -16,
        },
        data: { value: "급한 일" },
        type: "label",
        deletable: false,
        selectable: false,
        draggable: false,
      },
    ];

    const initialEdges: Edge[] = [
      {
        id: `center-right`,
        source: "center",
        target: "right",
        deletable: false,
        type: "axis",
      },
      {
        id: `left-center`,
        source: "left",
        target: "center",
        deletable: false,
        type: "axis",
      },
      {
        id: `center-bottom`,
        source: "center",
        target: "bottom",
        deletable: false,
        type: "axis",
      },
      {
        id: `top-center`,
        source: "top",
        target: "center",
        deletable: false,
        type: "axis",
      },
    ];

    const addNode = ({
      id,
      data,
      type,
      position,
    }: {
      id: string;
      data: any;
      type: NodeType;
      position: { x: number; y: number };
    }) => {
      initialNodes.push({
        id,
        position,
        data: {
          ...data,
          dragOver: "default",
        },
        type,
        deletable: false,
      } as Node);
    };

    const addEdge = (
      sourceId: string,
      targetId: string,
      type: EdgeType,
      option?: { sourceHandle?: string; targetHandle?: string }
    ) => {
      initialEdges.push({
        id: `e${sourceId}_${targetId}`,
        source: sourceId,
        target: targetId,
        type,
        deletable: false,
        data: {
          dragOver: "default",
        },
        ...option,
      } as Edge);
    };

    for (const task of tasks) {
      const { id, positionX: x, positionY: y } = task;
      addNode({
        id,
        data: task,
        type: "task",
        position: { x, y },
      });
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [tasks, centerPosition, setNodes, setEdges]);

  useEffect(() => {
    const { left, right, top, bottom } = localBorderPosition;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "q1") {
          return {
            ...n,
            position: { x: left, y: top },
            data: {
              ...n.data,
              left: left,
              top: top,
            },
          };
        }
        if (n.id === "q2") {
          return {
            ...n,
            position: { ...n.position, y: top },
            data: {
              ...n.data,
              right: right,
              top: top,
            },
          };
        }
        if (n.id === "q3") {
          return {
            ...n,
            position: { ...n.position, x: left },
            data: {
              ...n.data,
              left: left,
              bottom: bottom,
            },
          };
        }
        if (n.id === "q4") {
          return {
            ...n,
            data: {
              ...n.data,
              right: right,
              bottom: bottom,
            },
          };
        }
        if (n.id === "left") {
          return {
            ...n,
            position: { x: left, y: top },
            data: {
              ...n.data,
              height: bottom - top,
            },
          };
        }
        if (n.id === "right") {
          return {
            ...n,
            position: { x: right, y: top },
            data: {
              ...n.data,
              height: bottom - top,
            },
          };
        }
        if (n.id === "top") {
          return {
            ...n,
            position: { x: left, y: top },
            data: {
              ...n.data,
              width: right - left,
            },
          };
        }
        if (n.id === "bottom") {
          return {
            ...n,
            position: { x: left, y: bottom },
            data: {
              ...n.data,
              width: right - left,
            },
          };
        }
        if (n.id === "top-left") {
          return {
            ...n,
            position: { x: left, y: top },
          };
        }
        if (n.id === "top-right") {
          return {
            ...n,
            position: { x: right, y: top },
          };
        }
        if (n.id === "bottom-left") {
          return {
            ...n,
            position: { x: left, y: bottom },
          };
        }
        if (n.id === "bottom-right") {
          return {
            ...n,
            position: { x: right, y: bottom },
          };
        }
        if (n.id === "top-label") {
          return {
            ...n,
            position: { ...n.position, y: top - 48 },
          };
        }
        if (n.id === "left-label") {
          return {
            ...n,
            position: { ...n.position, x: left - 128 },
          };
        }
        return n;
      })
    );
  }, [localBorderPosition, setNodes]);

  const handleNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!selectedDate || node.type === "task") return;

      if (node.id === "left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          left: Math.min(node.position.x, 0),
        }));
      } else if (node.id === "right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          right: Math.max(node.position.x, 0),
        }));
      } else if (node.id === "top") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, 0),
        }));
      } else if (node.id === "bottom") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, 0),
        }));
      } else if (node.id === "top-left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, 0),
          left: Math.min(node.position.x, 0),
        }));
      } else if (node.id === "top-right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, 0),
          right: Math.max(node.position.x, 0),
        }));
      } else if (node.id === "bottom-left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, 0),
          left: Math.min(node.position.x, 0),
        }));
      } else if (node.id === "bottom-right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, 0),
          right: Math.max(node.position.x, 0),
        }));
      }
    },
    [selectedDate]
  );

  const handleNodeDragStop = async (event: React.MouseEvent, node: Node) => {
    if (!selectedDate) return;
    if (
      [
        "left",
        "right",
        "top",
        "bottom",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ].includes(node.id)
    ) {
      // 1) API 호출해서 새 좌표 저장
      updatePosition.mutate(localBorderPosition);
    } else if (node.type === "task") {
      // console.log("업무 드래그 종료:", node, selectedDate, node.position);
      patchTask.mutate({
        taskId: node.id,
        data: {
          positionX: node.position.x,
          positionY: node.position.y,
          positionDate: selectedDate.format(),
        },
      });
    }
  };
  return {
    currentNodesFetching,
    handleNodeDrag,
    handleNodeDragStop,
  };
}
