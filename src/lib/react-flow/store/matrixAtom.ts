import { TaskFilter } from "@/features/task/types/task";
import dayjs, { Dayjs } from "@/lib/dayjs";
import { atom } from "jotai";

export const selectedDateAtom = atom<Dayjs | null>(dayjs());

export const selectedCategoryIdAtom = atom<string | null>(null);
export const defaultCategoryIdAtom = atom<string | null>(null);

export const taskFilterAtom = atom<TaskFilter>((get) => {
  const selectedCategoryId = get(selectedCategoryIdAtom);
  const selectedDate = get(selectedDateAtom);
  const today = selectedDate;
  return {
    categoryId: selectedCategoryId,
    date: today?.format("YYYY-MM-DD"),
  };
});
