"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const viewModes = [
  { path: "/", label: "아이젠하우어 매트릭스" },
  { path: "/list", label: "목록" },
  //{ path: "/calendar", label: "캘린더" },
];

export default function NavigationButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Popover>
        <PopoverTrigger className="w-[190px] border text-sm px-3 py-2 rounded-md text-left">
          {viewModes.find((mode) => pathname === mode.path)?.label ??
            "뷰 모드 선택"}
        </PopoverTrigger>
        <PopoverContent className="w-[190px] p-0">
          <div className="flex flex-col p-1 gap-1">
            {viewModes.map((mode) => (
              <Link
                key={mode.path}
                href={mode.path}
                className={cn(
                  "text-sm px-3 py-2 relative rounded-md hover:bg-accent",
                  {
                    "bg-accent": pathname === mode.path,
                  }
                )}
              >
                {mode.label}
                {pathname === mode.path && (
                  <span className="absolute right-2 top-0 h-full flex size-3.5 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
