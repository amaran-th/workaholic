"use client";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// P extends object 제약 추가
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const Component = (props: P) => {
    const session = useAtomValue(sessionAtom);
    const router = useRouter();

    useEffect(() => {
      if (!session) {
        router.replace("/login");
      }
    }, [session, router]);

    if (!session) return null; // 로그인 전에는 렌더링 안 함

    return <WrappedComponent {...props} />;
  };

  return Component;
}
