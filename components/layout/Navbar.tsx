"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + "/");
    };

    const getLinkClassName = (path: string) => {
        const baseClass = "font-light transition-all duration-200 relative";
        if (isActive(path)) {
            return `${baseClass} text-primary after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full`;
        }
        return `${baseClass} text-black hover:text-primary`;
    };

    return (
        <nav className="border-b border-[#d9d9d9] bg-white h-[60px] flex items-center">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8">
                <Link href="/">
                    <Logo size="sm" />
                </Link>

                <div className="flex items-center gap-12 text-[14px]">
                    <Link href="/" className={getLinkClassName("/")}>
                        메인
                    </Link>
                    <Link href="/schedule" className={getLinkClassName("/schedule")}>
                        스케줄
                    </Link>
                    <Link href="/class" className={getLinkClassName("/class")}>
                        수업
                    </Link>
                </div>

                <div className="flex items-center gap-8 text-[14px]">
                    <Link href="/profile" className={getLinkClassName("/profile")}>
                        디포네님
                    </Link>
                    <Link href="/login" className="font-light text-gray-500 hover:text-gray-900">
                        로그아웃
                    </Link>
                </div>
            </div>
        </nav>
    );
}
