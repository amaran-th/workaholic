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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { Color, colorMap } from "@/lib/data";
import {
  selectedCategoryIdAtom,
  selectedDateAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import {
  formatDateString,
  formatDateTimeStringData,
  formatKoreanDate,
} from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Pin, Trash2 } from "lucide-react";
import {
  deleteTaskApi,
  patchTaskApi,
  useGetListTasksQuery,
} from "../../task-api";
import { PatchTaskRequest, TaskStatus } from "../../types/task";
import StatusBadge from "./StatusBadge";

function TaskList() {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(
    selectedCategoryIdAtom
  );
  const [taskFilter] = useAtom(taskFilterAtom);
  const { data: categories } = useGetCategoriesQuery({
    memberId: session?.user.id ?? "",
  });
  const { data: tasks, isFetching } = useGetListTasksQuery(taskFilter, {
    enabled: !!session?.user?.id,
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

  const getTaskStatus = (startDate: string | null, endDate: string | null) => {
    if (endDate) return TaskStatus.COMPLETED;
    if (startDate) return TaskStatus.DOING;
    return TaskStatus.TODO;
  };

  return (
    <>
      <div className="flex gap-2 justify-end">
        <div className="flex gap-1">
          <CalendarSelect
            date={selectedDate ?? null}
            onSelect={(newValue) => {
              setSelectedDate((prev) => {
                if (!newValue) return prev;
                return formatDateString(newValue);
              });
            }}
          />
          <Button
            onClick={() => {
              setSelectedDate((prev) =>
                prev ? undefined : formatDateTimeStringData(new Date())
              );
            }}
            size="sm"
          >
            {selectedDate ? "전체 보기" : "오늘 업무만"}
          </Button>
        </div>
      </div>
      <div className="flex gap-1">
        <Select
          value={selectedCategoryId ?? "all"}
          onValueChange={(value: string) => {
            setSelectedCategoryId(value === "all" ? null : value);
          }}
        >
          <SelectTrigger className="max-h-fit w-[200px]">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">전체</div>
            </SelectItem>
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
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table className="table-auto border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[50px]" />
              <TableHead />
              <TableHead className="min-w-[400px]">제목</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="min-w-[180px]">카테고리</TableHead>
              <TableHead className="min-w-[240px]">스프린트</TableHead>
              <TableHead className="min-w-[160px]">시작일</TableHead>
              <TableHead className="min-w-[160px]">종료일</TableHead>
              <TableHead className="min-w-[160px]">마감일</TableHead>
              <TableHead className="min-w-[300px]">메모</TableHead>
              <TableHead className="min-w-[300px]">기록</TableHead>
              <TableHead className="min-w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-muted-foreground py-6"
                >
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : tasks?.length ? (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => console.log("Task 클릭:", task.id)}
                >
                  <TableCell align="center">
                    <Pin
                      className={cn("text-divider", {
                        "text-error": task.pinned,
                      })}
                    />
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
                    <StatusBadge
                      status={getTaskStatus(task.startDate, task.endDate)}
                    />
                  </TableCell>
                  <TableCell>
                    <CategoryBadge customColor={task.category.color}>
                      {task.category.name}
                    </CategoryBadge>
                  </TableCell>
                  <TableCell>
                    {task.sprint ? (
                      <Badge variant="secondary" className="bg-gray-200">
                        {task.sprint.name}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{formatKoreanDate(task.startDate, "-")}</TableCell>
                  <TableCell>{formatKoreanDate(task.endDate, "-")}</TableCell>
                  <TableCell>
                    <CalendarSelect
                      date={task.dueDate}
                      placeholder="-"
                      onSelect={(newValue) => {
                        patchTask.mutate({
                          taskId: task.id,
                          data: { dueDate: newValue },
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground py-6"
                >
                  등록된 Task가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default TaskList;
