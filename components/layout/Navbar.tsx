"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/useAuthStore";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // 메인 링크 경로: 로그인 시 /main, 비로그인 시 /
    const mainPath = isAuthenticated
        ? user?.userType === "admin"
            ? "/admin/verification"
            : "/main"
        : "/";

    return (
        <>
            <nav className="border-b border-[#d9d9d9] bg-white h-[60px] flex items-center relative z-50">
                <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8">
                    <Link href={mainPath}>
                        <Logo size="sm" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden min-[430px]:flex items-center gap-12 text-[14px]">
                        <Link href={mainPath} className={getLinkClassName(mainPath)}>
                            메인
                        </Link>
                        <Link href="/class" className={getLinkClassName("/class")}>
                            수업
                        </Link>
                        {isAuthenticated && user?.userType === "student" && (
                            <Link href="/schedule" className={getLinkClassName("/schedule")}>
                                스케줄
                            </Link>
                        )}
                        {isAuthenticated && user?.isTeacher && (
                            <Link href="/manage-classes" className={getLinkClassName("/manage-classes")}>
                                수업 관리
                            </Link>
                        )}
                    </div>

                    <div className="hidden min-[430px]:flex items-center gap-8 text-[14px]">
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

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="min-[430px]:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="메뉴"
                    >
                        <Image src="/hambugger.svg" alt="메뉴" width={32} height={32} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 min-[430px]:hidden transition-opacity duration-300 ${
                        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Mobile Menu Panel */}
                <div className={`fixed top-[60px] right-0 bottom-0 w-64 bg-white shadow-lg z-40 min-[430px]:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                        <div className="flex flex-col p-6 space-y-6">
                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-4">
                                <Link
                                    href={mainPath}
                                    className="text-gray-900 hover:text-primary font-medium transition-colors py-2"
                                    onClick={handleLinkClick}
                                >
                                    메인
                                </Link>
                                <Link
                                    href="/class"
                                    className="text-gray-900 hover:text-primary font-medium transition-colors py-2"
                                    onClick={handleLinkClick}
                                >
                                    수업
                                </Link>
                                {isAuthenticated && user?.userType === "student" && (
                                    <Link
                                        href="/schedule"
                                        className="text-gray-900 hover:text-primary font-medium transition-colors py-2"
                                        onClick={handleLinkClick}
                                    >
                                        스케줄
                                    </Link>
                                )}
                                {isAuthenticated && user?.isTeacher && (
                                    <Link
                                        href="/manage-classes"
                                        className="text-gray-900 hover:text-primary font-medium transition-colors py-2"
                                        onClick={handleLinkClick}
                                    >
                                        수업 관리
                                    </Link>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200" />

                            {/* Auth Section */}
                            <div className="flex flex-col space-y-3">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="text-gray-900 hover:text-primary font-medium transition-colors py-2"
                                            onClick={handleLinkClick}
                                        >
                                            {user?.name || "사용자"}님
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="text-left text-gray-500 hover:text-gray-900 font-medium transition-colors py-2"
                                        >
                                            로그아웃
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={handleLinkClick}>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-full border-gray-300 hover:bg-gray-50"
                                            >
                                                로그인
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={handleLinkClick}>
                                            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white">
                                                회원가입
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
            </>
        </>
    );
}
