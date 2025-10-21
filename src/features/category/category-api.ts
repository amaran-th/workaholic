import { useQuery } from "@tanstack/react-query";
import { Category, PostCategoryRequest } from "./types/category";

const API_BASE = "/api/category";

export async function getCategoriesApi(params: {
  memberId?: string;
}): Promise<Category[]> {
  const res = await fetch(`${API_BASE}?memberId=${params.memberId}`);
  if (!res.ok) {
    throw new Error("카테고리 목록을 불러오지 못했습니다.");
  }
  return res.json();
}

export function useGetCategoriesQuery(params: { memberId?: string }) {
  return useQuery<Category[]>({
    queryKey: ["categories", params],
    queryFn: () => getCategoriesApi(params),
    enabled: !!params.memberId,
  });
}

export async function postCategoryApi(
  data: PostCategoryRequest
): Promise<Category> {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("카테고리 생성 실패");
  return res.json();
}

export async function patchCategoryApi(
  id: string,
  data: Partial<PostCategoryRequest>
): Promise<Category> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("카테고리 업데이트 실패");
  return res.json();
}

export async function deleteCategoryApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("카테고리 삭제 실패");
}
