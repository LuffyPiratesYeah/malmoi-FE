import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
