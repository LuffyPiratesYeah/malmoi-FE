"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ClassItem } from "@/types";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/useAuthStore";
import { useBookingStore } from "@/lib/useBookingStore";

interface ClassDetailClientProps {
    classData: ClassItem;
}

export function ClassDetailClient({ classData }: ClassDetailClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isQuickBooking = searchParams.get("quick") === "true";
    const user = useAuthStore((state) => state.user);
    const isOwner = user?.isTeacher && user?.id === classData.tutorId;
    const isStudent = user && !user.isTeacher;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editForm, setEditForm] = useState({
        title: classData.title,
        description: classData.description,
        level: classData.level,
        category: classData.category,
        type: classData.type,
    });

    const [bookingForm, setBookingForm] = useState({
        date: "",
        time: "",
        contactInfo: "",
    });

    // Quick Booking Store
    const { quickTimes, activeQuickTimeId } = useBookingStore();
    const activeQuickTime = quickTimes.find(qt => qt.id === activeQuickTimeId);

    const handleOpenBookingModal = () => {
        if (activeQuickTime && isQuickBooking) {
            setBookingForm(prev => ({
                ...prev,
                date: "", // User must select date
                time: activeQuickTime.time
            }));
        } else {
            setBookingForm(prev => ({
                ...prev,
                date: "",
                time: ""
            }));
        }
        setIsBookingModalOpen(true);
    };

    const handleEdit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/classes/${classData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast.success("수업이 수정되었습니다");
            router.refresh();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Failed to update class", error);
            toast.error("수업 수정에 실패했습니다");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/classes/${classData.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast.success("수업이 삭제되었습니다");
            router.push("/manage-classes");
        } catch (error) {
            console.error("Failed to delete class", error);
            toast.error("수업 삭제에 실패했습니다");
        } finally {
            setIsSubmitting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleBooking = async (forceCreate = false) => {
        if (!bookingForm.date || !bookingForm.time) {
            toast.error("날짜와 시간을 모두 입력해주세요");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId: classData.id,
                    studentId: user?.id,
                    date: bookingForm.date,
                    time: bookingForm.time,
                    contactInfo: bookingForm.contactInfo,
                    forceCreate,
                }),
            });

            const data = await response.json();

            if (response.status === 409 && data.error === "DUPLICATE_BOOKING") {
                setIsBookingModalOpen(false);
                setIsDuplicateModalOpen(true);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || "예약에 실패했습니다");
            }

            toast.success("수업 예약이 완료되었습니다! 선생님의 승인을 기다려주세요.");
            setIsBookingModalOpen(false);
            setBookingForm({ date: "", time: "", contactInfo: "" });
            router.push("/schedule");
        } catch (error) {
            console.error("Failed to book class", error);
            toast.error("수업 예약에 실패했습니다");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDuplicateConfirm = async () => {
        setIsDuplicateModalOpen(false);
        setIsBookingModalOpen(true);
        await handleBooking(true);
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {/* Hero Image */}
                <div className="h-48 sm:h-64 md:h-80 w-full bg-gray-200">
                    <img
                        src={classData.image}
                        alt={classData.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="p-4 sm:p-6 md:p-4 sm:p-6 md:p-8">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                        <div>
                            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-gray-900">{classData.title}</h2>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-50 text-primary px-3 py-1 text-sm">{classData.level}</Badge>
                                <span className="text-sm text-gray-500">{classData.type}</span>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-primary">{classData.category}</span>
                    </div>

                    <div className="mb-8 sm:mb-12 border-b border-gray-100 pb-8 sm:pb-12">
                        <p className="text-gray-600 text-sm sm:text-base">
                            {classData.description}
                        </p>
                    </div>

                    {classData.details && (
                        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                            {classData.details.map((detail, i) => (
                                <p key={i} className="text-gray-600 text-sm sm:text-base">
                                    {detail}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* 선생님 전용 관리 버튼 */}
                    {isOwner && (
                        <div className="border-t border-gray-200 pt-6 sm:pt-8">
                            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">수업 관리</h3>
                                <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                                    수업 정보를 수정하거나 삭제할 수 있습니다
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-lg border-primary text-primary hover:bg-blue-50"
                                        onClick={() => setIsEditModalOpen(true)}
                                    >
                                        수업 정보 수정
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                    >
                                        수업 삭제
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 학생 전용 예약 버튼 */}
                    {isStudent && (
                        <div className="border-t border-gray-200 pt-6 sm:pt-8">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">수업 예약하기</h3>
                                <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                                    원하는 날짜와 시간을 선택하여 수업을 예약하세요
                                </p>
                                <Button
                                    className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg"
                                    onClick={handleOpenBookingModal}
                                >
                                    수업 예약하기
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 수정 모달 */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="수업 정보 수정"
            >
                <div className="space-y-6">
                    <Input
                        label="수업 제목"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            수업 설명
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none min-h-[120px]"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                    </div>
                    <Input
                        label="레벨"
                        value={editForm.level}
                        onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    />
                    <Input
                        label="카테고리"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                    <Input
                        label="형식"
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={handleEdit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "처리 중..." : "수정 완료"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 삭제 확인 모달 */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="수업 삭제"
            >
                <div className="space-y-6">
                    <div className="text-center py-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">정말 삭제하시겠습니까?</h3>
                        <p className="text-sm text-gray-600">
                            <span className="font-bold text-primary">{classData.title}</span> 수업을 삭제하면<br />
                            되돌릴 수 없습니다.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "삭제 중..." : "삭제하기"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 수업 예약 모달 */}
            <Modal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                title="수업 예약"
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                            <span className="font-bold text-primary">{classData.title}</span> 수업을 예약합니다
                        </p>
                    </div>

                    {activeQuickTime && isQuickBooking && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2 text-sm text-blue-800">
                            <p>시계</p>
                            <span>
                                <span className="font-bold">{activeQuickTime.label}</span> ({activeQuickTime.time})으로 예약합니다. 날짜를 선택해주세요.
                            </span>
                        </div>
                    )}

                    <Input
                        label="예약 날짜"
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        required
                    />

                    <Input
                        label="예약 시간"
                        type="time"
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        required
                    />

                    <Input
                        label="연락처 (전화번호)"
                        type="tel"
                        placeholder="010-1234-5678"
                        value={bookingForm.contactInfo}
                        onChange={(e) => setBookingForm({ ...bookingForm, contactInfo: e.target.value })}
                    />

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                            예약 요청 후 선생님의 승인을 기다려주세요. 승인되면 알림을 보내드립니다.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsBookingModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={() => handleBooking(false)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "예약 중..." : "예약하기"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 중복 예약 확인 모달 */}
            <Modal
                isOpen={isDuplicateModalOpen}
                onClose={() => setIsDuplicateModalOpen(false)}
                title="중복 예약 확인"
            >
                <div className="space-y-6">
                    <div className="text-center py-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">이미 예약한 수업입니다</h3>
                        <p className="text-sm text-gray-600">
                            같은 날짜와 시간에 이미 예약이 있습니다.<br />
                            그래도 다시 예약하시겠습니까?
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDuplicateModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={handleDuplicateConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "예약 중..." : "예약하기"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
