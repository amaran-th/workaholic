"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MemberInfo,
  MemberInfoPatchRequest,
  MemberPosition,
} from "./types/member";

const API_BASE = "/api/member";

const getMemberInfoApi = async (params: { memberId?: string }) => {
  const res = await fetch(`${API_BASE}/${params.memberId}`);
  if (!res.ok) throw new Error("회원 정보 불러오기 실패");
  return res.json();
};

export const useGetInfoQuery = (params: { memberId?: string }) =>
  useQuery<MemberInfo, Error>({
    queryKey: ["member-info", params],
    queryFn: () => getMemberInfoApi(params),
    enabled: !!params.memberId,
  });

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

export async function patchPositionApi({
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
  const res = await fetch(`${API_BASE}/${memberId}/position`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ left, right, top, bottom, centerX, centerY }),
  });
  if (!res.ok) throw new Error("센터 포지션 업데이트 실패");
  return res.json();
}

export async function patchMemberInfoApi({
  id,
  data,
}: {
  id: string;
  data: Partial<MemberInfoPatchRequest>;
}): Promise<MemberInfo> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("멤버 정보 업데이트 실패");
  return res.json();
}
