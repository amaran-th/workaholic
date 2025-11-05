"use client";

import MyCategory from "@/features/member/components/MyCategory";
import MyProfile from "@/features/member/components/MyProfile";

function MyPage() {
  return (
    <div className="flex flex-col gap-8 items-center p-4 md:py-16">
      <MyProfile />
      <MyCategory />
    </div>
  );
}

export default MyPage;
