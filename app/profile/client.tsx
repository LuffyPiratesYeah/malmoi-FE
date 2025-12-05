"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { ClassItem, User } from "@/types";
import { verifyTeacherAction } from "@/app/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
    user: User;
    myClasses: ClassItem[];
}

type Tab = "info" | "classes";

export function ProfileClient({ user, myClasses }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("info");

    // Verification State
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ type: string; name: string }[]>([]);

    // Edit Profile State
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        email: user.email,
        password: "",
        newPassword: "",
    });

    const handleVerificationSubmit = async () => {
        await verifyTeacherAction();
        setIsVerificationModalOpen(false);
        setIsSuccessModalOpen(true);
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
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("info")}
                    className={cn(
                        "pb-4 px-4 text-sm font-bold transition-colors relative",
                        activeTab === "info"
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    내 정보
                    {activeTab === "info" && (
                        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("classes")}
                    className={cn(
                        "pb-4 px-4 text-sm font-bold transition-colors relative",
                        activeTab === "classes"
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    {user.isTeacher ? "수업 관리" : "수업 신청 내역"}
                    {activeTab === "classes" && (
                        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
                    )}
                </button>
            </div>

            {/* Content */}
            {activeTab === "info" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        <span className="w-32 text-sm font-bold text-gray-900">이메일</span>
                        <div className="flex-1 text-gray-500">{user.email}</div>
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
                            {user.isTeacher ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    인증 완료
                                </span>
                            ) : (
                                <span className="text-gray-500">미인증</span>
                            )}
                        </div>
                        {!user.isTeacher && (
                            <Button
                                variant="primary"
                                size="sm"
                                className="w-24 rounded-full bg-[#0F766E] text-white hover:bg-[#0F766E]/90"
                                onClick={() => setIsVerificationModalOpen(true)}
                            >
                                인증하기
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {user.isTeacher ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">내가 등록한 수업</h2>
                                <Link href="/class/new">
                                    <Button className="bg-primary text-white hover:bg-primary/90">
                                        + 새 수업 등록
                                    </Button>
                                </Link>
                            </div>

                            {myClasses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {myClasses.map((cls, i) => (
                                        <div key={i} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                                            <div className="relative h-48 bg-gray-200">
                                                <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
                                                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 backdrop-blur-sm">
                                                    {cls.category}
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="mb-2 text-lg font-bold text-gray-900">{cls.title}</h3>
                                                <div className="mb-4 flex items-center gap-2 text-xs">
                                                    <span className="bg-blue-50 text-primary px-2 py-1 rounded font-bold">
                                                        {cls.level}
                                                    </span>
                                                    <span className="text-gray-500">{cls.type}</span>
                                                </div>
                                                <p className="mb-6 text-sm text-gray-500 line-clamp-2">
                                                    {cls.description}
                                                </p>
                                                <Link href={`/class/${cls.id}`}>
                                                    <Button variant="outline" className="w-full rounded-lg">관리하기</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                                    <p className="text-gray-500 mb-4">등록된 수업이 없습니다.</p>
                                    <Link href="/class/new">
                                        <Button>첫 수업 등록하기</Button>
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-200 bg-gray-50 text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">아직 튜터가 아니에요!</h3>
                            <p className="text-gray-500 mb-8">
                                튜터 인증을 완료하고 나만의 수업을 개설해보세요.<br />
                                학생들과 만나 지식을 공유할 수 있습니다.
                            </p>
                            <Button
                                onClick={() => setIsVerificationModalOpen(true)}
                                className="rounded-full bg-[#0F766E] px-8 py-3 text-white hover:bg-[#0F766E]/90"
                                size="lg"
                            >
                                선생님 인증하러 가기
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Verification Modal */}
            <Modal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                title="선생님 인증"
            >
                <div className="space-y-6">
                    <p className="text-center text-sm text-gray-500">
                        튜터로써 활동하기 위해선 인증이 필요해요
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
                            onClick={() => setIsVerificationModalOpen(false)}
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
