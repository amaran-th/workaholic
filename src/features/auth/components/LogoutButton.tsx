"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { sessionAtom } from "../store/sessionAtom";

export default function LogoutButton() {
  const [, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        // Atom 등 상태 초기화 후 로그인 페이지로 이동
        setSession(null);
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
