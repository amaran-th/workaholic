"use client";

import QueryProvider from "@/providers/QueryProvider";
import StateProvider from "@/providers/StateProvider";
import { ReactFlowProvider } from "@xyflow/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactFlowProvider>
      <QueryProvider>
        <StateProvider>
          <main>{children}</main>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </StateProvider>
      </QueryProvider>
    </ReactFlowProvider>
  );
}
