import {
  PostTaskRequest,
  TaskFilter,
  TaskWithRelations,
} from "@/features/task/types/task";
import dayjs, { Dayjs } from "@/lib/dayjs";
import { atom } from "jotai";

export const selectedDateAtom = atom<Dayjs | null>(dayjs());

export const selectedCategoryIdAtom = atom<string | null>(null);
export const defaultTaskInfoAtom = atom<Partial<PostTaskRequest> | null>(null);
export const draggingTaskAtom = atom<TaskWithRelations | null>(null);

export const taskFilterAtom = atom<TaskFilter>((get) => {
  const selectedCategoryId = get(selectedCategoryIdAtom);
  const selectedDate = get(selectedDateAtom);
  return {
    categoryId: selectedCategoryId,
    date: selectedDate?.format("YYYY-MM-DD"),
  };
});
