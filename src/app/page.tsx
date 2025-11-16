"use client";

import TaskMatrix from "@/features/task/components/matrix/TaskMatrix";
import TaskStorage from "@/features/task/components/matrix/TaskStorage";
import { HEADER_HEIGHT } from "@/lib/data";
import { useEffect, useState } from "react";

function MatrixPage() {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setHeight(window.innerHeight - HEADER_HEIGHT);
  }, []);

  if (!height) return null;
  return (
    <div className="flex flex-row-reverse" style={{ height }}>
      <TaskMatrix />
      <TaskStorage />
    </div>
  );
}

export default MatrixPage;
