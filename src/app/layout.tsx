import Header from "@/features/shared/components/Header";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "일을:하자",
  description: "다양한 뷰 모드를 제공하는 업무 관리 서비스",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-nanum antialiased">
        <ClientLayout>
          <Header />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
