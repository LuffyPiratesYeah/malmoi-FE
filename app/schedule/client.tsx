"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScheduleItem } from "@/types";
import { useState } from "react";
import Image from "next/image";

interface ScheduleClientProps {
    schedules: ScheduleItem[];
}

const DATES = [
    { date: "10월 16일 (수)", fullDate: "2025-10-16", hasDot: true },
    { date: "10월 17일 (목)", fullDate: "2025-10-17", hasDot: false },
    { date: "10월 18일 (금)", fullDate: "2025-10-18", hasDot: true },
    { date: "10월 19일 (토)", fullDate: "2025-10-19", hasDot: false },
    { date: "10월 20일 (일)", fullDate: "2025-10-20", hasDot: false },
    { date: "10월 21일 (월)", fullDate: "2025-10-21", hasDot: true },
    { date: "10월 22일 (화)", fullDate: "2025-10-22", hasDot: false },
];

export function ScheduleClient({ schedules }: ScheduleClientProps) {
    const [selectedDate, setSelectedDate] = useState<string>("2025-10-16");

    const filteredSchedules = schedules.filter(s => s.date === selectedDate);

    return (
        <main className="mx-auto max-w-7xl px-8 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">내 수업 스케줄</h1>
                    <p className="text-sm text-gray-500">이번 주 예약된 {schedules.length}개의 수업이 있어요.</p>
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
                            {DATES.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(item.fullDate)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                        selectedDate === item.fullDate
                                            ? "bg-primary text-white shadow-md shadow-blue-200"
                                            : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                    )}
                                >
                                    <span>{item.date}</span>
                                    {item.hasDot && (
                                        <span className={cn("h-2 w-2 rounded-full", selectedDate === item.fullDate ? "bg-white" : "bg-primary")} />
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
                            {DATES.find(d => d.fullDate === selectedDate)?.date} · 수업 {filteredSchedules.length}개
                        </h3>

                        <div className="space-y-4">
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule) => (
                                    <div key={schedule.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Image src="/watch.svg" alt="Time" width={20} height={20} className="text-gray-400" />
                                                <span className="font-bold text-gray-900 text-lg">{schedule.time}</span>
                                            </div>
                                            <Badge className="bg-green-50 text-green-600 border-none px-3 py-1">예약 완료</Badge>
                                        </div>

                                        <div className="mb-6 flex items-center gap-4">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                                                {schedule.class.tutorName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-lg">{schedule.class.tutorName} 선생님</div>
                                                <div className="text-sm text-gray-500">{schedule.class.level}</div>
                                            </div>
                                        </div>

                                        <div className="mb-6 flex gap-3">
                                            <Button className="flex-1 gap-2 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white border-none h-12 font-bold">
                                                <Image src="/video.svg" alt="Video" width={18} height={18} className="brightness-0 invert" />
                                                Zoom 입장
                                            </Button>
                                            <Button variant="outline" className="flex-1 gap-2 h-12 font-bold text-gray-700 border-gray-200">
                                                <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                수업 노트
                                            </Button>
                                        </div>

                                        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-xl">
                                            <div className="flex">
                                                <span className="w-16 text-gray-500 font-medium">교재:</span>
                                                <span className="text-gray-900 font-medium">{schedule.class.title}</span>
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
