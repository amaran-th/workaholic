"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutMemberApi } from "../../auth/auth-api";
import { sessionAtom } from "../../auth/store/sessionAtom";

export default function MyButton() {
  const [, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const logout = useMutation({
    mutationFn: logoutMemberApi,
    onSuccess: () => {
      setSession(null);
      router.push("/login");
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
        <Button>MY</Button>
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
