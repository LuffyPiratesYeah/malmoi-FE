import { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface AuthLayoutProps {
    children: ReactNode;
    leftContent: ReactNode;
}

export function AuthLayout({ children, leftContent }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side */}
            <div className="hidden w-1/2 flex-col justify-center px-20 lg:flex">
                {leftContent}
            </div>

            {/* Right Side */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
                {children}
            </div>
        </div>
    );
}
