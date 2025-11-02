import dayjs, { Dayjs } from "@/lib/dayjs";

// 🎯 D-Day 계산 (기준일 vs 목표일)
export const formatDDayString = (
  criteria: Dayjs | null,
  targetDate: string | null
): string | null => {
  if (!criteria || !targetDate) return "";

  const target = dayjs.tz(targetDate, "Asia/Seoul");
  console.log(criteria, target);

  const diffDays = target.startOf("day").diff(criteria.startOf("day"), "day");
  const diffHours = target.diff(criteria, "hour");

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return `${diffHours}시간`;
  return null; // 이미 지난 날짜
};

// 한국시간 기준 문자열을 UTC 기준 Date로 변환
export const convertKSTDateToUTC = (dateStr: string) => {
  if (!dateStr) throw new Error("dateStr is required");

  const kst = dayjs.tz(dateStr, "Asia/Seoul");
  const startUTC = kst.startOf("day");
  const endUTC = kst.endOf("day");

  return {
    startUTC: startUTC.toDate(),
    UTC: kst.toDate(),
    endUTC: endUTC.toDate(),
  };
};
