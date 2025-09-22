import SignupForm from "@/features/auth/components/SignupForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border rounded-lg shadow bg-white">
        <h1 className="text-xl font-bold mb-4">회원가입</h1>
        <SignupForm />
      </div>
    </div>
  );
}
