import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { signupAction } from "@/app/actions";

export default function SignupPage() {
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
                <h2 className="text-center text-3xl font-normal text-gray-900">Sign up</h2>

                {/* 
                    TODO: [Supabase] 회원가입 처리
                    이 form action을 Supabase Auth와 연동해야 합니다.
                    현재는 mock action(signupAction)을 사용 중입니다.
                    나중에 supabase.auth.signUp() 으로 교체하세요.
                */}
                <form action={signupAction} className="space-y-10">
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

                        <div className="relative">
                            <Input
                                name="email"
                                placeholder="이메일을 입력해주세요"
                                type="email"
                                required
                            />
                            {/* 
                                TODO: [Supabase] 이메일 인증 코드 발송
                                이 버튼을 누르면 Supabase를 통해 이메일 인증 코드를 발송해야 합니다.
                            */}
                            <Button
                                type="button"
                                size="sm"
                                className="absolute right-0 bottom-1.5 h-8 rounded-full bg-[#00C2FF] px-4 text-xs font-medium hover:bg-[#00C2FF]/90"
                            >
                                코드 발송
                            </Button>
                        </div>

                        <Input
                            name="code"
                            placeholder="인증코드를 입력해주세요"
                            type="text"
                        />
                    </div>

                    <Button className="w-full h-12 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white font-bold rounded-xl" size="lg">
                        회원가입
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
