import { Check, Loader, Pause, RefreshCw, Snowflake } from "lucide-react";
import { DayTaskStatus, TaskStatus } from "../../types/task";

function DayStatusBadge({ status }: { status: DayTaskStatus | null }) {
  if (!status) return null;
  return {
    [DayTaskStatus.TODO]: (
      <Loader className="bg-divider text-white rounded-full p-1" />
    ),
    [DayTaskStatus.DOING]: (
      <RefreshCw className="bg-progress text-white rounded-full p-1" />
    ),
    [DayTaskStatus.COMPLETED]: (
      <Check className="bg-success text-white rounded-full p-1" />
    ),
  }[status];
}
function StatusBadge({ status }: { status: TaskStatus | null }) {
  if (!status) return null;
  return {
    [TaskStatus.TODO]: (
      <Loader className="bg-divider text-white rounded-full p-1" />
    ),
    [TaskStatus.DOING]: (
      <RefreshCw className="bg-progress text-white rounded-full p-1" />
    ),
    [TaskStatus.COMPLETED]: (
      <Check className="bg-success text-white rounded-full p-1" />
    ),
    [TaskStatus.QUIT]: (
      <Pause className="bg-error text-white rounded-full p-1" />
    ),
    [TaskStatus.ICE]: (
      <Snowflake className="bg-sky-400 text-white rounded-full p-1" />
    ),
  }[status];
}

export { DayStatusBadge, StatusBadge };
