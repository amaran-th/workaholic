import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { TaskFilter } from "@/features/task/types/task";
import { formatDateTimeStringData } from "@/lib/utils/formatDate";
import { atom } from "jotai";

export const selectedDateAtom = atom<string | undefined>(
  formatDateTimeStringData(new Date())
);

export const selectedCategoryIdAtom = atom<string | null>(null);
export const defaultCategoryIdAtom = atom<string | null>(null);

export const taskFilterAtom = atom<TaskFilter>((get) => {
  const session = get(sessionAtom);
  const selectedCategoryId = get(selectedCategoryIdAtom);
  const selectedDate = get(selectedDateAtom);
  const today = selectedDate;
  return {
    memberId: session?.user?.id ?? "",
    categoryId: selectedCategoryId,
    date: today,
  };
});
