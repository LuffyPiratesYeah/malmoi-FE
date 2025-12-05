export const runtime = "edge";

import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { ClassDetailClient } from "./client";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classData = await db.class.getById(id);

    // TODO: 실제 로그인한 사용자 정보 가져오기
    // 현재는 목 데이터로 처리
    const currentUser = await db.user.getCurrent();

    if (!classData) {
        return <div>Class not found</div>;
    }

    // 이 수업의 소유자인지 확인 (선생님이고 tutorId가 일치하는지)
    const isOwner = currentUser.isTeacher && classData.tutorId === currentUser.id;

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isOwner ? "수업 관리" : "수업 자세히 보기"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isOwner ? "수업 정보를 확인하고 관리하세요" : "튜터와 함께 하기전 수업을 자세히 알아보아요"}
                    </p>
                </div>

                <ClassDetailClient classData={classData} isOwner={isOwner} />
            </main>
        </div>
    );
}
