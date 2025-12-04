import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
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

                {/* 
                    TODO: [Supabase] 로그인 처리
                    이 form action을 Supabase Auth와 연동해야 합니다.
                    현재는 mock action(loginAction)을 사용 중입니다.
                    나중에 supabase.auth.signInWithPassword() 로 교체하세요.
                */}
                <form action={loginAction} className="space-y-10">
                    <div className="space-y-8">
                        <Input
                            name="id"
                            placeholder="아이디를 입력해주세요"
                            type="text"
                            required
                        />
                        <Input
                            name="password"
                            placeholder="비밀번호를 입력해주세요"
                            type="password"
                            required
                        />
                    </div>

                    <Button className="w-full h-12 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white font-bold rounded-xl" size="lg">
                        로그인
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}

