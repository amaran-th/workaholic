import SignupForm from "@/features/auth/components/SignupForm";

export default function LoginPage() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10 grow">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
