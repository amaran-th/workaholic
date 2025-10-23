"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const viewModes = [
  { path: "/", label: "아이젠하우어 매트릭스" },
  { path: "/list", label: "목록" },
  { path: "/calendar", label: "캘린더" },
];

export default function NavigationButton() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const handleSelect = (value: string) => {
    router.push(value);
  };
  return (
    <Select
      onValueChange={handleSelect}
      value={
        viewModes.map((mode) => mode.path).includes(pathname)
          ? pathname
          : undefined
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="뷰 모드 선택" />
      </SelectTrigger>
      <SelectContent>
        {viewModes.map((mode) => (
          <SelectItem key={mode.path} value={mode.path}>
            {mode.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
