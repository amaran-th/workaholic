"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import { withProtectedRoute } from "@/features/auth/components/ProtectedRoute";

function DashboardPage() {
  return (
    <div>
      대시보드 페이지
      <LogoutButton />
    </div>
  );
}

export default withProtectedRoute(DashboardPage);
