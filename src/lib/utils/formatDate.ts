export const formatDDayString = (
  criteria: Date,
  targetDate: string | null
): string | null => {
  if (!targetDate) return "";

  const kstDate = new Date(`${targetDate}T00:00:00+09:00`);
  const targetUTC = new Date(kstDate.getTime()); // 명시적 복제 (UTC 기준)

  // UTC 기준 차이 계산
  const diffTime = targetUTC.getTime() - criteria.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDay > 0) {
    // 디데이 날짜가 현재보다 뒤에 있음
    return `D-${diffDay}`;
  } else if (diffDay === 0) {
    // 같은 날이면 시간 차이로 표시
    const diffHour = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHour}시간`;
  } else {
    // 이미 지난 날짜면 null
    return null;
  }
};

// Date를 한국시간 텍스트로 변환(UI 렌더링 용)
export const formatDateTimeString = (date: Date): string => {
  if (Number.isNaN(date.getTime())) return "";
  const parts = date
    .toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .match(/\d+/g);

  if (!parts || parts.length < 6) return "";

  const [year, month, day, hour, minute, second] = parts;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// Date를 한국시간 텍스트로 변환(파라미터용)
export const formatDateTimeStringData = (date: Date): string => {
  if (Number.isNaN(date.getTime())) return "";

  const parts = date
    .toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .match(/\d+/g);

  if (!parts || parts.length < 6) return "";

  const [year, month, day, hour, minute, second] = parts;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

// Date를 한국시간 텍스트로 변환
export const formatDateString = (date: Date): string => {
  if (Number.isNaN(date.getTime())) return "";

  const parts = date
    .toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .match(/\d+/g); // 숫자만 추출

  if (!parts || parts.length < 3) return "";

  const [year, month, day] = parts;

  return `${year}-${month}-${day}`;
};

// 오늘과 같은 날인지 여부
export const isSameDay = (utcDate: string) => {
  // dateStr: "YYYY-MM-DDTHH:mm:ssZ" (UTC)
  const date = formatDateString(new Date(utcDate));
  const now = formatDateString(new Date());

  return date === now;
};

// GET API로 받아온 날짜 데이터 표시용
export const formatKoreanDate = (date: string | null, defaultValue = "") => {
  if (typeof window === "undefined") return ""; // SSR 회피
  if (!date) return defaultValue;
  return new Date(date).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
};

// API 파라미터로 받은 날짜 텍스트(한국시간 기준)를 UTC Date로 변환
export function convertKSTDateToUTC(dateStr: string) {
  // dateStr: "YYYY-MM-DDTHH:mm:ss" (KST)
  if (!dateStr) throw new Error("dateStr is required");

  const [datePart, timePart] = dateStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0] = timePart
    ? timePart.split(":").map(Number)
    : [];

  const kstDate = new Date(Date.UTC(year, month - 1, day, hour - 9, minute));

  const startOfDayKST = new Date(
    Date.UTC(year, month - 1, day, 0 - 9, 0, 0, 0)
  );
  const endOfDayKST = new Date(
    startOfDayKST.getTime() + 24 * 60 * 60 * 1000 - 1
  );

  return {
    startUTC: startOfDayKST,
    UTC: kstDate,
    endUTC: endOfDayKST,
  };
}
