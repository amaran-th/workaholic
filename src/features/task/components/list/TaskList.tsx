import { CalendarSelect } from "@/components/ui/calendar";
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
import { useAtom } from "jotai";
import { useGetListTasksQuery } from "../../task-api";
import TaskListRow from "./TaskListRow";

function TaskList() {
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

  // const getTaskStatus = useCallback(
  //   (startDate: string | null, endDate: string | null) => {
  //     if (!selectedDate) return null;
  //     if (endDate && dayjs(endDate).isSameOrBefore(selectedDate, "day"))
  //       return TaskStatus.COMPLETED;
  //     if (startDate && dayjs(startDate).isSameOrBefore(selectedDate, "day"))
  //       return TaskStatus.DOING;
  //     return TaskStatus.TODO;
  //   },
  //   [selectedDate]
  // );

  return (
    <>
      <div className="flex gap-2 justify-between">
        <h2 className="text-2xl font-bold">오늘의 업무</h2>
        <CalendarSelect
          selectedDate={selectedDate ?? null}
          onSelect={(newValue) => {
            if (!newValue) return;
            setSelectedDate(newValue);
          }}
        />
        {/* <Button
            onClick={() => {
              setSelectedDate((prev) => (prev ? null : dayjs()));
            }}
            size="sm"
          >
            {selectedDate ? "전체 보기" : "오늘 업무만"}
          </Button> */}
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
              <div className="flex items-center gap-2">전체 카테고리</div>
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
              <TableHead className="min-w-[160px]">마감 기한</TableHead>
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
              tasks.map((task) => <TaskListRow key={task.id} task={task} />)
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
