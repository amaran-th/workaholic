"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { CircleUser, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutMemberApi } from "../../auth/auth-api";
import { sessionAtom } from "../../auth/store/sessionAtom";

export default function MyButton() {
  const queryClient = useQueryClient();
  const [, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const logout = useMutation({
    mutationFn: logoutMemberApi,
    onSuccess: () => {
      setSession(null);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/login");
      router.refresh();
    },
  });

  const handleLogout = async () => {
    try {
      logout.mutate();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CircleUser size={32} strokeWidth={1} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push("/my")}>
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-error">
          <LogOut className="text-error" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
