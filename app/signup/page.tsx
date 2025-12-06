"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/useAuthStore";

export default function SignupPage() {
    const [error, setError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<"student" | "teacher">("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        if (!cooldown) return;

        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    async function handleSendCode() {
        setError("");
        setInfoMessage("");

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setError("이메일을 입력해주세요.");
            return;
        }

        setIsSendingCode(true);
        try {
            const response = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "인증코드를 보내지 못했습니다.");
                return;
            }

            setInfoMessage(
                data.code
                    ? `인증 코드가 전송되었습니다. 현재 테스트용 코드: ${data.code}`
                    : "인증 코드가 전송되었습니다."
            );
            setCooldown(data.cooldown ?? 60);
        } catch (err) {
            setError("인증코드 발송 중 문제가 발생했습니다.");
        } finally {
            setIsSendingCode(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setInfoMessage("");
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedName = name.trim();
        const trimmedCode = verificationCode.trim();

        if (!trimmedEmail || !password || !trimmedName || !trimmedCode) {
            setError("모든 필드를 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            // Call API route for signup
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: trimmedEmail, password, name: trimmedName, userType, verificationCode: trimmedCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "회원가입 중 오류가 발생했습니다.");
                return;
            }

            // Signup successful - auto login
            login({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                userType: data.user.userType,
                isTeacher: data.user.isTeacher,
                profileImage: data.user.profileImage,
                verificationStatus: data.user.verificationStatus,
            });

            // Redirect to dashboard without stacking history
            router.replace("/main");
        } catch (err) {
            setError("회원가입 중 오류가 발생했습니다.");
        } finally {
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
                            에 오신걸 환영해요!
                        </h1>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                        곧 있으면 말모이를 만나볼수있어요!
                    </p>
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
                    <h2 className="flex-1 text-center text-3xl font-normal text-gray-900">Sign up</h2>
                    <div className="w-6"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    name="email"
                                    placeholder="이메일을 입력해주세요"
                                    type="email"
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    containerClassName="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="whitespace-nowrap h-12 px-4"
                                    onClick={handleSendCode}
                                    disabled={loading || isSendingCode || cooldown > 0}
                                >
                                    {isSendingCode
                                        ? "발송 중..."
                                        : cooldown > 0
                                            ? `재전송 ${cooldown}s`
                                            : "인증코드 받기"}
                                </Button>
                            </div>
                            {infoMessage && (
                                <p className="text-sm text-green-600">{infoMessage}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                name="verificationCode"
                                placeholder="이메일로 받은 인증코드를 입력해주세요"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                required
                                disabled={loading}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">현재 테스트용 인증코드는 1234입니다.</p>
                        </div>
                        <Input
                            name="password"
                            placeholder="비밀번호를 입력해주세요"
                            type="password"
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            name="name"
                            placeholder="이름을 입력해주세요"
                            type="text"
                            required
                            disabled={loading}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">사용자 유형</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="student"
                                        checked={userType === "student"}
                                        onChange={(e) => setUserType(e.target.value as "student" | "teacher")}
                                        disabled={loading}
                                        className="w-4 h-4"
                                    />
                                    <span>학생</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="teacher"
                                        checked={userType === "teacher"}
                                        onChange={(e) => setUserType(e.target.value as "student" | "teacher")}
                                        disabled={loading}
                                        className="w-4 h-4"
                                    />
                                    <span>선생님</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <Button
                        className="w-full h-12 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white font-bold rounded-xl"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? "회원가입 중..." : "회원가입"}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
