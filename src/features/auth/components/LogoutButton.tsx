"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { logoutMemberApi } from "../auth-api";
import { sessionAtom } from "../store/sessionAtom";

export default function LogoutButton() {
  const [, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMemberApi();
      setSession(null);
      router.push("/login");
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
