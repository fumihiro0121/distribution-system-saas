import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "物流管理システム | Distribution Management System",
  description: "メーカー、梱包業者、フォワーダー間の物流プロセスを一元管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
