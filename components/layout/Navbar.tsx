import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="border-b border-gray-200 bg-white px-8 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/">
                    <Logo size="md" />
                </Link>

                <div className="flex items-center gap-12 text-sm font-medium text-gray-600">
                    <Link href="/schedule" className="hover:text-primary">스케줄</Link>
                    <Link href="/class" className="hover:text-primary">수업</Link>
                </div>

                <div className="flex items-center gap-8 text-sm">
                    <Link href="/profile" className="font-medium text-gray-900 hover:text-primary">디포네님</Link>
                    <Link href="/login" className="text-gray-500 hover:text-gray-900">로그아웃</Link>
                </div>
            </div>
        </nav>
    );
}
