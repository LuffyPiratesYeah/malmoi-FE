"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/useAuthStore";
import toast from "react-hot-toast";
import { ClassItem, ScheduleItem } from "@/types";

type ProfileClientProps = Record<string, never>;

export function ProfileClient({ }: ProfileClientProps) {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    // Verification State
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ type: string; name: string }[]>([]);
    const [enrolledClasses, setEnrolledClasses] = useState<ClassItem[]>([]);

    // Edit Profile State
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || "",
        email: "",
        password: "",
        newPassword: "",
    });

    const loadEnrolledClasses = useCallback(async () => {
        try {
            if (!user?.id) return;
            const scheduleResponse = await fetch(`/api/schedules?studentId=${user.id}`);
            const allSchedules: ScheduleItem[] = await scheduleResponse.json();
            const uniqueClasses = Array.from(
                new Map(allSchedules.map(s => [s.class.id, s.class])).values()
            );
            setEnrolledClasses(uniqueClasses);
        } catch (error) {
            console.error("Failed to load enrolled classes:", error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.userType === "student") {
            loadEnrolledClasses();
        }
    }, [loadEnrolledClasses, user?.userType]);

    const handleVerificationSubmit = async () => {
        if (!user?.id) {
            toast.error("로그인이 필요합니다");
            return;
        }

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    verificationStatus: "pending",
                    isTeacher: false,
                    userType: "teacher",
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            updateUser({ verificationStatus: "pending", isTeacher: false, userType: "teacher" });
            setIsVerifyModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to submit verification", error);
            toast.error("인증 요청에 실패했습니다");
        }
    };

    const handleSuccessConfirm = () => {
        setIsSuccessModalOpen(false);
    };

    const handleFileUpload = (type: string) => {
        // Mock file upload
        const fileName = `upload_${Date.now()}.png`;
        setUploadedFiles(prev => [...prev, { type, name: fileName }]);
    };

    return (
        <div className="space-y-8">
            {/* User Info */}
            <div className="space-y-8">
                {/* Password */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-8">
                    <span className="w-32 text-sm font-bold text-gray-900">비밀번호</span>
                    <div className="flex-1 text-2xl tracking-widest text-gray-900">••••••••</div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-24 rounded-full bg-primary text-white"
                        onClick={() => setIsEditProfileModalOpen(true)}
                    >
                        변경
                    </Button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-8">
                    <span className="w-32 text-sm font-bold text-gray-900">이름</span>
                    <div className="flex-1 text-gray-500">{user?.name}</div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-24 rounded-full bg-primary text-white"
                        onClick={() => setIsEditProfileModalOpen(true)}
                    >
                        수정
                    </Button>
                </div>

                {/* Teacher Verification Status */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-8">
                    <span className="w-32 text-sm font-bold text-gray-900">튜터 인증</span>
                    <div className="flex-1">
                        {user?.isTeacher ? (
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    인증 완료
                                </span>
                                <Link href="/manage-classes" className="text-sm text-primary hover:underline font-medium">
                                    → 수업 관리하러 가기
                                </Link>
                            </div>
                        ) : user?.verificationStatus === "pending" ? (
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                    검토 중
                                </span>
                                <span className="text-sm text-gray-500">관리자 승인 후 튜터 권한이 부여됩니다.</span>
                            </div>
                        ) : (
                            <span className="text-gray-500">미인증</span>
                        )}
                    </div>
                    {!user?.isTeacher && user?.verificationStatus !== "pending" && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-24 rounded-full bg-[#0F766E] text-white hover:bg-[#0F766E]/90"
                            onClick={() => setIsVerifyModalOpen(true)}
                        >
                            인증하기
                        </Button>
                    )}
                </div>
            </div>

            {/* Enrolled Classes for Students */}
            {user?.userType === "student" && enrolledClasses.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">수강 중인 수업</h3>
                        <p className="text-sm text-gray-500">현재 등록된 수업 목록입니다</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enrolledClasses.map((cls) => (
                            <Link key={cls.id} href={`/class/${cls.id}`}>
                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-3">
                                        <img src={cls.image} alt={cls.title} className="w-16 h-16 rounded object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{cls.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="bg-blue-50 text-primary px-2 py-0.5 rounded font-medium">{cls.level}</span>
                                                <span>{cls.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Verification Modal */}
            <Modal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                title="선생님 인증"
            >
                <div className="space-y-6">
                    <p className="text-center text-sm text-gray-500">
                        튜터로써 활동하기 위해선 인증이 필요해요. 서류를 업로드해 승인 요청을 보내주세요.
                    </p>

                    <div className="space-y-4">
                        <div
                            onClick={() => handleFileUpload("cert")}
                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white hover:bg-gray-50 hover:border-primary transition-colors"
                        >
                            {uploadedFiles.find(f => f.type === "cert") ? (
                                <span className="text-sm font-bold text-primary">
                                    {uploadedFiles.find(f => f.type === "cert")?.name}
                                </span>
                            ) : (
                                <>
                                    <svg className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-gray-400">강사증/공무원증 업로드</span>
                                </>
                            )}
                        </div>
                        <div
                            onClick={() => handleFileUpload("id")}
                            className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white hover:bg-gray-50 hover:border-primary transition-colors"
                        >
                            {uploadedFiles.find(f => f.type === "id") ? (
                                <span className="text-sm font-bold text-primary">
                                    {uploadedFiles.find(f => f.type === "id")?.name}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-400">신분증/여권 업로드</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsVerifyModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={handleVerificationSubmit}
                            disabled={uploadedFiles.length === 0}
                        >
                            확인
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessConfirm}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">인증 신청 완료</h3>
                    <p className="text-center text-gray-500">
                        관리자 검토 후 승인이 완료되면<br />
                        이메일로 알려드릴게요!
                    </p>
                    <Button
                        className="mt-4 w-full bg-primary text-white hover:bg-primary/90"
                        onClick={handleSuccessConfirm}
                    >
                        확인
                    </Button>
                </div>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                title="내 정보 수정"
            >
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="이름"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <Input
                            label="이메일"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                        <div className="border-t border-gray-100 my-4 pt-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">비밀번호 변경</h4>
                            <Input
                                label="현재 비밀번호"
                                type="password"
                                placeholder="현재 비밀번호를 입력하세요"
                                value={editForm.password}
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                containerClassName="mb-4"
                            />
                            <Input
                                label="새 비밀번호"
                                type="password"
                                placeholder="새 비밀번호를 입력하세요"
                                value={editForm.newPassword}
                                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditProfileModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={() => setIsEditProfileModalOpen(false)}
                        >
                            저장하기
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
