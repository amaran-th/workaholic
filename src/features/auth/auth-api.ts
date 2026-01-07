"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/lib/utils/http";
import { MemberSession } from "./types/auth";

const API_BASE = "/api/auth";

const getSessionApi = async () => {
  const res = await fetch(`${API_BASE}/session`);
  assertOk(res, "세션 불러오기 실패");
  return res.json();
};

export const useGetSessionQuery = () =>
  useQuery<MemberSession, Error>({
    queryKey: ["session"],
    queryFn: () => getSessionApi(),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

export const loginMemberApi = async (params: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  assertOk(res, "로그인 실패");
  return res.json();
};

export const logoutMemberApi = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
  });

  assertOk(res, "로그아웃 실패");
  return res.json();
};

export const postMemberApi = async (params: {
  email: string;
  password: string;
  name: string;
}) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  assertOk(res, "회원가입 실패");
};
