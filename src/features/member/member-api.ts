"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/lib/utils/http";
import {
  MemberInfo,
  MemberInfoPatchRequest,
  MemberPosition,
} from "./types/member";

const API_BASE = "/api/member";

const getMemberInfoApi = async () => {
  const res = await fetch(API_BASE);
  assertOk(res, "회원 정보 불러오기 실패");
  return res.json();
};

export const useGetInfoQuery = () =>
  useQuery<MemberInfo, Error>({
    queryKey: ["member-info"],
    queryFn: () => getMemberInfoApi(),
  });

const getCenterPositionApi = async () => {
  const res = await fetch(`${API_BASE}/position`);
  assertOk(res, "중심 좌표 불러오기 실패");
  return res.json();
};

export const useGetCenterPositionQuery = (options?: { enabled?: boolean }) =>
  useQuery<MemberPosition, Error>({
    queryKey: ["member-position"],
    queryFn: () => getCenterPositionApi(),
    ...options,
  });

export async function patchPositionApi({
  left,
  right,
  top,
  bottom,
}: Partial<{
  left: number;
  right: number;
  top: number;
  bottom: number;
}>) {
  const res = await fetch(`${API_BASE}/position`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ left, right, top, bottom }),
  });
  assertOk(res, "센터 포지션 업데이트 실패");
  return res.json();
}

export async function patchMemberInfoApi({
  data,
}: {
  data: Partial<MemberInfoPatchRequest>;
}): Promise<MemberInfo> {
  const res = await fetch(`${API_BASE}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res, "멤버 정보 업데이트 실패");
  return res.json();
}
