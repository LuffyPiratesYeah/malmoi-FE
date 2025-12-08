"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ScheduleItem } from "@/types";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/useBookingStore";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DashboardClientProps {
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

export function DashboardClient({ schedules, isLoading }: DashboardClientProps) {
    const sortedSchedules = useMemo(
        () =>
            [...schedules].sort(
                (a, b) =>
                    new Date(`${a.date}T${a.time}`).getTime() -
                    new Date(`${b.date}T${b.time}`).getTime()
            ),
        [schedules]
    );

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    // Find next confirmed schedule (scheduled or completed, not pending)
    const nextSchedule = sortedSchedules.find((s) =>
        (s.status === "scheduled" || s.status === "completed") &&
        new Date(`${s.date}T${s.time}`) >= now
    ) || sortedSchedules.find((s) => s.status === "scheduled" || s.status === "completed") || null;
    const todaySchedules = sortedSchedules.filter(s => s.date === today);

    // State for checkboxes
    const [prepChecks, setPrepChecks] = useState<boolean[]>([false, false, false]);
    const [todoChecks, setTodoChecks] = useState<boolean[]>([false, false, false, false]);

    // State for Quick Reserve
    const { quickTimes, activeQuickTimeId, setActiveQuickTime, addQuickTime, removeQuickTime } = useBookingStore();
    const [isQuickTimeModalOpen, setIsQuickTimeModalOpen] = useState(false);
    const [quickTimeForm, setQuickTimeForm] = useState({ label: "", time: "" });
    const router = useRouter();

    const handleAddQuickTime = () => {
        if (!quickTimeForm.label || !quickTimeForm.time) {
            toast.error("모든 필드를 입력해주세요");
            return;
        }
        addQuickTime(quickTimeForm);
        setQuickTimeForm({ label: "", time: "" });
        setIsQuickTimeModalOpen(false);
        toast.success("빠른 예약 시간이 추가되었습니다");
    };

    const handleBookWithQuickTime = () => {
        if (!activeQuickTimeId) {
            toast.error("시간을 선택해주세요");
            return;
        }
        router.push("/class?quick=true");
    };

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
                        {isLoading ? (
                            <div className="flex h-full flex-col items-center justify-center text-center py-12">
                                <p className="text-gray-500">스케줄을 불러오는 중입니다...</p>
                            </div>
                        ) : nextSchedule ? (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-primary">
                                        <Image src="/watch.svg" alt="Clock" width={16} height={16} />
                                        {formatDateLabel(nextSchedule.date)} {nextSchedule.time} 수업 예정
                                    </div>

                                    {nextSchedule.status === "scheduled" && (
                                        <div className="flex gap-3">
                                            {nextSchedule.zoomLink ? (
                                                <Button
                                                    className="h-11 px-6 text-sm font-bold bg-[#13c0ff] hover:bg-[#13c0ff]/90 text-white shadow-md shadow-blue-200 border-none"
                                                    onClick={() => window.open(nextSchedule.zoomLink, '_blank')}
                                                >
                                                    <Image src="/video.svg" alt="Video" width={18} height={18} className="mr-2 brightness-0 invert" />
                                                    Zoom으로 입장하기
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="h-11 px-6 text-sm font-bold bg-gray-300 text-gray-500 border-none cursor-not-allowed"
                                                    disabled
                                                >
                                                    <Image src="/video.svg" alt="Video" width={18} height={18} className="mr-2" />
                                                    링크 대기중
                                                </Button>
                                            )}
                                            {nextSchedule.googleDocsLink ? (
                                                <Button
                                                    variant="outline"
                                                    className="h-11 px-6 text-sm font-bold rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                                                    onClick={() => window.open(nextSchedule.googleDocsLink, '_blank')}
                                                >
                                                    <Image src="/google_note.svg" alt="Note" width={18} height={18} className="mr-2" />
                                                    구글 문서 열기
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="h-11 px-6 text-sm font-bold rounded-full border-gray-200 text-gray-400 cursor-not-allowed"
                                                    disabled
                                                >
                                                    <Image src="/google_note.svg" alt="Note" width={18} height={18} className="mr-2" />
                                                    노트 대기중
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-6 mb-8">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl overflow-hidden">
                                        {nextSchedule.class?.tutorName?.[0] || "튜터"}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{nextSchedule.class?.tutorName || "튜터"} 선생님</h3>
                                        <p className="text-sm text-gray-500 mb-3">전직 국어 교사 · 한국어교원 2급</p>
                                        <div className="flex gap-2">
                                            {nextSchedule.class?.category && (
                                                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">{nextSchedule.class.category}</span>
                                            )}
                                            {nextSchedule.class?.level && (
                                                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">{nextSchedule.class.level}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 text-sm">
                                    <div className="flex items-center">
                                        <span className="w-24 text-gray-500">수업 주제:</span>
                                        <span className="font-bold text-gray-900 text-base">{nextSchedule.class?.title || "등록된 수업 없음"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-24 text-gray-500">형태:</span>
                                        <span className="font-medium text-gray-700">1:1 화상수업 · {nextSchedule.class?.type || "-"} · {nextSchedule.class?.level || "-"}</span>
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

                                {/* Weekly Schedule */}
                                <Card className="border border-[#ced4da] shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-base font-bold text-gray-900">다가오는 수업</h3>
                                        <Link href="/schedule" className="text-xs font-medium text-gray-500 underline decoration-gray-300 hover:text-gray-900">
                                            전체 보기
                                        </Link>
                                    </div>

                                    {sortedSchedules.length > 0 ? (
                                        <div className="space-y-3">
                                            {sortedSchedules.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700 min-w-[120px] text-center">
                                                            {formatDateLabel(item.date)}
                                                        </span>
                                                        <span className="font-bold text-gray-900 text-sm">{item.time.split('-')[0]}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-600">{item.class?.tutorName || "튜터"} 선생님</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === "pending"
                                                                ? "bg-yellow-50 text-yellow-700"
                                                                : item.status === "scheduled"
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : item.status === "completed"
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-gray-50 text-gray-700"
                                                                }`}>
                                                                {item.status === "pending" ? "대기" : item.status === "scheduled" ? "예약" : item.status === "completed" ? "완료" : "취소"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {item.status === "scheduled" && (
                                                        <div className="flex gap-2">
                                                            {item.zoomLink ? (
                                                                <div
                                                                    className="cursor-pointer transition-opacity hover:opacity-80 text-gray-700"
                                                                    onClick={() => window.open(item.zoomLink, '_blank')}
                                                                >
                                                                    <Image src="/video.svg" alt="Video" width={18} height={18} />
                                                                </div>
                                                            ) : (
                                                                <div className="cursor-not-allowed text-gray-300">
                                                                    <Image src="/video.svg" alt="Video" width={18} height={18} />
                                                                </div>
                                                            )}
                                                            {item.googleDocsLink ? (
                                                                <div
                                                                    className="cursor-pointer transition-opacity hover:opacity-80 text-gray-700"
                                                                    onClick={() => window.open(item.googleDocsLink, '_blank')}
                                                                >
                                                                    <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                                </div>
                                                            ) : (
                                                                <div className="cursor-not-allowed text-gray-300">
                                                                    <Image src="/google_note.svg" alt="Note" width={18} height={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
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
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <Image src="/watch.svg" alt="Calendar" width={20} height={20} className="text-primary" />
                                오늘 · {formatDateLabel(today)}
                            </div>
                            <button
                                onClick={() => setIsQuickTimeModalOpen(true)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <p>+</p> 추가
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                            {quickTimes.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">등록된 빠른 예약 시간이 없습니다.</p>
                            ) : (
                                quickTimes.map((qt) => (
                                    <div
                                        key={qt.id}
                                        onClick={() => setActiveQuickTime(activeQuickTimeId === qt.id ? null : qt.id)}
                                        className={cn(
                                            "group relative flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition-colors cursor-pointer shrink-0",
                                            activeQuickTimeId === qt.id
                                                ? "border-primary bg-blue-50 text-primary"
                                                : "border-gray-200 text-gray-800 hover:border-primary/50"
                                        )}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span>{qt.label}</span>
                                            <span className="text-xs font-normal opacity-80">{qt.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeQuickTimeId === qt.id && (
                                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeQuickTime(qt.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                            >
                                                <p>x</p>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Button
                            className="mt-6 w-full bg-primary text-white hover:bg-primary/90"
                            onClick={handleBookWithQuickTime}
                            disabled={!activeQuickTimeId}
                        >
                            선택한 시간으로 예약하기
                        </Button>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isQuickTimeModalOpen}
                onClose={() => setIsQuickTimeModalOpen(false)}
                title="빠른 예약 시간 추가"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">라벨 (예: 내일 오전)</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
                            placeholder="알기 쉬운 이름을 입력하세요"
                            value={quickTimeForm.label}
                            onChange={(e) => setQuickTimeForm({ ...quickTimeForm, label: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">시간</label>
                        <input
                            type="time"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
                            value={quickTimeForm.time}
                            onChange={(e) => setQuickTimeForm({ ...quickTimeForm, time: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsQuickTimeModalOpen(false)}>
                            취소
                        </Button>
                        <Button className="flex-1 bg-primary text-white" onClick={handleAddQuickTime}>
                            추가하기
                        </Button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
