import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/lib/utils/http";
import { Category, PostCategoryRequest } from "./types/category";

const API_BASE = "/api/category";

export async function getCategoriesApi(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}`);
  assertOk(res, "카테고리 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useGetCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(),
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
  assertOk(res, "카테고리 생성 실패");
  return res.json();
}

export async function patchCategoryApi({
  id,
  data,
}: {
  id: string;
  data: Partial<PostCategoryRequest>;
}): Promise<Category> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res, "카테고리 업데이트 실패");
  return res.json();
}

export async function deleteCategoryApi({ id }: { id: string }): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  assertOk(res, "카테고리 삭제 실패");
}
