"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useAuthStore } from "@/lib/useAuthStore";
import { db } from "@/lib/db";
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
        const username = formData.get("id") as string;
        const password = formData.get("password") as string;

        try {
            const user = await db.auth.login(username, password);

            if (!user) {
                setError("아이디 또는 비밀번호가 올바르지 않습니다.");
                setLoading(false);
                return;
            }

            // Login successful
            login({
                id: user.id,
                name: user.name,
                userType: user.userType,
            });

            // Redirect to home
            router.push("/");
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
                <h2 className="text-center text-3xl font-normal text-gray-900">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-8">
                        <Input
                            name="id"
                            placeholder="아이디를 입력해주세요"
                            type="text"
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
