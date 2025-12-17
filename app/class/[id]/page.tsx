// export const runtime = "edge";

import { Navbar } from "@/components/layout/Navbar";
import { ClassDetailClient } from "./client";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/classes/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        return <div className="p-8">Class not found</div>;
    }

    const classData = await response.json();

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">수업 자세히 보기</h1>
                    <p className="text-sm text-gray-500">
                        튜터와 함께 하기전 수업을 자세히 알아보아요
                    </p>
                </div>

                <ClassDetailClient classData={classData} />
            </main>
        </div>
    );
}
