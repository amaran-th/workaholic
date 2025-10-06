export type DoStamp = {
  id: string;
  taskId: string;
  createdAt: string; // ISO string
};

export type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type TaskCategory = {
  id: string;
  name: string;
  color: "white" | "blue" | "green";
};

export type TaskStatus = "PENDING" | "DOING" | "DONE";

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
  category: TaskCategory;
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
  positionX: number | null;
  positionY: number | null;
  dueDate: Date|null;
  categoryId: string | null;
  parentTaskId: string | null;
  sprintId: string | null;
}>;

export type TaskFilter = {
  memberId: string;
  categoryId?: string;
  sprintId?: string;
  startDateAfter?: string;
  endDateBefore?: string;
  createdAtAfter?: string;
};
