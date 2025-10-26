import { Category } from "@/features/category/types/category";
import { Sprint } from "@/features/sprint/types/sprint";

export type DoStamp = {
  id: string;
  taskId: string;
  createdAt: string; // ISO string
};
export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  COMPLETED = "COMPLETED",
  QUIT = "QUIT",
  ICE = "ICE",
}
export enum DayTaskStatus {
  TODO,
  DOINT,
  COMPLTED,
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
  positionX: number;
  positionY: number;
  category: Category;
  memberId: string;
  parentTask: { id: string; content: string } | null;
  sprint: Sprint | null;
  doStamps: DoStamp[];
};

export interface CreateTaskInput {
  memberId: string;
  content: string;
  categoryId: string;
  parentTaskId?: string;
  positionX?: number;
  positionY?: number;
}

export type NodeType = "task" | "quadrant" | "axisEndPoint" | "intersection";
export type EdgeType = "axis";

export type PostTaskRequest = {
  content: string;
  memo: string;
  positionX: number | null;
  positionY: number | null;
  dueDate: Date | null;
  memberId: string;
  categoryId: string | null;
  parentTaskId: string | null;
  sprintId: string | null;
};

export type PatchTaskRequest = Partial<{
  content: string;
  memo: string;
  dueDate: Date | null;
  categoryId: string | null;
  parentTaskId: string | null;
  sprintId: string | null;
}>;

export type TaskFilter = {
  memberId: string;
  categoryId?: string | null;
  sprintId?: string | null;
  date?: string | null;
};
