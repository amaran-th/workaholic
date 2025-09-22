import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border rounded-lg shadow bg-white">
        <h1 className="text-xl font-bold mb-4">로그인</h1>
        <LoginForm />
      </div>
    </div>
  );
}
