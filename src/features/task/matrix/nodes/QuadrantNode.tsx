import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { HEADER_HEIGHT } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { MouseEvent, useState } from "react";
import { postTaskApi } from "../../task-api";
import { PostTaskRequest } from "../../types/task";
import { defaultCategoryIdAtom, taskFilterAtom } from "../store/matrixAtom";

function QuadrantNode({
  data,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps & { data: { bgcolor: string; width: number; height: number } }) {
  const { getViewport } = useReactFlow();
  const [contextPos, setContextPos] = useState<{
    positionX: number;
    positionY: number;
  } | null>(null);
  const [session] = useAtom(sessionAtom);
  const [defaultCategoryId] = useAtom(defaultCategoryIdAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const queryClient = useQueryClient();
  const addTask = useMutation({
    mutationFn: (vars: PostTaskRequest) => postTaskApi(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskFilter],
      });
    },
  });
  const handlePaneContextMenu = (event: MouseEvent) => {
    event.preventDefault();

    const viewport = getViewport();
    const zoom = viewport.zoom;
    const panX = viewport.x;
    const panY = viewport.y;

    const positionX = (event.clientX - panX) / zoom;
    const positionY = (event.clientY - panY - HEADER_HEIGHT) / zoom;
    setContextPos({ positionX, positionY });
  };

  const handleAddTask = () => {
    if (!contextPos) return;

    addTask.mutate({
      memberId: session!.user.id!,
      categoryId: defaultCategoryId,
      ...contextPos,
      content: "",
      memo: "",
      dueDate: null,
      parentTaskId: null,
      sprintId: null,
    });
  };
  return (
    <div onContextMenu={handlePaneContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            style={{
              backgroundColor: data.bgcolor,
              width: data.width,
              height: data.height,
            }}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleAddTask}>
            <Plus /> 새 업무
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default QuadrantNode;
