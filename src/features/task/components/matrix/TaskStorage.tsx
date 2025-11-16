"use client";

import TaskNode from "@/lib/react-flow/nodes/TaskNode";
import {
  draggingTaskAtom,
  taskFilterAtom,
} from "@/lib/react-flow/store/matrixAtom";
import { cn } from "@/lib/utils/utils";
import "@xyflow/react/dist/style.css";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DragEvent, useMemo, useState } from "react";
import { useGetMatrixTasksQuery } from "../../task-api";
import { TaskWithRelations } from "../../types/task";

function TaskStorage() {
  const [taskFilter] = useAtom(taskFilterAtom);
  const [, setDraggingTask] = useAtom(draggingTaskAtom);
  const [open, setOpen] = useState<boolean>(false);
  const { data: tasks } = useGetMatrixTasksQuery(taskFilter);
  const notLocatedTasks = useMemo(
    () =>
      tasks?.filter(
        (task) => task.positionX === null || task.positionY === null
      ) ?? [],
    [tasks]
  );

  const onDragNodeStart = (event: React.DragEvent, task: TaskWithRelations) => {
    setDraggingTask(task);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragNodeEnd = () => {
    setDraggingTask(null);
  };
  return (
    <>
      <div
        className={cn(
          "shrink-0 index-10 border-r-2 border-color-secondary h-full bg-gray-100 transition-all relative",
          open ? "w-[250px]" : "w-0"
        )}
      >
        <div
          className={cn(
            "p-2 flex flex-col gap-1 items-center h-full w-full transition-all duration-300 ease-in-out origin-left",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {notLocatedTasks.length ? (
            notLocatedTasks.map((task) => (
              <div
                key={task.id}
                onDragStart={(event: DragEvent) => {
                  onDragNodeStart(event, task);
                  (event.currentTarget as HTMLElement).style.cursor =
                    "grabbing";
                }}
                onDragEnd={(event) => {
                  onDragNodeEnd();
                  (event.currentTarget as HTMLElement).style.cursor = "grab";
                }}
                draggable
              >
                <TaskNode data={task} />
              </div>
            ))
          ) : (
            <div className="my-auto w-full min-w-max flex flex-col gap-1 text-center text-secondary select-none">
              <p>보관함이 비어있습니다.</p>
              <div className="text-xs">
                <p>위치가 지정되지 않은 업무는</p>
                <p>여기에 저장됩니다.</p>
              </div>
            </div>
          )}
        </div>
        <div
          className="absolute index-[11] -right-[26px] top-0 bottom-0 my-auto bg-white border-2 border-l-0 border-color-secondary rounded-r-md h-30 flex items-center transition-colors text-secondary hover:bg-gray-50"
          onClick={() => {
            console.log(open);
            setOpen((prev) => !prev);
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </div>
      </div>
    </>
  );
}

export default TaskStorage;
