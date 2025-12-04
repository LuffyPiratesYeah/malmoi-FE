import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
      </body>
    </html>
  );
}
