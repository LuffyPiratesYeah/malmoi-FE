"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useAuthStore } from "@/lib/useAuthStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // Call API route for login
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "아이디 또는 비밀번호가 올바르지 않습니다.");
                setLoading(false);
                return;
            }

            // Login successful
            login({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                userType: data.user.userType,
                isTeacher: data.user.isTeacher,
                profileImage: data.user.profileImage,
                verificationStatus: data.user.verificationStatus,
            });

            // Redirect to dashboard without polluting history
            const destination = data.user.userType === "admin" ? "/admin/verification" : "/main";
            router.replace(destination);
        } catch (err) {
            setError("로그인 중 오류가 발생했습니다.");
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            leftContent={
                <div className="space-y-6">
                    <div className="flex items-end gap-2">
                        <Logo size="lg" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            의 회원이 아니신가요?
                        </h1>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                        회원으로 가입하고<br />
                        말모이의 모든 기능을 사용하세요
                    </p>
                    <Link href="/signup" className="inline-block">
                        <Button variant="outline" className="w-32 rounded-full border-primary text-primary hover:bg-blue-50">
                            회원가입
                        </Button>
                    </Link>
                </div>
            }
        >
            <div className="mx-auto w-full max-w-md space-y-12">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="뒤로가기"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="flex-1 text-center text-3xl font-normal text-gray-900">Login</h2>
                    <div className="w-6"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-8">
                        <Input
                            name="email"
                            placeholder="이메일을 입력해주세요"
                            type="email"
                            required
                            disabled={loading}
                        />
                        <Input
                            name="password"
                            placeholder="비밀번호를 입력해주세요"
                            type="password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <Button
                        className="w-full h-12 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white font-bold rounded-xl"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
