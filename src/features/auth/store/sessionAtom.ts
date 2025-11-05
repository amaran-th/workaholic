import { atom } from "jotai";
import { MemberSession } from "../types/auth";

export const sessionAtom = atom<MemberSession | null>(null);
