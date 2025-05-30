import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Freedom Training - Nền tảng học tập thông minh",
  description: "Nền tảng học tập và kiểm tra kiến thức trực tuyến với hệ thống phần thưởng TUTE độc đáo cho sinh viên Việt Nam",
  keywords: ["học tập", "quiz", "sinh viên", "TUTE", "phần thưởng", "giáo dục", "trực tuyến"],
  authors: [{ name: "Freedom Training Team" }],
  creator: "Freedom Training",
  publisher: "Freedom Training",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/17164524823262_logo-web-con-voi.png',
    shortcut: '/17164524823262_logo-web-con-voi.png',
    apple: '/17164524823262_logo-web-con-voi.png',
  },
  metadataBase: new URL('https://freedom-training.vercel.app'),
  openGraph: {
    title: "Freedom Training - Nền tảng học tập thông minh",
    description: "Học tập thông minh, kiếm điểm TUTE thực tế với hệ thống phần thưởng TUTE độc đáo",
    url: 'https://freedom-training.vercel.app',
    siteName: 'Freedom Training',
    images: [
      {
        url: '/17164524823262_logo-web-con-voi.png',
        width: 1200,
        height: 630,
        alt: 'Freedom Training Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Freedom Training - Nền tảng học tập thông minh",
    description: "Học tập thông minh, hệ thống phần thưởng TUTE độc đáo",
    images: ['/17164524823262_logo-web-con-voi.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            <Navigation />
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
