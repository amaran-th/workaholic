import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDDayString = (
  criteria: Date,
  targetDate: string | null
): string | null => {
  if (!targetDate) return "";
  const target = new Date(targetDate);
  const diffTime = target.getTime() - criteria.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDay > 0) {
    //디데이 계산할 날짜가 현재 날짜보다 뒤에 있음
    return `D-${diffDay}`;
  } else if (diffDay === 0) {
    const diffHour = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHour}시간`;
  } else {
    return null;
  }
};

export const formatDateTimeString = (inputDate: Date): string => {
  const outputDateFormat = "YYYY-MM-DD HH:mm";

  if (Number.isNaN(inputDate.getTime())) {
    return "";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");

  const outputDate = outputDateFormat
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes);

  return outputDate;
};

export const formatDateString = (inputDate: Date): string => {
  const outputDateFormat = "YYYY-MM-DD";

  if (Number.isNaN(inputDate.getTime())) {
    return "";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const outputDate = outputDateFormat
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day);

  return outputDate;
};

export const formatTimeString = (inputDate: Date): string => {
  const outputDateFormat = "HH:mm";

  if (Number.isNaN(inputDate.getTime())) {
    return "";
  }

  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");

  const outputDate = outputDateFormat
    .replace("HH", hours)
    .replace("mm", minutes);

  return outputDate;
};

export const isSameDay = (date: string) => {
  const created = new Date(date);
  const now = new Date();

  return (
    created.getFullYear() === now.getFullYear() &&
    created.getMonth() === now.getMonth() &&
    created.getDate() === now.getDate()
  );
};

export const notifyNotSupportedFeature = () => {
  toast("아직 제공되지 않는 기능이에요");
};
