"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ManageClassesClient } from "./client";
import { useEffect, useState } from "react";
import { ClassItem } from "@/types";
import { useAuthStore } from "@/lib/useAuthStore";

export default function ManageClassesPage() {
    const [myClasses, setMyClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        // API에서 수업 로드
        const loadClasses = async () => {
            try {
                const response = await fetch('/api/classes');
                const allClasses: ClassItem[] = await response.json();

                console.log("All classes from API:", allClasses);

                // 현재 사용자의 수업만 필터링
                const filtered = allClasses.filter(c => c.tutorId === user?.id);
                console.log("Filtered classes for user:", user?.id, filtered);

                setMyClasses(filtered);
            } catch (error) {
                console.error("Failed to load classes:", error);
                setMyClasses([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            loadClasses();
        }
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pb-20">
                <Navbar />
                <main className="mx-auto max-w-6xl px-8 py-12">
                    <div className="text-center py-20">
                        <p className="text-gray-500">로딩 중...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-6xl px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">수업 관리</h1>
                    <p className="text-gray-500 mt-2">내가 등록한 수업을 관리하세요</p>
                </div>

                <ManageClassesClient myClasses={myClasses} />
            </main>
        </div>
    );
}
