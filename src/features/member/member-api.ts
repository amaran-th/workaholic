"use client";

import { useQuery } from "@tanstack/react-query";
import { MemberPosition } from "./types/member";

const API_BASE = "/api/member";

const getCenterPositionApi = async (params: { memberId: string }) => {
  const res = await fetch(`${API_BASE}/${params.memberId}/position`);
  if (!res.ok) throw new Error("중심 좌표 불러오기 실패");
  return res.json();
};

export const useGetCenterPositionQuery = (
  params: { memberId: string },
  options?: { enabled?: boolean }
) =>
  useQuery<MemberPosition, Error>({
    queryKey: ["member-position", params],
    queryFn: () => getCenterPositionApi(params),
    ...options,
  });

export async function updatePositionApi({
  memberId,
  left,
  right,
  top,
  bottom,
  centerX,
  centerY,
}: {
  memberId: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}) {
  const res = await fetch(`/api/member/${memberId}/position`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ left, right, top, bottom, centerX, centerY }),
  });
  if (!res.ok) throw new Error("센터 포지션 업데이트 실패");
  return res.json();
}
