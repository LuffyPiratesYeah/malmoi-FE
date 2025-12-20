import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
    return (
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
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight" style={{ wordBreak: 'keep-all' }}>
                    말모이와 함께
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        한국어를 배워요
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light" style={{ wordBreak: 'keep-all' }}>
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
    );
}
