import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { Color, colorMap } from "@/lib/data";
import {
  cn,
  formatDateString,
  formatDateTimeString,
  isSameDay,
} from "@/lib/utils";
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
import FlexibleTextArea from "../../components/FlexibleTextArea";
import {
  deleteTaskApi,
  patchTaskApi,
  toggleCompleteStamp,
  toggleDoingStamp,
} from "../../task-api";
import { PatchTaskRequest, TaskWithRelations } from "../../types/task";
import {
  defaultCategoryIdAtom,
  selectedDateAtom,
  taskFilterAtom,
} from "../store/matrixAtom";
import TaskCard from "./TaskCard";

function TaskNode({ data }: NodeProps & { data: TaskWithRelations }) {
  const [session] = useAtom(sessionAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const [, setDefaultCategoryId] = useAtom(defaultCategoryIdAtom);
  const queryClient = useQueryClient();
  const [memo, setMemo] = useState<string>(data.memo ?? "");
  const [dueDate, setDueDate] = useState<string | null>(data.dueDate);
  console.log(dueDate?.slice(11, 19));
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

  const deleteTask = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => deleteTaskApi({ taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskFilter],
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
        queryKey: ["tasks", taskFilter],
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
        queryKey: ["tasks", taskFilter],
      });
    },
  });

  const { data: categories } = useGetCategoriesQuery(
    { memberId: session?.user.id ?? "" },
    {
      enabled: !!session?.user.id,
    }
  );

  const isDoing = useMemo(
    () => data.doStamps.some((stamp) => isSameDay(stamp.createdAt)),
    [data.doStamps]
  );
  const isCompleted = useMemo(() => {
    if (!data.endDate) return false;
    return isSameDay(data.endDate);
  }, [data.endDate]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <TaskCard data={data} isDoing={isDoing} isCompleted={isCompleted} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem keepOpen>
          <Select
            value={data.category?.id}
            onValueChange={(value: string) => {
              setDefaultCategoryId(value);
              patchTask.mutate({
                taskId: data.id,
                data: { categoryId: value },
              });
            }}
          >
            <SelectTrigger className="max-h-fit">
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
        <ContextMenuSeparator />
        <ContextMenuItem keepOpen>
          <Button
            onClick={() => {
              toggleDoing.mutate({
                taskId: data.id,
                params: { date: formatDateTimeString(selectedDate) },
              });
            }}
            variant={isDoing ? "progress" : "outline"}
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
                params: { date: formatDateTimeString(selectedDate) },
              });
            }}
            variant={isCompleted ? "success" : "outline"}
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
              <p>Due Date</p>
              {data.dueDate ? (
                <p className="text-xs text-sub-text">
                  {formatDateTimeString(new Date(data.dueDate))}
                </p>
              ) : (
                <p className="text-xs text-placeholder">YYYY-MM-DD HH:mm</p>
              )}
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <div className="p-2">
              <Calendar
                mode="single"
                selected={dueDate ? new Date(dueDate) : undefined}
                onSelect={(newValue) => {
                  setDueDate((prev) => {
                    if (!newValue) return prev;
                    if (prev) {
                      return formatDateString(newValue).concat(
                        prev.slice(10, 16)
                      );
                    }
                    return formatDateTimeString(newValue);
                  });
                }}
                className=""
                captionLayout="dropdown"
              />
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={
                  dueDate
                    ? new Date(dueDate).toLocaleTimeString("ko-KR", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Asia/Seoul",
                      })
                    : "00:00:00"
                }
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                onChange={(event) => {
                  console.log(event.target.value);
                  setDueDate((prev) => {
                    return (prev ?? formatDateTimeString(new Date()))
                      .slice(0, 11)
                      .concat(event.target.value);
                  });
                }}
              />
              <div className="flex gap-1 w-full justify-end mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    patchTask.mutate({
                      taskId: data.id,
                      data: { dueDate: null },
                    });
                  }}
                >
                  초기화
                </Button>
                <Button
                  onClick={() => {
                    patchTask.mutate({
                      taskId: data.id,
                      data: { dueDate: new Date(dueDate!) },
                    });
                  }}
                  disabled={!dueDate}
                >
                  설정
                </Button>
              </div>
            </div>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <div className="relative flex cursor-default gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
          <NotebookPen />
          <div className="w-full">
            <p>Memo</p>
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
