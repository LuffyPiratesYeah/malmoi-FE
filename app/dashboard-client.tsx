"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ScheduleItem } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
    schedules: ScheduleItem[];
}

export function DashboardClient({ schedules }: DashboardClientProps) {
    const todaySchedules = schedules.filter(s => s.date === "2025-10-16");
    const nextSchedule = todaySchedules[0];

    // State for checkboxes
    const [prepChecks, setPrepChecks] = useState<boolean[]>([false, false, false]);
    const [todoChecks, setTodoChecks] = useState<boolean[]>([false, false, false, false]);

    // State for Quick Reserve
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const togglePrep = (index: number) => {
        const newChecks = [...prepChecks];
        newChecks[index] = !newChecks[index];
        setPrepChecks(newChecks);
    };

    const toggleTodo = (index: number) => {
        const newChecks = [...todoChecks];
        newChecks[index] = !newChecks[index];
        setTodoChecks(newChecks);
    };

    return (
        <main className="mx-auto max-w-[1440px] px-8 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column (Class Info) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-full border border-[#ced4da] shadow-sm">
                        {nextSchedule ? (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-primary">
                                        <Image src="/watch.svg" alt="Clock" width={16} height={16} />
                                        오늘 {nextSchedule.time} 수업 예정
                                    </div>

                                    <div className="flex gap-3">
                                        <Button className="h-11 px-6 text-sm font-bold bg-[#13c0ff] hover:bg-[#13c0ff]/90 text-white shadow-md shadow-blue-200 border-none">
                                            <Image src="/video.svg" alt="Video" width={18} height={18} className="mr-2 brightness-0 invert" />
                                            Zoom으로 입장하기
                                        </Button>
                                        <Button variant="outline" className="h-11 px-6 text-sm font-bold rounded-full border-gray-200 text-gray-700 hover:bg-gray-50">
                                            <Image src="/google_note.svg" alt="Note" width={18} height={18} className="mr-2" />
                                            구글 문서 열기
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 mb-8">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl overflow-hidden">
                                        {/* Mock Avatar if needed, or initials */}
                                        {nextSchedule.class.tutorName[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{nextSchedule.class.tutorName} 선생님</h3>
                                        <p className="text-sm text-gray-500 mb-3">전직 국어 교사 · 한국어교원 2급</p>
                                        <div className="flex gap-2">
                                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">{nextSchedule.class.category}</span>
                                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">{nextSchedule.class.level}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 text-sm">
                                    <div className="flex items-center">
                                        <span className="w-24 text-gray-500">수업 주제:</span>
                                        <span className="font-bold text-gray-900 text-base">{nextSchedule.class.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-24 text-gray-500">형태:</span>
                                        <span className="font-medium text-gray-700">1:1 화상수업 · {nextSchedule.class.type} · {nextSchedule.class.level}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="mb-3 font-bold text-gray-900 text-sm">수업 준비</h4>
                                    <div className="space-y-2">
                                        {["예습 PDF 한 번 읽기", "오늘 회의 상황 메모해오기"].map((item, i) => (
                                            <label key={i} className="flex items-center gap-2 cursor-pointer group">
                                                <div className={cn(
                                                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                                                    prepChecks[i] ? "bg-primary border-primary" : "border-gray-300 bg-white group-hover:border-primary"
                                                )}>
                                                    {prepChecks[i] && (
                                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={prepChecks[i]}
                                                    onChange={() => togglePrep(i)}
                                                />
                                                <span className={cn("text-xs transition-colors", prepChecks[i] ? "text-gray-900 font-medium" : "text-gray-600")}>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="my-6 text-right text-xs text-gray-400">
                                    수업 시작 10분 전부터 입장할 수 있어요.
                                </div>


                                {/* Weekly Schedule - Moved from bottom */}
                                <Card className="border border-[#ced4da] shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-base font-bold text-gray-900">이번 주 수업 일정</h3>
                                        <Link href="/schedule" className="text-xs font-medium text-gray-500 underline decoration-gray-300 hover:text-gray-900">
                                            전체 보기
                                        </Link>
                                    </div>

                                    {schedules.length > 0 ? (
                                        <div className="space-y-3">
                                            {schedules.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700 min-w-[60px] text-center">
                                                            {item.date.slice(5).replace('-', '.')}
                                                        </span>
                                                        <span className="font-bold text-gray-900 text-sm">{item.time.split('-')[0]}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-600">{item.class.tutorName} 선생님</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 text-gray-400">
                                                        <div className="cursor-pointer transition-opacity hover:opacity-80">
                                                            <Image src="/video.svg" alt="Video" width={18} height={18} />
                                                        </div>
                                                        <div className="cursor-pointer transition-opacity hover:opacity-80">
                                                            <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <p className="text-sm text-gray-500 mb-3">아직 예약된 수업이 없어요</p>
                                            <Link href="/class">
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    첫 수업 예약하기
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center py-12">
                                <p className="text-gray-500 mb-4">예정된 수업이 없습니다.</p>
                                <Link href="/class">
                                    <Button>수업 예약하러 가기</Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* To Do */}
                    <Card title="오늘 할 일" subtitle="오늘 수업을 위해 이 정도만 준비해보세요." className="border border-[#ced4da] shadow-sm">
                        <div className="space-y-4 pt-2">
                            {["예습 PDF 1회 읽기", "지난 수업 교정 문장 3개 복습", "K-Buddy와 3분 말하기 연습", "오늘 배울 단어 10개 미리 보기"].map((item, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border transition-colors",
                                        todoChecks[i] ? "bg-primary border-primary" : "border-gray-300 bg-white group-hover:border-primary"
                                    )}>
                                        {todoChecks[i] && (
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={todoChecks[i]}
                                        onChange={() => toggleTodo(i)}
                                    />
                                    <span className={cn("text-sm transition-colors", todoChecks[i] ? "text-gray-900 font-medium" : "text-gray-600")}>{item}</span>
                                </label>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Reserve */}
                    <Card title="빠른 수업 예약" subtitle="원하는 시간에 1:1 수업을 빠르게 예약해보세요." className="border border-[#ced4da] shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-900">
                            <Image src="/watch.svg" alt="Calendar" width={20} height={20} className="text-primary" />
                            오늘 · 10월 16일 (수)
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: '1', label: '오늘 19:00' },
                                { id: '2', label: '오늘 21:00' },
                                { id: '3', label: '내일 20:00' }
                            ].map((time) => (
                                <button
                                    key={time.id}
                                    onClick={() => setSelectedTime(time.id)}
                                    className={cn(
                                        "w-full rounded-full py-3 text-sm font-medium transition-all",
                                        selectedTime === time.id
                                            ? "bg-primary text-white shadow-md shadow-blue-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    <Image src="/watch.svg" alt="Clock" width={16} height={16} className="mr-2 inline-block" /> {time.label}
                                </button>
                            ))}
                        </div>

                        <Link href="/class">
                            <Button className="mt-6 w-full bg-[#13c0ff] hover:bg-[#13c0ff]/90 text-white font-bold h-12" size="lg">
                                이 시간으로 수업 예약하기
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>


        </main>
    );
}
