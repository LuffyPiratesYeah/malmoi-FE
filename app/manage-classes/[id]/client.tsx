"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ClassItem, ScheduleItem } from "@/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createScheduleAction } from "./actions";
import toast from "react-hot-toast";

interface ManageClassDetailClientProps {
    classData: ClassItem;
}

type Tab = "schedule" | "members";

export function ManageClassDetailClient({ classData }: ManageClassDetailClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("schedule");
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [scheduleForm, setScheduleForm] = useState({
        date: "",
        time: "",
    });

    useEffect(() => {
        loadSchedules();
    }, [classData.id]);

    const loadSchedules = async () => {
        try {
            const response = await fetch(`/api/schedules?classId=${classData.id}`);
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error("Failed to load schedules:", error);
        }
    };

    const handleScheduleSubmit = async () => {
        if (!scheduleForm.date || !scheduleForm.time) {
            toast.error("날짜와 시간을 모두 입력해주세요");
            return;
        }

        setIsSubmitting(true);
        try {
            await createScheduleAction(classData.id, scheduleForm.date, scheduleForm.time);
            toast.success("일정이 추가되었습니다");
            setIsScheduleModalOpen(false);
            setScheduleForm({ date: "", time: "" });
            await loadSchedules();
        } catch (error) {
            console.error("Failed to create schedule:", error);
            toast.error("일정 추가에 실패했습니다");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Class Info Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <img
                            src={classData.image}
                            alt={classData.title}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{classData.title}</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="bg-blue-50 text-primary px-2 py-1 rounded font-bold">
                                    {classData.level}
                                </span>
                                <span className="text-gray-500">{classData.type}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500">{classData.category}</span>
                            </div>
                        </div>
                    </div>
                    <Link href={`/class/${classData.id}`}>
                        <Button variant="outline" size="sm">
                            수업 상세보기
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("schedule")}
                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === "schedule"
                                ? "text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        일정 관리
                        {activeTab === "schedule" && (
                            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === "members"
                                ? "text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        수업 멤버
                        {activeTab === "members" && (
                            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "schedule" ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">수업 일정</h3>
                        <Button
                            className="bg-primary text-white"
                            onClick={() => setIsScheduleModalOpen(true)}
                        >
                            + 일정 추가
                        </Button>
                    </div>

                    {schedules.length > 0 ? (
                        <div className="space-y-3">
                            {schedules.map((schedule) => (
                                <div key={schedule.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <span className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 min-w-[80px] text-center">
                                            {schedule.date}
                                        </span>
                                        <span className="font-bold text-gray-900">{schedule.time}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${schedule.status === "scheduled"
                                                ? "bg-blue-50 text-blue-700"
                                                : schedule.status === "completed"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-50 text-gray-700"
                                            }`}>
                                            {schedule.status === "scheduled" ? "예정" : schedule.status === "completed" ? "완료" : schedule.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">수정</Button>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>등록된 일정이 없습니다.</p>
                            <p className="text-sm mt-2">새로운 수업 일정을 추가해보세요.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">수강생 목록</h3>
                        <div className="text-sm text-gray-500">
                            총 <span className="font-bold text-gray-900">0</span>명
                        </div>
                    </div>

                    <div className="text-center py-12 text-gray-500">
                        <p>등록된 수강생이 없습니다.</p>
                        <p className="text-sm mt-2">학생들이 수업을 신청하면 여기에 표시됩니다.</p>
                    </div>
                </div>
            )}

            {/* Add Schedule Modal */}
            <Modal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                title="일정 추가"
            >
                <div className="space-y-6">
                    <Input
                        label="날짜"
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    />
                    <Input
                        label="시간"
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsScheduleModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                            onClick={handleScheduleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "추가 중..." : "추가하기"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
