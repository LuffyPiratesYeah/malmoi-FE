"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { ScheduleItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface ScheduleClientProps {
    schedules: ScheduleItem[];
    isLoading?: boolean;
}

const pad = (value: number) => String(value).padStart(2, "0");

const toLocalDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
};

const normalizeDateKey = (value: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return toLocalDateKey(parsed);
};

const formatDateLabel = (date: string) => {
    return parseDateKey(date).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
    });
};

const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.floor((date.getDate() + firstDay - 1) / 7) + 1;
};

const statusLabel = {
    pending: "승인 대기",
    scheduled: "예약 완료",
    completed: "수업 완료",
    cancelled: "취소됨",
};

const statusClassName = {
    pending: "bg-yellow-50 text-yellow-600",
    scheduled: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-gray-50 text-gray-600",
};

export function ScheduleClient({ schedules, isLoading }: ScheduleClientProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const todayString = useMemo(() => toLocalDateKey(new Date()), []);

    const normalizedSchedules = useMemo(
        () => schedules.map((schedule) => ({ ...schedule, date: normalizeDateKey(schedule.date) })),
        [schedules]
    );

    const scheduleCountByDate = useMemo(() => {
        return normalizedSchedules.reduce<Record<string, number>>((acc, schedule) => {
            acc[schedule.date] = (acc[schedule.date] || 0) + 1;
            return acc;
        }, {});
    }, [normalizedSchedules]);

    useEffect(() => {
        setSelectedDate(todayString);
    }, [todayString]);

    useEffect(() => {
        if (!selectedDate) return;

        const selected = parseDateKey(selectedDate);
        setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }, [selectedDate]);

    const filteredSchedules = selectedDate
        ? normalizedSchedules.filter((schedule) => schedule.date === selectedDate)
        : [];

    const activeDate = selectedDate ? parseDateKey(selectedDate) : new Date();
    const activeDateLabel = selectedDate ? formatDateLabel(selectedDate) : "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    const weekLabel = `${getWeekOfMonth(activeDate)}번째 주`;

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">내 수업 스케줄</h1>
                    <p className="text-sm text-gray-500">
                        {isLoading ? "스케줄을 불러오는 중입니다..." : `예약된 수업 ${schedules.length}개가 있어요.`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">{weekLabel}</div>
                    <Link href="/class">
                        <Button className="gap-2 border-none bg-[#00C2FF] text-white hover:bg-[#00C2FF]/90">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            새 수업 예약
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px,1fr] lg:gap-8">
                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="font-bold text-gray-900">
                            {year}년 {month + 1}월
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
                        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                            <span key={day} className="py-2">
                                {day}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((day, index) => {
                            if (!day) {
                                return <div key={`blank-${index}`} className="h-12" />;
                            }

                            const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;
                            const isSelected = selectedDate === dateKey;
                            const isToday = todayString === dateKey;
                            const scheduleCount = scheduleCountByDate[dateKey] || 0;

                            return (
                                <button
                                    key={dateKey}
                                    type="button"
                                    onClick={() => setSelectedDate(dateKey)}
                                    className={cn(
                                        "relative h-12 rounded-lg text-sm font-semibold transition-colors",
                                        isSelected
                                            ? "bg-primary text-white"
                                            : "text-gray-700 hover:bg-gray-100",
                                        isToday && !isSelected && "border border-primary/40"
                                    )}
                                >
                                    {day}
                                    {scheduleCount > 0 && (
                                        <span
                                            className={cn(
                                                "absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full",
                                                isSelected ? "bg-white" : "bg-primary"
                                            )}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 sm:text-lg">{activeDateLabel || "일정"}</h3>
                            <p className="text-sm text-gray-500">수업 {filteredSchedules.length}개</p>
                        </div>
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    const base = parseDateKey(selectedDate || todayString);
                                    base.setDate(base.getDate() - 1);
                                    setSelectedDate(toLocalDateKey(base));
                                }}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const base = parseDateKey(selectedDate || todayString);
                                    base.setDate(base.getDate() + 1);
                                    setSelectedDate(toLocalDateKey(base));
                                }}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center text-gray-500">스케줄을 불러오는 중입니다...</div>
                    ) : filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                            <button
                                key={schedule.id}
                                type="button"
                                onClick={() => setSelectedSchedule(schedule)}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md sm:p-6"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Image src="/watch.svg" alt="time" width={20} height={20} />
                                        <span className="text-base font-bold text-gray-900 sm:text-lg">{schedule.time}</span>
                                    </div>
                                    <Badge className={`border-none px-3 py-1 ${statusClassName[schedule.status]}`}>
                                        {statusLabel[schedule.status]}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-bold text-gray-600">
                                        {schedule.class?.tutorName?.[0] || "튜"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{schedule.class?.tutorName || "튜터"} 선생님</p>
                                        <p className="text-sm text-gray-500">{schedule.class?.title || "등록된 교재 없음"}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
                            <p className="mb-4 text-gray-500">예정된 수업이 없습니다.</p>
                            <Link href="/class">
                                <Button variant="outline">수업 예약하기</Button>
                            </Link>
                        </div>
                    )}
                </section>
            </div>

            <Modal
                isOpen={Boolean(selectedSchedule)}
                onClose={() => setSelectedSchedule(null)}
                title="수업 상세 정보"
                footer={
                    <div className="mt-6 flex justify-center gap-2">
                        <Button variant="outline" onClick={() => setSelectedSchedule(null)}>
                            닫기
                        </Button>
                    </div>
                }
            >
                {selectedSchedule && (
                    <div className="space-y-3 text-left">
                        <p>
                            <span className="font-semibold text-gray-900">날짜:</span> {formatDateLabel(selectedSchedule.date)}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">시간:</span> {selectedSchedule.time}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">튜터:</span> {selectedSchedule.class?.tutorName || "튜터"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">수업:</span> {selectedSchedule.class?.title || "등록된 교재 없음"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">상태:</span> {statusLabel[selectedSchedule.status]}
                        </p>
                    </div>
                )}
            </Modal>
        </main>
    );
}
