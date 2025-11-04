import SignupForm from "@/features/auth/components/SignupForm";
import { HEADER_HEIGHT } from "@/lib/data";

export default function LoginPage() {
  return (
    <div
      className="flex w-full items-center justify-center p-6 md:p-10"
      style={{ minHeight: `calc(100svh - ${HEADER_HEIGHT}px)` }}
    >
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
