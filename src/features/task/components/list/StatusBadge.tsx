import { Check, Loader, Pause, RefreshCw, Snowflake } from "lucide-react";
import { TaskStatus } from "../../types/task";

function StatusBadge({ status }: { status: TaskStatus }) {
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

export default StatusBadge;
