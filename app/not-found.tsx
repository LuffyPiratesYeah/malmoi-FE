import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="max-w-lg w-full flex flex-col items-center text-center">
                    {/* Large 404 Text */}
                    <h1 className="text-[120px] md:text-[160px] font-bold text-primary leading-none mb-4">
                        404
                    </h1>

                    {/* Character Illustration */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                        <Image
                            src="/404-character.png"
                            alt="Lost character"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Error Message */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        페이지를 찾을 수 없어요
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md">
                        요청하신 페이지가 사라졌거나 잘못된 경로예요
                    </p>

                    {/* Home Button */}
                    <Link
                        href="/"
                        className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
