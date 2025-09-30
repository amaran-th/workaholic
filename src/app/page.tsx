"use client";

import { withProtectedRoute } from "@/features/auth/components/ProtectedRoute";

import TaskMatrix from "@/features/task/matrix/TaskMatrix";
import { useEffect, useState } from "react";

function MatrixPage() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight - 48);
  }, []);

  if (!height) return null;
  return (
    <div style={{ height }}>
      <TaskMatrix />
    </div>
  );
}

export default withProtectedRoute(MatrixPage);
