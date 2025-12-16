"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { ClassItem } from "@/types";
import { ManageClassDetailClient } from "./client";
import { useParams } from "next/navigation";

interface ManageClassDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ManageClassDetailPage({ params }: ManageClassDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const [classData, setClassData] = useState<ClassItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || Array.isArray(id)) {
            setIsLoading(false);
            return;
        }
        loadClass(id);
    }, [id]);

    const loadClass = async (classId: string) => {
        try {
            const response = await fetch(`/api/classes/${classId}`, { cache: "no-store" });
            if (!response.ok) {
                setClassData(null);
                return;
            }
            const found = await response.json();
            setClassData(found || null);
        } catch (error) {
            console.error("Failed to load class:", error);
            setClassData(null);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pb-20">
                <Navbar />
                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center py-20">
                        <p className="text-gray-500">로딩 중...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="min-h-screen bg-white pb-20">
                <Navbar />
                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center py-20">
                        <p className="text-gray-500">수업을 찾을 수 없습니다.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{classData.title}</h1>
                    <p className="text-gray-500 mt-2">수업 일정과 멤버를 관리하세요</p>
                </div>

                <ManageClassDetailClient classData={classData} />
            </main>
        </div>
    );
}
