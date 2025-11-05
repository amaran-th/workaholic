import { Badge, CategoryBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarSelect } from "@/components/ui/calendar";
import { CellInput } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { useGetSprintQuery } from "@/features/sprint/sprint-api";
import { Color, colorMap, quadrantColorMap } from "@/lib/data";
import dayjs from "@/lib/dayjs";
import {
  selectedDateAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import { cn } from "@/lib/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Check, Pin, PinOff, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  deleteTaskApi,
  patchTaskApi,
  patchTaskStartDateApi,
  toggleCompleteStamp,
  toggleDoingStamp,
} from "../../task-api";
import {
  DayTaskStatus,
  PatchTaskRequest,
  TaskListItem,
} from "../../types/task";
import { DayStatusBadge } from "./StatusBadge";

function TaskListRow({ task }: { task: TaskListItem }) {
  const queryClient = useQueryClient();
  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const [open, setOpen] = useState<boolean>(false);

  const { data: categories } = useGetCategoriesQuery();
  const { data: sprints } = useGetSprintQuery({
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
        queryKey: ["list-tasks", taskFilter],
      });
    },
  });

  const patchTaskStartDate = useMutation({
    mutationFn: patchTaskStartDateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-tasks", taskFilter],
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => deleteTaskApi({ taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-tasks", taskFilter],
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
        queryKey: ["list-tasks", taskFilter],
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
        queryKey: ["list-tasks", taskFilter],
      });
    },
  });

  const priorityColor = useMemo(() => {
    switch (task.priority) {
      case 1: {
        return quadrantColorMap.FIRST;
      }
      case 2: {
        return quadrantColorMap.SECOND;
      }
      case 3: {
        return quadrantColorMap.THIRD;
      }
      case 4: {
        return quadrantColorMap.FORTH;
      }
      default:
        return null;
    }
  }, [task]);

  const getDayTaskStatus = useCallback(
    (task: TaskListItem) => {
      if (task.endDate && dayjs(task.endDate).isSame(selectedDate, "day"))
        return DayTaskStatus.COMPLETED;
      if (
        task.doStamps.some((stamp) =>
          dayjs(stamp.createdAt).isSame(selectedDate, "day")
        )
      )
        return DayTaskStatus.DOING;

      return DayTaskStatus.TODO;
    },
    [selectedDate]
  );

  return (
    <TableRow
      key={task.id}
      className="cursor-pointer hover:bg-accent transition-colors"
      // onClick={() => console.log("Task 클릭:", task.id)}
    >
      <TableCell align="center">
        {priorityColor ? (
          <Pin color={priorityColor} fill={priorityColor} />
        ) : (
          <PinOff className="text-divider" />
        )}
      </TableCell>
      <TableCell className="text-secondary">#{task.no}</TableCell>
      <TableCell className="font-medium truncate">
        <CellInput
          defaultValue={task.content ?? ""}
          onSubmit={(value) => {
            patchTask.mutate({
              taskId: task.id,
              data: { content: String(value) },
            });
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>
              <DayStatusBadge status={getDayTaskStatus(task)} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex gap-2 p-2 w-fit bg-white shadow-lg rounded-md">
            <Button
              onClick={() => {
                toggleDoing.mutate({
                  taskId: task.id,
                  params: {
                    date:
                      !selectedDate || dayjs().isSame(selectedDate, "day")
                        ? dayjs().format()
                        : selectedDate.format(),
                  },
                });
              }}
              color="progress"
              variant={
                getDayTaskStatus(task) === DayTaskStatus.DOING
                  ? "default"
                  : "outline"
              }
              disabled={getDayTaskStatus(task) === DayTaskStatus.COMPLETED}
            >
              <RefreshCw
                className={cn("text-progress", {
                  "text-white": getDayTaskStatus(task) === DayTaskStatus.DOING,
                })}
              />
              작업 중
            </Button>
            <Button
              onClick={() => {
                toggleComplete.mutate({
                  taskId: task.id,
                  params: {
                    date:
                      !selectedDate || dayjs().isSame(selectedDate, "day")
                        ? dayjs().format()
                        : selectedDate.format(),
                  },
                });
              }}
              color="success"
              variant={
                getDayTaskStatus(task) === DayTaskStatus.COMPLETED
                  ? "default"
                  : "outline"
              }
              disabled={
                ![DayTaskStatus.DOING, DayTaskStatus.COMPLETED].includes(
                  getDayTaskStatus(task)
                )
              }
            >
              <Check
                className={cn("text-success", {
                  "text-white":
                    getDayTaskStatus(task) === DayTaskStatus.COMPLETED,
                })}
              />
              작업 완료
            </Button>
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <Select
          value={task.category?.id}
          onValueChange={(value: string) => {
            patchTask.mutate({ taskId: task.id, data: { categoryId: value } });
          }}
        >
          <SelectTrigger
            className="max-h-fit w-[180px] focus-within:pl-0 data-[state=open]:pl-0"
            cell
          >
            <SelectValue>
              {task.category ? (
                <CategoryBadge customColor={task.category.color}>
                  {task.category.name}
                </CategoryBadge>
              ) : (
                ""
              )}
            </SelectValue>
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
      </TableCell>
      <TableCell>
        <Select
          value={task.sprint?.id}
          onValueChange={(value: string) => {
            patchTask.mutate({ taskId: task.id, data: { sprintId: value } });
          }}
        >
          <SelectTrigger className="max-h-fit w-[180px]" cell>
            <SelectValue placeholder="-">
              {task.sprint ? (
                <Badge variant="secondary" className="bg-gray-200">
                  {task.sprint.name}
                </Badge>
              ) : (
                "-"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
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
      </TableCell>
      <TableCell>
        <CalendarSelect
          selected={task.createdAt ? dayjs(task.createdAt) : null}
          placeholder="-"
          onSelect={(newValue) => {
            patchTask.mutate({
              taskId: task.id,
              data: { createdAt: newValue?.format() },
            });
          }}
          {...(task.startDate
            ? { disabled: { after: new Date(task.startDate) } }
            : {})}
          cell
        />
      </TableCell>
      <TableCell>
        <CalendarSelect
          selected={task.startDate ? dayjs(task.startDate) : null}
          placeholder="-"
          onSelect={(newValue) => {
            if (!selectedDate) return;
            if (
              confirm(
                newValue
                  ? "시작일을 변경하면 변경되는 날짜 이전의 작업 기록이 모두 사라집니다.\n 정말로 변경하시겠습니까?"
                  : "시작일을 초기화하면 종료일을 포함한 해당 업무의 모든 작업 기록이 삭제됩니다.\n정말로 삭제하시겠습니까?"
              )
            ) {
              patchTaskStartDate.mutate({
                taskId: task.id,
                data: {
                  date: newValue?.format() ?? null,
                  selectedDate: selectedDate.format(),
                },
              });
            }
          }}
          {...(task.endDate
            ? { disabled: { after: new Date(task.endDate) } }
            : {})}
          cell
        />
      </TableCell>
      <TableCell>
        {task.endDate ? dayjs(task.endDate).format("YYYY-MM-DD") : "-"}
      </TableCell>
      <TableCell>
        <CalendarSelect
          selected={task.dueDate ? dayjs(task.dueDate) : null}
          placeholder="-"
          onSelect={(newValue) => {
            patchTask.mutate({
              taskId: task.id,
              data: { dueDate: newValue?.format() },
            });
          }}
          cell
        />
      </TableCell>
      <TableCell>
        <CellInput
          defaultValue={task.memo ?? ""}
          onSubmit={(value) => {
            patchTask.mutate({
              taskId: task.id,
              data: { memo: String(value) },
            });
          }}
        />
      </TableCell>
      <TableCell>
        <CellInput
          defaultValue={task.comment ?? ""}
          onSubmit={(value) => {
            patchTask.mutate({
              taskId: task.id,
              data: { comment: String(value) },
            });
          }}
        />
      </TableCell>
      <TableCell className="flex justify-center">
        <Button
          color="error"
          onClick={() => {
            deleteTask.mutate({ taskId: task.id });
          }}
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default TaskListRow;
