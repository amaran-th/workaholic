import { Button } from "@/components/ui/button";
import MyButton from "@/features/shared/components/MyButton";
import { HEADER_HEIGHT } from "@/lib/data";
import { getServerUser } from "@/lib/supabase/server";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import NavigationButton from "./NavigationButton";

export const dynamic = "force-dynamic";

export default async function Header() {
  const session = await getServerUser();
  return (
    <div
      className={cn(
        "bg-black text-white flex p-2 justify-between items-center gap-4"
      )}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="">
        <Link href="/">일을:하자</Link>
      </div>

      <div>
        {session ? (
          <div className="flex gap-1">
            <NavigationButton />
            <MyButton />
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/40"
            >
              로그인
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
