"use client";

import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function Header() {
  const [session, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  return (
    <div className="bg-black text-white flex p-2 items-center">
      <div className="flex-1">워커홀릭</div>
      <div className="flex-1 rounded-3xl bg-gray-600 p-1 px-4">광고</div>
      <div className="flex-1">옵션</div>
    </div>
  );
}
