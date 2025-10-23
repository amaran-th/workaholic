"use client";

import { Button } from "@/components/ui/button";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import MyButton from "@/features/shared/components/MyButton";
import { HEADER_HEIGHT } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavigationButton from "./NavigationButton";

export default function Header() {
  const [session, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  return (
    <div
      className={cn(
        "bg-black text-white flex p-2 items-center gap-4",
        `h-[${HEADER_HEIGHT}px]`
      )}
    >
      <div className="">
        <Link href="/">워커홀릭</Link>
      </div>
      <div className="flex-1 rounded-3xl bg-gray-600 p-1 px-4">광고</div>
      <div className="">
        {session?.access_token ? (
          <div className="flex gap-1">
            <NavigationButton />
            <MyButton />
          </div>
        ) : (
          <Button onClick={() => router.push("/login")}>로그인</Button>
        )}
      </div>
    </div>
  );
}
