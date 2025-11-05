import dayjs, { Dayjs } from "@/lib/dayjs";

// 🎯 D-Day 계산 (기준일 vs 목표일)
export const formatDDayString = (
  criteria: Dayjs | null,
  targetDate: string | null
): string | null => {
  if (!criteria || !targetDate) return "";

  const target = dayjs(targetDate);

  const diffDays = target.startOf("day").diff(criteria.startOf("day"), "day");
  const diffHours = target.diff(criteria, "hour");
  const diffMinutes = target.diff(criteria, "minute");
  console.log(
    criteria,
    targetDate,
    target,
    target.startOf("day"),
    criteria.startOf("day")
  );

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) {
    if (diffHours > 0) return `${diffHours}시간`;
    if (diffHours === 0) {
      if (diffMinutes >= 0) return `${diffMinutes}분`;
    }
  }
  return null; // 이미 지난 날짜
};

// 한국시간 기준 문자열을 UTC 기준 Date로 변환
export const convertKSTDateToUTC = (dateStr: string) => {
  if (!dateStr) throw new Error("dateStr is required");

  const kstDate = dayjs.tz(dateStr.slice(0, 11));
  const startOfKSTDay = kstDate.startOf("day");
  const endOfKSTDay = kstDate.endOf("day");

  const startUTC = startOfKSTDay.utc().format();
  const endUTC = endOfKSTDay.utc().format();
  return {
    startUTC,
    UTC: dateStr,
    endUTC,
  };
};
