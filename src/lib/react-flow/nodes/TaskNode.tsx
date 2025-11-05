import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/calendar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { Color, colorMap } from "@/lib/data";
import { cn } from "@/lib/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NodeProps } from "@xyflow/react";
import { useAtom } from "jotai";
import {
  CalendarClock,
  Check,
  NotebookPen,
  RefreshCw,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useGetSprintQuery } from "@/features/sprint/sprint-api";
import FlexibleTextArea from "@/features/task/components/matrix/FlexibleTextArea";
import TaskCard from "@/features/task/components/matrix/TaskCard";
import {
  deleteTaskApi,
  patchTaskApi,
  toggleCompleteStamp,
  toggleDoingStamp,
} from "@/features/task/task-api";
import {
  PatchTaskRequest,
  TaskWithRelations,
} from "@/features/task/types/task";
import dayjs from "@/lib/dayjs";
import {
  defaultCategoryIdAtom,
  selectedDateAtom,
  taskFilterAtom,
} from "../store/matrixAtom";

function CategorySprintSelector({ task }: { task: TaskWithRelations }) {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const [taskFilter] = useAtom(taskFilterAtom);

  const { data: categories } = useGetCategoriesQuery({
    memberId: session?.user.id ?? "",
  });

  const { data: sprints } = useGetSprintQuery({
    memberId: session?.user.id ?? "",
    categoryId: task.category?.id,
  });

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
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });

  const [, setDefaultCategoryId] = useAtom(defaultCategoryIdAtom);
  return (
    <>
      <ContextMenuItem keepOpen>
        {" "}
        <Select
          value={task.category?.id}
          onValueChange={(value: string) => {
            setDefaultCategoryId(value);
            patchTask.mutate({
              taskId: task.id,
              data: { categoryId: value },
            });
          }}
        >
          <SelectTrigger className="max-h-fit w-full">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block rounded-full size-3"
                    style={{
                      backgroundColor: colorMap[category.color as Color].sub,
                    }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ContextMenuItem>
      <ContextMenuItem keepOpen>
        <Select
          value={task.sprint?.id}
          onValueChange={(value: string) => {
            patchTask.mutate({
              taskId: task.id,
              data: { sprintId: value === "clear" ? null : value },
            });
          }}
          disabled={!sprints?.length || !task.category}
        >
          <SelectTrigger className="max-h-fit w-full">
            <SelectValue placeholder="스프린트 선택">
              {task.sprint ? task.sprint.name : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clear">
              <span className="text-muted-foreground">선택 해제</span>
            </SelectItem>
            <SelectSeparator />
            {sprints?.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                <div className="flex flex-col">
                  <p>{sprint.name}</p>
                  <p className="text-secondary text-xs">
                    {sprint.startDate
                      ? dayjs(sprint.startDate).format("YYYY-MM-DD")
                      : ""}
                    ~
                    {sprint.endDate
                      ? dayjs(sprint.endDate).format("YYYY-MM-DD")
                      : ""}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ContextMenuItem>
    </>
  );
}

function TaskNode({ data }: NodeProps & { data: TaskWithRelations }) {
  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const queryClient = useQueryClient();
  const [memo, setMemo] = useState<string>(data.memo ?? "");
  const [dueDate, setDueDate] = useState<string | null>(data.dueDate);

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
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => deleteTaskApi({ taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });

  const toggleDoing = useMutation({
    mutationFn: ({
      taskId,
      params,
    }: {
      taskId: string;
      params: { date: string };
    }) => toggleDoingStamp({ taskId, params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });
  const toggleComplete = useMutation({
    mutationFn: ({
      taskId,
      params,
    }: {
      taskId: string;
      params: { date: string };
    }) => toggleCompleteStamp({ taskId, params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matrix-tasks", taskFilter],
      });
    },
  });

  const isDoing = useMemo(
    () =>
      data.doStamps.some((stamp) =>
        dayjs(stamp.createdAt).isSame(selectedDate, "day")
      ),
    [data.doStamps, selectedDate]
  );
  const isCompleted = useMemo(() => {
    if (!data.endDate) return false;
    return dayjs(data.endDate).isSame(selectedDate, "day");
  }, [data.endDate, selectedDate]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <TaskCard data={data} isDoing={isDoing} isCompleted={isCompleted} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <CategorySprintSelector task={data} />
        <ContextMenuSeparator />
        <ContextMenuItem keepOpen>
          <Button
            onClick={() => {
              toggleDoing.mutate({
                taskId: data.id,
                params: {
                  date:
                    !selectedDate || dayjs().isSame(selectedDate, "day")
                      ? dayjs().format()
                      : selectedDate.format(),
                },
              });
            }}
            color="progress"
            variant={isDoing ? "default" : "outline"}
            disabled={isCompleted}
          >
            <RefreshCw
              className={cn("text-progress", {
                "text-white": isDoing,
              })}
            />
            작업 중
          </Button>
          <Button
            onClick={() => {
              toggleComplete.mutate({
                taskId: data.id,
                params: {
                  date:
                    !selectedDate || dayjs().isSame(selectedDate, "day")
                      ? dayjs().format()
                      : selectedDate.format(),
                },
              });
            }}
            color="success"
            variant={isCompleted ? "default" : "outline"}
            disabled={!isDoing}
          >
            <Check
              className={cn("text-success", {
                "text-white": isCompleted,
              })}
            />
            작업 완료
          </Button>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub
          onOpenChange={(open) => {
            if (open) {
              setDueDate(data.dueDate);
            }
          }}
        >
          <ContextMenuSubTrigger className="items-start">
            <CalendarClock />
            <div>
              <p>마감 기한</p>
              {data.dueDate ? (
                <p className="text-xs text-sub-text">
                  {dayjs(data.dueDate)?.format("YYYY-MM-DD HH:mm")}
                </p>
              ) : (
                <p className="text-xs text-placeholder">YYYY-MM-DD HH:mm</p>
              )}
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <DateTimePicker
              value={dueDate ? dayjs(dueDate) : null}
              onClear={() => {
                patchTask.mutate({
                  taskId: data.id,
                  data: { dueDate: null },
                });
              }}
              onSubmit={(newValue: string) => {
                patchTask.mutate({
                  taskId: data.id,
                  data: { dueDate: newValue },
                });
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <div className="relative flex cursor-default gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
          <NotebookPen />
          <div className="w-full">
            <p>메모</p>
            <FlexibleTextArea
              text={memo}
              setText={setMemo}
              debounceCallback={(e) => {
                patchTask.mutate({
                  taskId: data.id,
                  data: { memo: e.target.value },
                });
              }}
              placeholder="메모가 비어있습니다."
              className="text-xs text-sub-text"
            />
          </div>
        </div>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            deleteTask.mutate({ taskId: data.id });
          }}
          className="text-error"
        >
          <Trash className="text-error" />
          업무 삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default TaskNode;
