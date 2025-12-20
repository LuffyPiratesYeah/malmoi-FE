"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuthStore } from "@/lib/useAuthStore";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { TeacherVerificationModal } from "@/components/landing/TeacherVerificationModal";
import { BackgroundDecorations } from "@/components/landing/BackgroundDecorations";

export default function OnboardingPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [showTeacherVerificationModal, setShowTeacherVerificationModal] = useState(false);

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

    useEffect(() => {
        // Show teacher verification modal for unverified teachers
        if (isAuthenticated && user?.userType === "teacher" && !user?.isTeacher && user?.verificationStatus !== "pending") {
            setShowTeacherVerificationModal(true);
        }
    }, [isAuthenticated, user]);

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
            <BackgroundDecorations />

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
                <HeroSection />

                {/* Features Grid */}
                <FeaturesSection />

                {/* CTA Section */}
                <CTASection
                    primaryCtaHref={primaryCtaHref}
                    primaryCtaLabel={primaryCtaLabel}
                />
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm mt-20">
                <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-600">
                    <p>© 2025 말모이. All rights reserved.</p>
                </div>
            </footer>

            {/* Teacher Verification Modal */}
            <TeacherVerificationModal
                isOpen={showTeacherVerificationModal}
                onClose={() => setShowTeacherVerificationModal(false)}
            />
        </div>
    );
}
