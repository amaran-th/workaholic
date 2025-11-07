import { CategoryBadge } from "@/components/ui/badge";
import { Card, CardDescription } from "@/components/ui/card";
import { colorMap } from "@/lib/data";
import dayjs from "@/lib/dayjs";
import {
  selectedDateAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import { formatDDayString } from "@/lib/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
  Check,
  ChevronRight,
  CornerRightDown,
  NotebookPen,
  RefreshCw,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { patchTaskApi } from "../../task-api";
import { PatchTaskRequest, TaskWithRelations } from "../../types/task";
import FlexibleTextArea from "./FlexibleTextArea";

function TaskCard({
  data,
  isCompleted,
  isDoing,
}: {
  data: TaskWithRelations;
  isDoing: boolean;
  isCompleted: boolean;
}) {
  const queryClient = useQueryClient();
  const [taskFilter] = useAtom(taskFilterAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [text, setText] = useState<string>(data.content);

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

  const StatusIcon = useMemo(() => {
    if (isCompleted)
      return <Check className="bg-success text-white rounded-full p-1" />;
    if (isDoing)
      return <RefreshCw className="bg-progress text-white rounded-full p-1" />;
    return <></>;
  }, [isCompleted, isDoing]);

  const DDayText = useMemo(
    () =>
      formatDDayString(
        dayjs().isSame(selectedDate, "day") ? dayjs() : selectedDate,
        data.dueDate
      ),
    [data.dueDate, selectedDate]
  );

  return (
    <Card
      className="w-[200px] min-h-[150px] rounded-t-none p-3 gap-1"
      style={{
        backgroundColor: colorMap[data.category?.color ?? "white"].bg,
      }}
    >
      {!!data.dueDate && !isCompleted && DDayText && (
        <span className="absolute -top-6 left-0 flex gap-1 bg-primary text-white rounded-md rounded-b-none text-xs font-bold p-1 pr-2 items-center">
          <Timer className="size-4" />
          {DDayText}
        </span>
      )}
      {!!data.parentTask && (
        <CardDescription className="flex items-end text-xs gap-0.5">
          {data.parentTask.content}
          <CornerRightDown className="size-3" />
        </CardDescription>
      )}
      <FlexibleTextArea
        text={text}
        setText={setText}
        debounceCallback={(e) => {
          patchTask.mutate({
            taskId: data.id,
            data: { content: e.target.value },
          });
        }}
        placeholder="업무를 작성해주세요."
        className="text-sm grow"
      />
      <div className="text-xs">
        {!!data.memo && (
          <span className="flex gap-1 text-sub-text grow items-center">
            <NotebookPen className="size-3" /> {data.memo}
          </span>
        )}
      </div>

      <div className="flex gap-1 items-center justify-between">
        {data.category ? (
          <div className="flex gap-0.5 items-center">
            <CategoryBadge customColor={data.category.color} size="sm">
              {data.category.name}
            </CategoryBadge>
            {data.sprint ? (
              <>
                <ChevronRight
                  size="16"
                  style={{ color: colorMap[data.category.color].primary }}
                />
                <p
                  className="text-xs font-bold"
                  style={{ color: colorMap[data.category.color].primary }}
                >
                  {data.sprint.name}
                </p>
              </>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div />
        )}

        {StatusIcon}
      </div>
    </Card>
  );
}

export default TaskCard;
