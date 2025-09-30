"use client";

const API_BASE = "/api/auth";

export const loginMemberApi = async (params: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error("로그인 실패");
  return res.json();
};

export const logoutMemberApi = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("로그아웃 실패");
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

  if (!res.ok) throw new Error("회원가입 실패");
};
