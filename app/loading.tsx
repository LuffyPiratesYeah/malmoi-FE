import { Logo } from "@/components/ui/Logo";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="mb-8 animate-pulse">
                <Logo size="xl" />
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
                <p className="text-sm text-gray-400">말모이가 사진에 강의를 넣고있어요...</p>
            </div>
        </div>
    );
}
