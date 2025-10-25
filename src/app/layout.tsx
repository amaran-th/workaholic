import SessionInitializer from "@/features/auth/components/SessionInitializer";
import Header from "@/features/shared/components/Header";
import QueryProvider from "@/providers/QueryProvider";
import StateProvider from "@/providers/StateProvider";
import { ReactFlowProvider } from "@xyflow/react";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "일을:하자",
  description: "다양한 뷰 모드를 제공하는 업무 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-nanum antialiased">
        <ReactFlowProvider>
          <QueryProvider>
            <StateProvider>
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
              <SessionInitializer />
              <Header />
              {children}
            </StateProvider>
          </QueryProvider>
        </ReactFlowProvider>
      </body>
    </html>
  );
}
