"use client";

import TaskList from "@/features/task/components/list/TaskList";

function ListPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:py-8">
      <TaskList />
    </div>
  );
}

export default ListPage;

// 새 task 생성 -> 기본적으로 pin 상태(매트릭스 범위 내에 있음, 매트릭스 범위 바깥에 있을 경우 보이지 않음)
