export interface Sprint {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  memberId: string;
  categoryId: string;
  createdAt: string;
}

export interface PostSprintRequest {
  name: string;
  startDate: string | null;
  endDate: string | null;
  memberId: string;
  categoryId: string;
}
