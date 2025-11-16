import { Category } from "@/features/category/types/category";
import { Sprint } from "@/features/sprint/types/sprint";

export type DoStamp = {
  id: string;
  taskId: string;
  createdAt: string;
};
export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  COMPLETED = "COMPLETED",
  QUIT = "QUIT",
  ICE = "ICE",
}
export enum DayTaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  COMPLETED = "COMPLETED",
}

export type TaskWithRelations = {
  id: string;
  no: number;
  content: string;
  memo: string | null;
  startDate: string | null;
  endDate: string | null;
  dueDate: string | null;
  comment: string | null;
  positionX: number | null;
  positionY: number | null;
  category: Category | null;
  memberId: string;
  parentTask: { id: string; content: string } | null;
  sprint: Sprint | null;
  doStamps: DoStamp[];
  createdAt: string;
};

export type TaskListItem = TaskWithRelations & {
  pinned: boolean;
  priority: number | null;
};

export type NodeType =
  | "task"
  | "quadrant"
  | "axisEndPoint"
  | "intersection"
  | "label";
export type EdgeType = "axis";

export type PostTaskRequest = {
  content: string;
  memo: string;
  positionX: number | null;
  positionY: number | null;
  dueDate: Date | null;
  categoryId: string | null;
  parentTaskId: string | null;
  sprintId: string | null;
  date: string | null;
};

export type PatchTaskRequest = Partial<{
  content: string;
  memo: string;
  dueDate: string | null;
  categoryId: string | null;
  parentTaskId: string | null;
  sprintId: string | null;
  comment: string | null;
  createdAt: string;
}>;

export type TaskFilter = {
  categoryId?: string | null;
  sprintId?: string | null;
  date?: string | null;
};
