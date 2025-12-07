"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ManageClassesClient } from "./client";
import { useEffect, useState } from "react";
import { ClassItem } from "@/types";
import { useAuthStore } from "@/lib/useAuthStore";
import { Button } from "@/components/ui/Button";

export default function ManageClassesPage() {
    const [myClasses, setMyClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    useEffect(() => {
        let cancelled = false;
        const loadUser = async () => {
            if (!user?.id) {
                setIsCheckingUser(false);
                return;
            }
            try {
                const res = await fetch(`/api/users/${user.id}`, { cache: "no-store" });
                if (!res.ok) return;
                const fresh = await res.json();
                if (!cancelled) {
                    updateUser({
                        id: fresh.id,
                        email: fresh.email,
                        name: fresh.name,
                        userType: fresh.userType,
                        isTeacher: fresh.isTeacher,
                        profileImage: fresh.profileImage,
                        verificationStatus: fresh.verificationStatus,
                    });
                }
            } catch (error) {
                console.error("Failed to refresh user", error);
            } finally {
                if (!cancelled) setIsCheckingUser(false);
            }
        };
        loadUser();
        return () => {
            cancelled = true;
        };
    }, [user?.id, updateUser]);

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

        if (user?.id && user.isTeacher) {
            loadClasses();
        } else {
            setIsLoading(false);
        }
    }, [user?.id, user?.isTeacher]);

    if (isCheckingUser) {
        return (
            <div className="min-h-screen bg-white pb-20">
                <Navbar />
                <main className="mx-auto max-w-4xl px-8 py-12 text-center space-y-4">
                    <p className="text-gray-600">사용자 정보를 확인하는 중...</p>
                </main>
            </div>
        );
    }

    if (!user?.isTeacher) {
        const statusMessage = user?.verificationStatus === "pending"
            ? "튜터 인증 승인 대기 중입니다. 관리자가 승인하면 수업을 등록할 수 있습니다."
            : "튜터 인증 완료 후에만 수업을 등록하고 관리할 수 있습니다. 프로필에서 서류를 업로드해 신청해주세요.";
        return (
            <div className="min-h-screen bg-white pb-20">
                <Navbar />
                <main className="mx-auto max-w-4xl px-8 py-12 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">튜터 인증이 필요합니다</h1>
                    <p className="text-gray-600">{statusMessage}</p>
                    <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => window.location.href = "/profile"}>
                        프로필로 이동
                    </Button>
                </main>
            </div>
        );
    }

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
