import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { TaskFilter } from "@/features/task/types/task";
import { formatDateTimeString } from "@/lib/utils/formatDate";
import { atom } from "jotai";

export const selectedDateAtom = atom<Date>(new Date());

export const defaultCategoryIdAtom = atom<string | null>(null);

export const taskFilterAtom = atom<TaskFilter>((get) => {
  const session = get(sessionAtom);
  const selectedDate = get(selectedDateAtom);
  const today = formatDateTimeString(selectedDate);
  return {
    memberId: session?.user?.id ?? "",
    startDateAfter: today,
    endDateBefore: today,
    createdAtAfter: today,
  };
});
