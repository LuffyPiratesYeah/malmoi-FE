"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ClassItem, ScheduleItem } from "@/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/useAuthStore";
import { useRouter } from "next/navigation";

interface ManageClassDetailClientProps {
    classData: ClassItem;
}

type Tab = "schedule" | "members" | "tasks";

type TeacherTaskType = "prep" | "today" | "quick";
interface TeacherTask {
    id: string;
    title: string;
    type: TeacherTaskType;
    done: boolean;
    scheduledAt?: string;
}

export function ManageClassDetailClient({ classData }: ManageClassDetailClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("schedule");
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const [scheduleForm, setScheduleForm] = useState({
        date: "",
        time: "",
        studentId: "",
    });

    const [tasks, setTasks] = useState<TeacherTask[]>([]);
    const [taskForm, setTaskForm] = useState<{ title: string; type: TeacherTaskType; scheduledAt: string }>({
        title: "",
        type: "prep",
        scheduledAt: "",
    });

    const localKey = useMemo(() => `class-teacher-board-${classData.id}`, [classData.id]);

    const loadSchedules = useCallback(async () => {
        try {
            const response = await fetch(`/api/schedules?classId=${classData.id}`);
            const data = await response.json();
            setSchedules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load schedules:", error);
        }
    }, [classData.id]);

    useEffect(() => {
        const saved = localStorage.getItem(localKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setTasks(parsed);
                }
            } catch {
                // ignore parse errors
            }
        }
    }, [localKey]);

    const saveTasks = (next: TeacherTask[]) => {
        setTasks(next);
        localStorage.setItem(localKey, JSON.stringify(next));
    };

    useEffect(() => {
        loadSchedules();
    }, [loadSchedules]);

    const members = useMemo(() => {
        const map = new Map<string, { id: string; name: string; email: string; bookings: ScheduleItem[] }>();
        schedules.forEach((s) => {
            if (!s.studentId) return;
            const existing = map.get(s.studentId) || { id: s.studentId, name: s.studentName || "수강생", email: s.studentEmail || "", bookings: [] };
            existing.bookings.push(s);
            map.set(s.studentId, existing);
        });
        return Array.from(map.values());
    }, [schedules]);

    const summary = useMemo(() => {
        return {
            total: schedules.length,
            scheduled: schedules.filter((s) => s.status === "scheduled").length,
            completed: schedules.filter((s) => s.status === "completed").length,
            cancelled: schedules.filter((s) => s.status === "cancelled").length,
        };
    }, [schedules]);

    const handleScheduleSubmit = async () => {
        if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.studentId) {
            toast.error("학생, 날짜, 시간을 모두 선택해주세요");
            return;
        }

        if (!user?.id) {
            toast.error("로그인이 필요합니다");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId: classData.id,
                    date: scheduleForm.date,
                    time: scheduleForm.time,
                    studentId: scheduleForm.studentId,
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast.success("일정이 추가되었습니다");
            setIsScheduleModalOpen(false);
            setScheduleForm({ date: "", time: "", studentId: "" });
            await loadSchedules();
        } catch (error) {
            console.error("Failed to create schedule:", error);
            toast.error("일정 추가에 실패했습니다");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateScheduleStatus = async (id: string, status: ScheduleItem["status"]) => {
        try {
            const res = await fetch(`/api/schedules/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success("상태를 업데이트했습니다");
            await loadSchedules();
        } catch (error) {
            console.error("Failed to update schedule", error);
            toast.error("상태 업데이트 실패");
        }
    };

    const deleteSchedule = async (id: string) => {
        if (!confirm("이 일정을 삭제하시겠어요?")) return;
        try {
            const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            toast.success("일정이 삭제되었습니다");
            await loadSchedules();
        } catch (error) {
            console.error("Failed to delete schedule", error);
            toast.error("삭제 실패");
        }
    };

    const addTask = () => {
        if (!taskForm.title.trim()) {
            toast.error("할 일을 입력해주세요");
            return;
        }
        const newTask: TeacherTask = {
            id: crypto.randomUUID(),
            title: taskForm.title.trim(),
            type: taskForm.type,
            done: false,
            scheduledAt: taskForm.scheduledAt || undefined,
        };
        const next = [...tasks, newTask];
        saveTasks(next);
        setTaskForm({ title: "", type: taskForm.type, scheduledAt: "" });
    };

    const toggleTask = (id: string) => {
        const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
        saveTasks(next);
    };

    const removeTask = (id: string) => {
        const next = tasks.filter((t) => t.id !== id);
        saveTasks(next);
    };

    const filteredTasks = (type: TeacherTaskType) => tasks.filter((t) => t.type === type);

    const TaskList = ({ type, title }: { type: TeacherTaskType; title: string }) => (
        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <span className="text-xs text-gray-500">{filteredTasks(type).length}개</span>
            </div>
            {filteredTasks(type).length === 0 ? (
                <p className="text-sm text-gray-500">등록된 항목이 없습니다.</p>
            ) : (
                <div className="space-y-2">
                    {filteredTasks(type).map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                            <label className="flex items-center gap-2 text-sm text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleTask(task.id)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className={task.done ? "line-through text-gray-400" : ""}>{task.title}</span>
                                {task.scheduledAt && (
                                    <span className="text-xs text-gray-500">({task.scheduledAt})</span>
                                )}
                            </label>
                            <button
                                className="text-xs text-gray-400 hover:text-red-500"
                                onClick={() => removeTask(task.id)}
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

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
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === "tasks"
                                ? "text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        준비/할 일
                        {activeTab === "tasks" && (
                            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "schedule" ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">신청/예약 관리</h3>
                            <p className="text-sm text-gray-500">학생들의 예약을 확인하고 상태를 업데이트하세요.</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">예약 {summary.scheduled}</span>
                            <span className="rounded-full bg-green-50 px-3 py-1 font-bold text-green-700">완료 {summary.completed}</span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-700">취소 {summary.cancelled}</span>
                            <Button
                                className="bg-primary text-white"
                                onClick={() => setIsScheduleModalOpen(true)}
                                disabled={members.length === 0}
                                title={members.length === 0 ? "수강생이 있어야 일정을 추가할 수 있습니다." : ""}
                            >
                                + 일정 추가
                            </Button>
                        </div>
                    </div>

                    {schedules.length > 0 ? (
                        <div className="space-y-3">
                            {schedules.map((schedule) => (
                                <div key={schedule.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <span className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 min-w-[80px] text-center">
                                            {schedule.date}
                                        </span>
                                        <span className="font-bold text-gray-900">{schedule.time}</span>
                                        <span className="text-sm text-gray-700">{schedule.studentName || "이름 없음"}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${schedule.status === "scheduled"
                                                ? "bg-blue-50 text-blue-700"
                                                : schedule.status === "completed"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-50 text-gray-700"
                                            }`}>
                                            {schedule.status === "scheduled" ? "예약" : schedule.status === "completed" ? "완료" : "취소"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {schedule.status !== "completed" && (
                                            <Button variant="outline" size="sm" onClick={() => updateScheduleStatus(schedule.id, "completed")}>
                                                완료 처리
                                            </Button>
                                        )}
                                        {schedule.status !== "cancelled" && (
                                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => updateScheduleStatus(schedule.id, "cancelled")}>
                                                취소
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" className="text-gray-500" onClick={() => deleteSchedule(schedule.id)}>
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
                activeTab === "members" ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">수강생 목록</h3>
                            <div className="text-sm text-gray-500">
                                총 <span className="font-bold text-gray-900">{members.length}</span>명
                            </div>
                        </div>
                        {members.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>등록된 수강생이 없습니다.</p>
                                <p className="text-sm mt-2">학생들이 수업을 신청하면 여기에 표시됩니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div key={member.id} className="rounded-lg border border-gray-200 p-4 flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-3 justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900">{member.name}</div>
                                                <div className="text-sm text-gray-500">{member.email || "이메일 없음"}</div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="rounded-full bg-blue-50 px-2 py-1 font-bold text-blue-700">
                                                    예약 {member.bookings.filter((b) => b.status === "scheduled").length}
                                                </span>
                                                <span className="rounded-full bg-green-50 px-2 py-1 font-bold text-green-700">
                                                    완료 {member.bookings.filter((b) => b.status === "completed").length}
                                                </span>
                                                <span className="rounded-full bg-gray-100 px-2 py-1 font-bold text-gray-700">
                                                    취소 {member.bookings.filter((b) => b.status === "cancelled").length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                            {member.bookings.map((b) => (
                                                <span key={b.id} className="rounded bg-gray-100 px-2 py-1">
                                                    {b.date} {b.time} ({b.status === "scheduled" ? "예약" : b.status === "completed" ? "완료" : "취소"})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">준비/할 일</h3>
                                <p className="text-sm text-gray-500">수업 준비, 오늘 할 일, 빠른 예약 메모를 관리하세요.</p>
                            </div>
                            <button
                                onClick={() => router.refresh()}
                                className="text-sm text-gray-500 hover:text-gray-800"
                            >
                                새로고침
                            </button>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                            <div className="grid md:grid-cols-3 gap-3">
                                <Input
                                    label="할 일"
                                    placeholder="예: 자료 인쇄, 교재 준비"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                />
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">유형</label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: "prep", label: "수업 준비" },
                                            { value: "today", label: "오늘 할 일" },
                                            { value: "quick", label: "빠른 예약" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`rounded-full px-3 py-1 text-xs border transition-colors ${taskForm.type === opt.value
                                                        ? "border-primary text-primary bg-blue-50"
                                                        : "border-gray-200 text-gray-600 hover:border-primary/50"
                                                    }`}
                                                onClick={() => setTaskForm({ ...taskForm, type: opt.value as TeacherTaskType })}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Input
                                    label="예약 시간(옵션)"
                                    type="time"
                                    value={taskForm.scheduledAt}
                                    onChange={(e) => setTaskForm({ ...taskForm, scheduledAt: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button className="bg-primary text-white" onClick={addTask}>
                                    추가
                                </Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <TaskList type="prep" title="수업 준비" />
                            <TaskList type="today" title="오늘 할 일" />
                            <TaskList type="quick" title="빠른 예약 메모" />
                        </div>
                    </div>
                )
            )}

            {/* Add Schedule Modal */}
            <Modal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                title="일정 추가"
            >
                <div className="space-y-6">
                    {members.length === 0 && (
                        <p className="text-sm text-red-500">수강생이 없습니다. 학생이 예약을 한 이후에 일정을 추가할 수 있습니다.</p>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">수강생 선택</label>
                        <select
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-gray-50"
                            value={scheduleForm.studentId}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, studentId: e.target.value })}
                            disabled={members.length === 0}
                        >
                            <option value="">수강생을 선택하세요</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name || "수강생"} ({m.email || "이메일 없음"})
                                </option>
                            ))}
                        </select>
                    </div>
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
                            disabled={isSubmitting || members.length === 0}
                        >
                            {isSubmitting ? "추가 중..." : "추가하기"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
