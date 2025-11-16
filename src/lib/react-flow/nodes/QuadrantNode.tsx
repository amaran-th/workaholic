import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { postTaskApi } from "@/features/task/task-api";
import { PostTaskRequest } from "@/features/task/types/task";
import { HEADER_HEIGHT } from "@/lib/data";
import dayjs from "@/lib/dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { MouseEvent, useState } from "react";
import {
  defaultTaskInfoAtom,
  selectedDateAtom,
  taskFilterAtom,
} from "../store/matrixAtom";

function QuadrantNode({
  data,
}: NodeProps & {
  data: {
    bgcolor: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}) {
  const { getViewport } = useReactFlow();
  const [contextPos, setContextPos] = useState<{
    positionX: number;
    positionY: number;
  } | null>(null);
  const [defaultTaskInfo] = useAtom(defaultTaskInfoAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const queryClient = useQueryClient();
  const addTask = useMutation({
    mutationFn: (vars: PostTaskRequest) => postTaskApi(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matrix-tasks", taskFilter],
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
    if (!contextPos || !selectedDate) return;

    addTask.mutate({
      date: selectedDate.isSame(dayjs(), "d")
        ? null
        : selectedDate.format("YYYY-MM-DD"),
      categoryId: defaultTaskInfo?.categoryId ?? null,
      sprintId: defaultTaskInfo?.sprintId ?? null,
      ...contextPos,
      content: "",
      memo: "",
      dueDate: null,
      parentTaskId: null,
    });
  };
  return (
    <div onContextMenu={handlePaneContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            style={{
              backgroundColor: data.bgcolor,
              width: data.right - data.left,
              height: data.bottom - data.top,
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
