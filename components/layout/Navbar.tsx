"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/useAuthStore";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

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

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // 메인 링크 경로: 로그인 시 /main, 비로그인 시 /
    const mainPath = isAuthenticated ? "/main" : "/";

    return (
        <nav className="border-b border-[#d9d9d9] bg-white h-[60px] flex items-center">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8">
                <Link href={mainPath}>
                    <Logo size="sm" />
                </Link>

                <div className="flex items-center gap-12 text-[14px]">
                    <Link href={mainPath} className={getLinkClassName(mainPath)}>
                        메인
                    </Link>
                    {/* 스케줄 메뉴 제거됨 */}
                    <Link href="/class" className={getLinkClassName("/class")}>
                        수업
                    </Link>
                </div>

                <div className="flex items-center gap-8 text-[14px]">
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile" className={getLinkClassName("/profile")}>
                                {user?.name || "사용자"}님
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="font-light text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className="h-9 px-6 rounded-full border-gray-300 hover:bg-gray-50"
                                >
                                    로그인
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button
                                    className="h-9 px-6 rounded-full bg-primary hover:bg-primary/90 text-white"
                                >
                                    회원가입
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
