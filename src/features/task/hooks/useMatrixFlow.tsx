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
  const [localCenterPosition, setLocalCenterPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [localBorderPosition, setLocalBorderPosition] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({ left: 0, right: 0, top: 0, bottom: 0 });
  const { data: centerPosition } = useGetCenterPositionQuery();

  useEffect(() => {
    if (centerPosition) {
      const { centerX: x, centerY: y, ...rest } = centerPosition;
      setLocalCenterPosition({ x, y });
      setLocalBorderPosition(rest);
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
    if (!tasks || !localCenterPosition || !localBorderPosition) {
      return;
    }

    const initialNodes: Node[] = [
      {
        id: "q1",
        position: {
          x: localBorderPosition.left,
          y: localBorderPosition.top,
        },
        data: {
          bgcolor: quadrantColorMap.FIRST,
          right: localCenterPosition.x,
          left: localBorderPosition.left,
          bottom: localCenterPosition.y,
          top: localBorderPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q2",
        position: {
          x: localCenterPosition.x,
          y: localBorderPosition.top,
        },
        data: {
          bgcolor: quadrantColorMap.SECOND,
          right: localBorderPosition.right,
          left: localCenterPosition.x,
          bottom: localCenterPosition.y,
          top: localBorderPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q3",
        position: {
          x: localBorderPosition.left,
          y: localCenterPosition.y,
        },
        data: {
          bgcolor: quadrantColorMap.THIRD,
          right: localCenterPosition.x,
          left: localBorderPosition.left,
          bottom: localBorderPosition.bottom,
          top: localCenterPosition.y,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q4",
        position: {
          x: localCenterPosition.x,
          y: localCenterPosition.y,
        },
        data: {
          bgcolor: quadrantColorMap.FORTH,
          right: localBorderPosition.right,
          left: localCenterPosition.x,
          bottom: localBorderPosition.bottom,
          top: localCenterPosition.y,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "left",
        position: {
          x: localBorderPosition.left,
          y: localBorderPosition.top,
        },
        data: {
          type: "horizon",
          height: localBorderPosition.bottom - localBorderPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "right",
        position: {
          x: localBorderPosition.right,
          y: localBorderPosition.top,
        },
        data: {
          type: "horizon",
          height: localBorderPosition.bottom - localBorderPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "top",
        position: {
          x: localBorderPosition.left,
          y: localBorderPosition.top,
        },
        data: {
          type: "vertical",
          width: localBorderPosition.right - localBorderPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "bottom",
        position: {
          x: localBorderPosition.left,
          y: localBorderPosition.bottom,
        },
        data: {
          type: "vertical",
          width: localBorderPosition.right - localBorderPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
        selectable: false,
      },
      {
        id: "top-left",
        position: {
          x: localBorderPosition.left,
          y: localBorderPosition.top,
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
          x: localBorderPosition.right,
          y: localBorderPosition.top,
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
          x: localBorderPosition.left,
          y: localBorderPosition.bottom,
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
          x: localBorderPosition.right,
          y: localBorderPosition.bottom,
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
          x: localCenterPosition.x,
          y: localCenterPosition.y,
        },
        data: { dragOver: "default" },
        type: "intersection",
        deletable: false,
        selectable: false,
        extent: [
          [localBorderPosition.left, localBorderPosition.top], // 최소 좌표
          [localBorderPosition.right + 24, localBorderPosition.bottom + 24], // 최대 좌표
        ],
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
  }, [
    tasks,
    centerPosition,
    localCenterPosition,
    localBorderPosition,
    setNodes,
    setEdges,
  ]);

  useEffect(() => {
    const { x: centerX, y: centerY } = localCenterPosition;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "center") {
          return {
            ...n,
            position: { x: centerX, y: centerY },
          };
        }
        if (n.id === "q1") {
          return {
            ...n,
            data: {
              ...n.data,
              right: centerX,
              bottom: centerY,
            },
          };
        }
        if (n.id === "q2") {
          return {
            ...n,
            position: { ...n.position, x: centerX },
            data: {
              ...n.data,
              left: centerX,
              bottom: centerY,
            },
          };
        }
        if (n.id === "q3") {
          return {
            ...n,
            position: { ...n.position, y: centerY },
            data: {
              ...n.data,
              right: centerX,
              top: centerY,
            },
          };
        }
        if (n.id === "q4") {
          return {
            ...n,
            position: { x: centerX, y: centerY },
            data: {
              ...n.data,
              left: centerX,
              top: centerY,
            },
          };
        }
        return n;
      })
    );
  }, [localCenterPosition, setNodes]);

  useEffect(() => {
    const { left, right, top, bottom } = localBorderPosition;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "center") {
          return {
            ...n,
            extent: [
              [left, top], // 최소 좌표
              [right + 24, bottom + 24], // 최대 좌표
            ],
          };
        }
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
        return n;
      })
    );
  }, [localBorderPosition, setNodes]);

  const handleNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!selectedDate || node.type === "task") return;

      if (node.id === "center") {
        setLocalCenterPosition({
          x: node.position.x,
          y: node.position.y,
        });
      } else if (node.id === "left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          left: Math.min(node.position.x, localCenterPosition.x),
        }));
      } else if (node.id === "right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          right: Math.max(node.position.x, localCenterPosition.x),
        }));
      } else if (node.id === "top") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, localCenterPosition.y),
        }));
      } else if (node.id === "bottom") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, localCenterPosition.y),
        }));
      } else if (node.id === "top-left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, localCenterPosition.y),
          left: Math.min(node.position.x, localCenterPosition.x),
        }));
      } else if (node.id === "top-right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          top: Math.min(node.position.y, localCenterPosition.y),
          right: Math.max(node.position.x, localCenterPosition.x),
        }));
      } else if (node.id === "bottom-left") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, localCenterPosition.y),
          left: Math.min(node.position.x, localCenterPosition.x),
        }));
      } else if (node.id === "bottom-right") {
        setLocalBorderPosition((prev) => ({
          ...prev,
          bottom: Math.max(node.position.y, localCenterPosition.y),
          right: Math.max(node.position.x, localCenterPosition.x),
        }));
      }
    },
    [localCenterPosition, selectedDate]
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
      // console.log("센터 드래그 종료:", node.position);

      // 1) API 호출해서 새 좌표 저장
      updatePosition.mutate(localBorderPosition);
    } else if (node.type === "intersection") {
      updatePosition.mutate({
        centerX: localCenterPosition.x,
        centerY: localCenterPosition.y,
      });
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
