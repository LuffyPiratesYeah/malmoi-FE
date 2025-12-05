import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

const pretendard = localFont({
  src: "../public/fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Malmoi - Korean Tutoring Platform",
  description: "Connect with native Korean tutors for 1:1 video lessons.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'white',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
              style: {
                border: '1px solid #10b981',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
