"use client";

import { toQueryString } from "@/lib/utils/queryString";
import { useQuery } from "@tanstack/react-query";
import {
  PatchTaskRequest,
  PostTaskRequest,
  TaskFilter,
  TaskListItem,
  TaskWithRelations,
} from "./types/task";

const API_BASE = "/api/task";

const getMatrixTasksApi = async (params: TaskFilter) => {
  const queryString = toQueryString(params);
  const res = await fetch(`${API_BASE}/matrix${queryString}`);
  if (!res.ok) throw new Error("Task 불러오기 실패");
  return res.json();
};

export const useGetMatrixTasksQuery = (
  params: TaskFilter,
  options?: { enabled?: boolean }
) =>
  useQuery<TaskWithRelations[], Error>({
    queryKey: ["matrix-tasks", params],
    queryFn: () => getMatrixTasksApi(params),
    ...options,
  });

const getListTasksApi = async (params: TaskFilter) => {
  const queryString = toQueryString(params);
  const res = await fetch(`${API_BASE}/list${queryString}`);
  if (!res.ok) throw new Error("리스트 뷰 Task 불러오기 실패");
  return res.json();
};

export const useGetListTasksQuery = (
  params: TaskFilter,
  options?: { enabled?: boolean }
) =>
  useQuery<TaskListItem[], Error>({
    queryKey: ["list-tasks", params],
    queryFn: () => getListTasksApi(params),
    ...options,
  });

export const postTaskApi = async (params: PostTaskRequest) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Task 생성 실패");
  return res.json();
};

export const patchTaskApi = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: PatchTaskRequest;
}) => {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Task 수정 실패");
  return res.json();
};

export const patchTaskStartDateApi = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: { date: string | null };
}) => {
  const res = await fetch(`${API_BASE}/${taskId}/start`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Task 시작일 수정 실패");
  return res.json();
};

export const patchTaskEndDateApi = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: { date: string | null };
}) => {
  const res = await fetch(`${API_BASE}/${taskId}/end`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Task 종료일 수정 실패");
  return res.json();
};

export const patchTaskPositionApi = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: { positionX: number; positionY: number; positionDate: string };
}) => {
  const res = await fetch(`${API_BASE}/${taskId}/position`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Task 위치 수정 실패");
  return res.json();
};

export const deleteTaskApi = async ({ taskId }: { taskId: string }) => {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Task 삭제 실패");
  return res.json();
};

export const toggleDoingStamp = async ({
  taskId,
  params,
}: {
  taskId: string;
  params: { date: string };
}) => {
  const res = await fetch(`${API_BASE}/${taskId}/stamp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("stamp 실패");
  return res.json();
};

export const toggleCompleteStamp = async ({
  taskId,
  params,
}: {
  taskId: string;
  params: { date: string };
}) => {
  const res = await fetch(`${API_BASE}/${taskId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("complete 실패");
  return res.json();
};
