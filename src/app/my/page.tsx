"use client";

import { withProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import MyCategory from "@/features/member/components/MyCategory";
import MyProfile from "@/features/member/components/MyProfile";

function MyPage() {
  return (
    <div className="flex flex-col gap-8 items-center py-16">
      <MyProfile />
      <MyCategory />
    </div>
  );
}

export default withProtectedRoute(MyPage);
