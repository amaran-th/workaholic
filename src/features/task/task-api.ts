"use client";

import { useQuery } from "@tanstack/react-query";
import { TaskWithRelations } from "./types/task";

const API_BASE = "/api/task";

const getTasksApi = async (params: { memberId: string }) => {
  const res = await fetch(`${API_BASE}?memberId=${params.memberId}`);
  if (!res.ok) throw new Error("Task 불러오기 실패");
  return res.json();
};

export const useGetTasksQuery = (
  params: { memberId: string },
  options?: { enabled?: boolean }
) =>
  useQuery<TaskWithRelations[], Error>({
    queryKey: ["tasks", params],
    queryFn: () => getTasksApi(params),
    ...options,
  });

export const postTaskApi = async (params: TaskWithRelations) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Task 생성 실패");
  return res.json();
};
