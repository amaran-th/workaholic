import { TaskStatus } from "@prisma/client";

export type DoStamp = {
  id: string;
  taskId: string;
  createdAt: string; // ISO string
};

export type TaskWithRelations = {
  id: string;
  no: number;
  content: string;
  memo: string | null;
  status: TaskStatus;
  startDate: string | null;
  endDate: string | null;
  dueDate: string | null;
  comment: string | null;
  positionX: number;
  positionY: number;
  categoryId: string;
  memberId: string;
  parentTask?: {
    id: string;
    content: string;
  } | null;
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
