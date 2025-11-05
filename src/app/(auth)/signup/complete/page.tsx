import { HEADER_HEIGHT } from "@/lib/data";
import { Check, MailCheck } from "lucide-react";

export default function CompletePage() {
  return (
    <div
      className="flex w-full items-center justify-center p-6 md:p-10"
      style={{ minHeight: `calc(100svh - ${HEADER_HEIGHT}px)` }}
    >
      <div className="flex flex-col gap-4 items-center">
        <MailCheck className="size-12" />
        <p className="flex items-center gap-2 font-bold text-2xl ">
          <Check className="size-6 text-green-500" />
          이메일 인증이 완료되었습니다.
        </p>
        <a href="/login" className="underline underline-offset-4">
          로그인 페이지로
        </a>
      </div>
    </div>
  );
}
