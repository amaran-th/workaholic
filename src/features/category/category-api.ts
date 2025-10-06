import { useQuery } from "@tanstack/react-query";
import { Category } from "./types/category";

const API_BASE = "/api/category";

export async function getCategoriesApi(params: {
  memberId: string;
}): Promise<Category[]> {
  const res = await fetch(`${API_BASE}?memberId=${params.memberId}`);
  if (!res.ok) {
    throw new Error("카테고리 목록을 불러오지 못했습니다.");
  }
  return res.json();
}

export function useGetCategoriesQuery(
  params: { memberId: string },
  options?: { enabled?: boolean }
) {
  return useQuery<Category[]>({
    queryKey: ["categories", params],
    queryFn: () => getCategoriesApi(params),
    ...options,
  });
}
