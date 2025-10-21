export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  memberId: string;
  categoryId: string;
  createdAt: string;
}

export interface PostSprintRequest {
  name: string;
  startDate: string;
  endDate: string;
  memberId: string;
  categoryId: string;
}
