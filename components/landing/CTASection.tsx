import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
    primaryCtaHref: string;
    primaryCtaLabel: string;
}

export function CTASection({ primaryCtaHref, primaryCtaLabel }: CTASectionProps) {
    return (
        <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="bg-primary rounded-3xl p-12 text-center shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ wordBreak: 'keep-all' }}>
                    지금 바로 시작하세요
                </h2>
                <p className="text-blue-100 text-lg mb-8" style={{ wordBreak: 'keep-all' }}>
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
    );
}
