import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freedom Training - Nền tảng học tập trực tuyến",
  description: "Nền tảng học tập và kiểm tra kiến thức trực tuyến cho sinh viên",
  icons: {
    icon: '/17164524823262_logo-web-con-voi.png',
    shortcut: '/17164524823262_logo-web-con-voi.png',
    apple: '/17164524823262_logo-web-con-voi.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
