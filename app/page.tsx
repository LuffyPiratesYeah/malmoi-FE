"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuthStore } from "@/lib/useAuthStore";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const primaryCtaHref = isAuthenticated
        ? user?.userType === "admin"
            ? "/admin/verification"
            : "/main"
        : "/signup";
    const primaryCtaLabel = isAuthenticated
        ? user?.userType === "admin"
            ? "관리자 페이지"
            : "내 대시보드"
        : "무료로 시작하기";

    useEffect(() => {
        // Wait for client-side hydration of auth store
        setIsLoading(false);
    }, []);

    // 로딩 중이면 로딩 화면 표시
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Logo size="lg" />
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Simple Header */}
            <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <Logo size="sm" />
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link href={primaryCtaHref}>
                                <Button
                                    className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-lg shadow-blue-200/50"
                                >
                                    {primaryCtaLabel}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="h-10 px-5 rounded-full border-gray-300 hover:bg-gray-50 text-sm font-medium"
                                    >
                                        로그인
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button
                                        className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-lg shadow-blue-200/50"
                                    >
                                        회원가입
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            1:1 화상 한국어 수업 플랫폼
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                            말모이와 함께
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                한국어를 배워요
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                            원어민 선생님과 1:1 맞춤 수업으로
                            <br />
                            <span className="font-medium text-gray-900">자연스럽고 실용적인 한국어</span>를 배우세요
                        </p>

                        {/* Main CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/class" className="w-full sm:w-auto">
                                <Button
                                    className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                                    size="lg"
                                >
                                    수업 둘러보기
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    다양한 수업
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    비즈니스, K-드라마, TOPIK 등<br />
                                    목적에 맞는 맞춤 수업을<br />
                                    선택하세요
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    전문 선생님
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    경험 많은 원어민 선생님과<br />
                                    체계적이고 즐겁게<br />
                                    학습하세요
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    편리한 예약
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    원하는 시간에<br />
                                    간편하게 수업을<br />
                                    예약하세요
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mx-auto max-w-4xl px-6 py-16">
                    <div className="bg-primary rounded-3xl p-12 text-center shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            지금 바로 시작하세요
                        </h2>
                        <p className="text-blue-100 text-lg mb-8">
                            첫 수업을 예약하고 한국어 실력을 향상시켜보세요
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={primaryCtaHref} className="w-full sm:w-auto">
                                <Button
                                    className="w-full sm:w-auto h-12 px-8 bg-white text-gray-900 hover:bg-gray-50 font-bold rounded-xl shadow-lg"
                                    size="lg"
                                >
                                    <p className="text-gray-900 hover:text-white">{primaryCtaLabel}</p>
                                </Button>
                            </Link>
                            <Link href="/class" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto h-12 px-8 border-2 border-white text-white hover:bg-white/10 font-bold rounded-xl"
                                    size="lg"
                                >
                                    수업 둘러보기
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm mt-20">
                <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-600">
                    <p>© 2025 말모이. All rights reserved.</p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
