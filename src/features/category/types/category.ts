import { Sprint } from "@/features/task/types/task";
import { Color } from "@/lib/data";

export interface Category {
  id: string;
  name: string;
  color: Color;
  createdAt?: string;
  updatedAt?: string;
  sprints: Sprint[];
}

export interface PostCategoryRequest {
  memberId: string;
  name: string;
  color: string;
}
