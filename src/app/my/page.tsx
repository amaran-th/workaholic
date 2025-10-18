"use client";

import { withProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import MyCategory from "@/features/member/components/MyCategory";
import Profile from "@/features/member/components/Profile";

function MyPage() {
  return (
    <div>
      <Profile />
      <MyCategory />
    </div>
  );
}

export default withProtectedRoute(MyPage);
