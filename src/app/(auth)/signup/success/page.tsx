import { Check, Mails } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-4 items-center">
        <Mails className="size-12" />
        <p className="flex items-center gap-2 font-bold text-2xl ">
          <Check className="size-6 text-green-500" />
          회원가입에 성공했습니다
        </p>
        <p className="text-gray-500">메일함을 확인해주세요.</p>
      </div>
    </div>
  );
}
