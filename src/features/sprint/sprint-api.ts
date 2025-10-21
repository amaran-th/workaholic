"use client";

import { useQuery } from "@tanstack/react-query";
import { Sprint } from "../task/types/task";
import { PostSprintRequest } from "./types/sprint";

const API_BASE = "/api/sprint";

const getSprintApi = async (params: {
  memberId?: string;
  categoryId?: string;
}): Promise<Sprint[]> => {
  const res = await fetch(
    `${API_BASE}?memberId=${params.memberId}&categoryId=${params.categoryId}`
  );
  if (!res.ok) throw new Error("스프린트 목록 불러오기 실패");
  return res.json();
};

export const useGetSprintQuery = (params: {
  memberId?: string;
  categoryId?: string;
}) =>
  useQuery<Sprint[], Error>({
    queryKey: ["sprint", params],
    queryFn: () => getSprintApi(params),
    enabled: !!params.categoryId && !!params.memberId,
  });

export async function postSprintApi(data: PostSprintRequest): Promise<Sprint> {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("스프린트 생성 실패");
  return res.json();
}

export async function patchSprintApi(
  id: string,
  data: Partial<PostSprintRequest>
): Promise<Sprint> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("스프린트 업데이트 실패");
  return res.json();
}

export async function deleteSprintApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

  if (!res.ok) throw new Error("스프린트 삭제 실패");
}
