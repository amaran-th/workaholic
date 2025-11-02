import { Badge, CategoryBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarSelect } from "@/components/ui/calendar";
import { CellInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { useGetSprintQuery } from "@/features/sprint/sprint-api";
import { Color, colorMap, quadrantColorMap } from "@/lib/data";
import dayjs from "@/lib/dayjs";
import {
  selectedDateAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { deleteTaskApi, patchTaskApi } from "../../task-api";
import {
  DayTaskStatus,
  PatchTaskRequest,
  TaskListItem,
} from "../../types/task";
import { DayStatusBadge } from "./StatusBadge";

function TaskListRow({ task }: { task: TaskListItem }) {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);

  const [selectedDate] = useAtom(selectedDateAtom);
  const [taskFilter] = useAtom(taskFilterAtom);
  const { data: categories } = useGetCategoriesQuery({
    memberId: session?.user.id ?? "",
  });
  const { data: sprints, isFetching } = useGetSprintQuery({
    memberId: session?.user.id,
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

  const deleteTask = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => deleteTaskApi({ taskId }),
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
      onClick={() => console.log("Task 클릭:", task.id)}
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
        <DayStatusBadge status={getDayTaskStatus(task)} />
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
        {task.startDate ? dayjs(task.startDate).format("YYYY-MM-DD") : "-"}
      </TableCell>
      <TableCell>
        {task.endDate ? dayjs(task.endDate).format("YYYY-MM-DD") : "-"}
      </TableCell>
      <TableCell>
        <CalendarSelect
          selectedDate={task.dueDate ? dayjs(task.dueDate) : null}
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
