import { atom } from "jotai";
import { MemberSession } from "../types/auth";

const getInitialSession = (): MemberSession | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("session");
  return stored ? JSON.parse(stored) : null;
};

// atom 생성
export const rawSessionAtom = atom<MemberSession | null>(getInitialSession());

// atom 구독해서 localStorage에 반영
export const sessionAtom = atom(
  (get) => get(rawSessionAtom),
  (get, set, update: MemberSession | null) => {
    set(rawSessionAtom, update);
    if (update) localStorage.setItem("session", JSON.stringify(update));
    else localStorage.removeItem("session");
  }
);
