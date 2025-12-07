"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScheduleItem } from "@/types";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface ScheduleClientProps {
    schedules: ScheduleItem[];
    isLoading?: boolean;
}

const formatDateLabel = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
    });
};

export function ScheduleClient({ schedules, isLoading }: ScheduleClientProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const today = useMemo(() => new Date(), []);
    const weekDates = useMemo(() => {
        const arr: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            arr.push(d.toISOString().slice(0, 10));
        }
        return arr;
    }, [today]);

    const scheduleDates = useMemo(
        () => Array.from(new Set(schedules.map((s) => s.date))).sort(),
        [schedules]
    );

    useEffect(() => {
        if (scheduleDates.length > 0) {
            setSelectedDate(scheduleDates[0]);
        } else {
            setSelectedDate(weekDates[0]);
        }
    }, [scheduleDates, weekDates]);

    const filteredSchedules = selectedDate ? schedules.filter(s => s.date === selectedDate) : [];
    const activeDateLabel = selectedDate ? formatDateLabel(selectedDate) : "";

    return (
        <main className="mx-auto max-w-7xl px-8 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">내 수업 스케줄</h1>
                    <p className="text-sm text-gray-500">
                        {isLoading ? "스케줄을 불러오는 중입니다..." : `예약된 수업 ${schedules.length}개가 있어요.`}
                    </p>
                </div>

                <div className="flex gap-3">
                    <select className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                        <option>이번 주</option>
                        <option>다음 주</option>
                    </select>
                    <select className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                        <option>전체 튜터</option>
                    </select>
                    <Link href="/class">
                        <Button className="gap-2 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white border-none">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            새 수업 예약
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Left Sidebar - Calendar */}
                <div className="w-64 flex-shrink-0">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between px-2">
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="font-bold text-gray-900">2025년 10월</span>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(weekDates.length ? weekDates : [new Date().toISOString().slice(0, 10)]).map((date, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                        selectedDate === date
                                            ? "bg-primary text-white shadow-md shadow-blue-200"
                                            : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                    )}
                                >
                                    <span>{formatDateLabel(date)}</span>
                                    {schedules.some((s) => s.date === date) && (
                                        <span className={cn("h-2 w-2 rounded-full", selectedDate === date ? "bg-white" : "bg-primary")} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - Schedule List */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h3 className="mb-4 text-lg font-bold text-gray-900">
                            {activeDateLabel || "일정"} · 수업 {filteredSchedules.length}개
                        </h3>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="py-20 text-center text-gray-500">스케줄을 불러오는 중입니다...</div>
                            ) : filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule) => (
                                    <div key={schedule.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Image src="/watch.svg" alt="Time" width={20} height={20} className="text-gray-400" />
                                                <span className="font-bold text-gray-900 text-lg">{schedule.time}</span>
                                            </div>
                                            <Badge className={`border-none px-3 py-1 ${
                                                schedule.status === "pending" 
                                                    ? "bg-yellow-50 text-yellow-600" 
                                                    : schedule.status === "scheduled"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : schedule.status === "completed"
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-gray-50 text-gray-600"
                                            }`}>
                                                {schedule.status === "pending" 
                                                    ? "승인 대기" 
                                                    : schedule.status === "scheduled"
                                                        ? "예약 완료"
                                                        : schedule.status === "completed"
                                                            ? "수업 완료"
                                                            : "취소됨"}
                                            </Badge>
                                        </div>

                                        <div className="mb-6 flex items-center gap-4">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                                                {schedule.class?.tutorName?.[0] || "튜터"}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-lg">{schedule.class?.tutorName || "튜터"} 선생님</div>
                                                <div className="text-sm text-gray-500">{schedule.class?.level || ""}</div>
                                            </div>
                                        </div>

                                        {schedule.status === "scheduled" && (
                                            <div className="mb-6 flex gap-3">
                                                {schedule.zoomLink ? (
                                                    <Button
                                                        className="flex-1 gap-2 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white border-none h-12 font-bold"
                                                        onClick={() => window.open(schedule.zoomLink, '_blank')}
                                                    >
                                                        <Image src="/video.svg" alt="Video" width={18} height={18} className="brightness-0 invert" />
                                                        Zoom 입장
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="flex-1 gap-2 bg-gray-300 text-gray-500 border-none h-12 font-bold cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <Image src="/video.svg" alt="Video" width={18} height={18} />
                                                        링크 대기중
                                                    </Button>
                                                )}
                                                {schedule.googleDocsLink ? (
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 gap-2 h-12 font-bold text-gray-700 border-gray-200"
                                                        onClick={() => window.open(schedule.googleDocsLink, '_blank')}
                                                    >
                                                        <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                        수업 노트
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 gap-2 h-12 font-bold text-gray-400 border-gray-200 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                        노트 대기중
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                        {schedule.status === "pending" && (
                                            <div className="mb-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                                                <p className="text-sm text-yellow-800 font-medium">
                                                    선생님의 승인을 기다리는 중입니다. 승인되면 알림을 드리겠습니다.
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-xl">
                                            <div className="flex">
                                                <span className="w-16 text-gray-500 font-medium">교재:</span>
                                                <span className="text-gray-900 font-medium">{schedule.class?.title || "등록된 교재 없음"}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-16 text-gray-500 font-medium">노트:</span>
                                                <span className="text-gray-900">수업 전 예습을 잊지 마세요!</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                                    <p className="text-gray-500 mb-4">예정된 수업이 없습니다.</p>
                                    <Link href="/class">
                                        <Button variant="outline">수업 예약하기</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
