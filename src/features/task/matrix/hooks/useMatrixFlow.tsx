"use client";

import { sessionAtom } from "@/features/auth/store/sessionAtom";
import {
  updatePositionApi,
  useGetCenterPositionQuery,
} from "@/features/member/member-api";
import { MemberPosition } from "@/features/member/types/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edge, Node } from "@xyflow/react";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { patchTaskApi, useGetTasksQuery } from "../../task-api";
import { EdgeType, NodeType, PatchTaskRequest } from "../../types/task";
import { taskFilterAtom } from "../store/matrixAtom";

export default function useMatrixFlow(
  setNodes: Dispatch<SetStateAction<Node[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>
) {
  const [session] = useAtom(sessionAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const queryClient = useQueryClient();
  const [localCenterPosition, setLocalCenterPosition] =
    useState<MemberPosition>({
      centerX: 0,
      centerY: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    });

  const { data: centerPosition } = useGetCenterPositionQuery(
    { memberId: session!.user.id! },
    { enabled: !!session?.user?.id }
  );

  useEffect(() => {
    if (centerPosition) {
      setLocalCenterPosition(centerPosition);
    }
  }, [centerPosition]);
  const { data: tasks } = useGetTasksQuery(taskFilter, {
    enabled: !!session?.user?.id,
  });

  const [currentNodesFetching, setCurrentNodesFetching] =
    useState<boolean>(true);

  const patchTask = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: PatchTaskRequest;
    }) => patchTaskApi({ taskId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskFilter],
      });
    },
  });

  const updatePosition = useMutation({
    mutationFn: (vars: {
      memberId: string;
      left: number;
      right: number;
      top: number;
      bottom: number;
      centerX: number;
      centerY: number;
    }) => updatePositionApi(vars),
    onSuccess: () => {
      // 성공 시 캐시 무효화 → centerPosition 재조회
      queryClient.invalidateQueries({
        queryKey: ["member-position", { memberId: session!.user.id }],
      });
    },
  });

  useEffect(() => {
    if (!tasks || !localCenterPosition) {
      return;
    }

    const initialNodes: Node[] = [
      {
        id: "q1",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.top,
        },
        data: {
          bgcolor: "#EF2D2D",
          width: localCenterPosition.centerX - localCenterPosition.left,
          height: localCenterPosition.centerY - localCenterPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q2",
        position: {
          x: localCenterPosition.centerX,
          y: localCenterPosition.top,
        },
        data: {
          bgcolor: "#FF9999",
          width: localCenterPosition.right - localCenterPosition.centerX,
          height: localCenterPosition.centerY - localCenterPosition.top,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q3",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.centerY,
        },
        data: {
          bgcolor: "#FF7F44",
          width: localCenterPosition.centerX - localCenterPosition.left,
          height: localCenterPosition.bottom - localCenterPosition.centerY,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "q4",
        position: {
          x: localCenterPosition.centerX,
          y: localCenterPosition.centerY,
        },
        data: {
          bgcolor: "#D9D9D9",
          width: localCenterPosition.right - localCenterPosition.centerX,
          height: localCenterPosition.bottom - localCenterPosition.centerY,
        },
        className: "quadrant-node",
        type: "quadrant",
        deletable: false,
        draggable: false,
      },
      {
        id: "left",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.top,
        },
        data: {
          type: "horizon",
          height: localCenterPosition.bottom - localCenterPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "right",
        position: {
          x: localCenterPosition.right,
          y: localCenterPosition.top,
        },
        data: {
          type: "horizon",
          height: localCenterPosition.bottom - localCenterPosition.top,
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "top",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.top,
        },
        data: {
          type: "vertical",
          width: localCenterPosition.right - localCenterPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "bottom",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.bottom,
        },
        data: {
          type: "vertical",
          width: localCenterPosition.right - localCenterPosition.left,
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "top-left",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.top,
        },
        data: {
          type: "top-left",
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "top-right",
        position: {
          x: localCenterPosition.right,
          y: localCenterPosition.top,
        },
        data: {
          type: "top-right",
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "bottom-left",
        position: {
          x: localCenterPosition.left,
          y: localCenterPosition.bottom,
        },
        data: {
          type: "bottom-left",
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "bottom-right",
        position: {
          x: localCenterPosition.right,
          y: localCenterPosition.bottom,
        },
        data: {
          type: "bottom-right",
        },
        type: "axisEndPoint",
        deletable: false,
      },
      {
        id: "center",
        position: {
          x: localCenterPosition.centerX,
          y: localCenterPosition.centerY,
        },
        data: { dragOver: "default" },
        type: "intersection",
        deletable: false,
        extent: [
          [localCenterPosition.left, localCenterPosition.top], // 최소 좌표
          [localCenterPosition.right + 24, localCenterPosition.bottom + 24], // 최대 좌표
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
  }, [tasks, centerPosition]);

  useEffect(() => {
    const { centerX, centerY, left, right, top, bottom } = localCenterPosition;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "center") {
          return {
            ...n,
            position: { x: centerX, y: centerY },
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
              width: centerX - left,
              height: centerY - top,
            },
          };
        }
        if (n.id === "q2") {
          return {
            ...n,
            position: { x: centerX, y: top },
            data: {
              ...n.data,
              width: right - centerX,
              height: centerY - top,
            },
          };
        }
        if (n.id === "q3") {
          return {
            ...n,
            position: { x: left, y: centerY },
            data: {
              ...n.data,
              width: centerX - left,
              height: bottom - centerY,
            },
          };
        }
        if (n.id === "q4") {
          return {
            ...n,
            position: { x: centerX, y: centerY },
            data: {
              ...n.data,
              width: right - centerX,
              height: bottom - centerY,
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
  }, [localCenterPosition, setNodes]);

  const handleNodeDrag = (event: React.MouseEvent, node: Node) => {
    if (node.id === "center") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        centerX: node.position.x,
        centerY: node.position.y,
      }));
    }
    if (node.id === "left") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        left: Math.min(node.position.x, prev.centerX),
      }));
    }
    if (node.id === "right") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        right: Math.max(node.position.x, prev.centerX),
      }));
    }
    if (node.id === "top") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        top: Math.min(node.position.y, prev.centerY),
      }));
    }
    if (node.id === "bottom") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        bottom: Math.max(node.position.y, prev.centerY),
      }));
    }
    if (node.id === "top-left") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        top: Math.min(node.position.y, prev.centerY),
        left: Math.min(node.position.x, prev.centerX),
      }));
    }
    if (node.id === "top-right") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        top: Math.min(node.position.y, prev.centerY),
        right: Math.max(node.position.x, prev.centerX),
      }));
    }
    if (node.id === "bottom-left") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        bottom: Math.max(node.position.y, prev.centerY),
        left: Math.min(node.position.x, prev.centerX),
      }));
    }
    if (node.id === "bottom-right") {
      setLocalCenterPosition((prev) => ({
        ...prev,
        bottom: Math.max(node.position.y, prev.centerY),
        right: Math.max(node.position.x, prev.centerX),
      }));
    }
  };

  const handleNodeDragStop = async (event: React.MouseEvent, node: Node) => {
    if (
      [
        "center",
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
      console.log("센터 드래그 종료:", node.position);

      // 1) API 호출해서 새 좌표 저장
      updatePosition.mutate({
        memberId: session!.user.id!,
        ...localCenterPosition,
      });
    } else if (node.type === "task") {
      console.log("업무 드래그 종료:", node.position);
      patchTask.mutate({
        taskId: node.id,
        data: {
          positionX: node.position.x,
          positionY: node.position.y,
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
