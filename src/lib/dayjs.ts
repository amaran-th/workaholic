import _dayjs from "dayjs";
import "dayjs/locale/ko";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.extend(isSameOrBefore);
_dayjs.extend(isSameOrAfter);
_dayjs.extend(localeData);

_dayjs.tz.setDefault("Asia/Seoul");
_dayjs.locale("ko");

export const dayjs = _dayjs;
export type { Dayjs } from "dayjs";
export default dayjs;
