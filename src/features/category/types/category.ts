import { Color } from "@/lib/data";

export interface Category {
  id: string;
  name: string;
  color: Color;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostCategoryRequest {
  memberId: string;
  name: string;
  color: string;
}
