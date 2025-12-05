"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { useState } from "react";
import { ClassItem } from "@/types";
import { bookClassAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ClassListClientProps {
    classes: ClassItem[];
}

export function ClassListClient({ classes }: ClassListClientProps) {
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    // Filter States
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string>("all");

    // Search & Top Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    const [showRecentOnly, setShowRecentOnly] = useState(false);

    // Mock Data for Liked & Recent
    // In a real app, this would come from the DB or local storage
    const [likedClassIds, setLikedClassIds] = useState<Set<string>>(new Set());
    const [recentClassIds] = useState<Set<string>>(new Set([classes[0]?.id, classes[1]?.id].filter(Boolean))); // Mock: first two classes are "recent"

    const handleBookingClick = (cls: ClassItem) => {
        if (!isAuthenticated) {
            toast.error("로그인이 필요합니다");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
            return;
        }
        setSelectedClass(cls);
    };

    const handleBooking = async () => {
        if (selectedClass) {
            await bookClassAction(selectedClass.id);
            setSelectedClass(null);
            setIsSuccessModalOpen(true);
        }
    };

    const toggleLike = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const newLiked = new Set(likedClassIds);
        if (newLiked.has(id)) {
            newLiked.delete(id);
        } else {
            newLiked.add(id);
        }
        setLikedClassIds(newLiked);
    };

    const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
    };

    const resetFilters = () => {
        setSelectedLevels([]);
        setSelectedGoals([]);
        setSelectedFormats([]);
        setSelectedDuration("all");
        setSearchQuery("");
        setShowLikedOnly(false);
        setShowRecentOnly(false);
    };

    const filteredClasses = classes.filter(cls => {
        // Sidebar Filters
        if (selectedLevels.length > 0 && !selectedLevels.includes(cls.level)) return false;
        if (selectedGoals.length > 0 && !selectedGoals.includes(cls.category)) return false;
        if (selectedFormats.length > 0 && !selectedFormats.includes(cls.type)) return false;

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchTitle = cls.title.toLowerCase().includes(query);
            const matchDesc = cls.description.toLowerCase().includes(query);
            const matchTutor = cls.tutorName.toLowerCase().includes(query);
            if (!matchTitle && !matchDesc && !matchTutor) return false;
        }

        // Top Filters
        if (showLikedOnly && !likedClassIds.has(cls.id)) return false;
        if (showRecentOnly && !recentClassIds.has(cls.id)) return false;

        return true;
    });

    return (
        <div className="space-y-8">
            {/* Top Controls */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">강의/교재</h1>
                        <p className="text-sm text-gray-500">튜터와 함께 사용할 강의·교재를 미리 골라보세요.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                            <div
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                    showRecentOnly ? "bg-primary" : "bg-gray-200"
                                )}
                                onClick={() => setShowRecentOnly(!showRecentOnly)}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        showRecentOnly ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </div>
                            최근에 사용한 강의만 보기
                        </label>
                        <button
                            onClick={() => setShowLikedOnly(!showLikedOnly)}
                            className={cn(
                                "text-sm font-medium hover:underline transition-colors",
                                showLikedOnly ? "text-primary font-bold" : "text-gray-500"
                            )}
                        >
                            내가 찜한 강의
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="강의 이름, 주제, 교재를 검색하세요"
                            className="h-12 w-full rounded-lg border border-gray-200 pl-12 pr-4 text-sm focus:border-primary focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {useAuthStore((state) => state.user?.userType === "teacher") && (
                        <Link href="/class/new">
                            <Button className="h-12 bg-blue-50 text-primary hover:bg-blue-100">
                                수업 추가하기
                            </Button>
                        </Link>
                    )}
                    <div className="flex gap-2">
                        {["비즈니스", "K-Drama", "TOPIK 대비", "입문자용"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <div className="w-64 flex-shrink-0 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">필터</h3>
                        <button onClick={resetFilters} className="text-xs text-primary hover:underline">모두 초기화</button>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">레벨</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={selectedLevels.length === 0}
                                    onChange={() => setSelectedLevels([])}
                                />
                                <span className="text-sm text-gray-600">전체</span>
                            </label>
                            {["입문 (TOPIK 1-2)", "중급 (TOPIK 3-4)", "고급 (TOPIK 5-6)"].map((level) => (
                                <label key={level} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedLevels.includes(level)}
                                        onChange={() => toggleFilter(level, selectedLevels, setSelectedLevels)}
                                    />
                                    <span className="text-sm text-gray-600">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">학습 목표</h4>
                        <div className="space-y-2">
                            {["비즈니스", "유학/학업", "K-Drama/K-POP", "일상 회화", "시험 대비"].map((goal) => (
                                <label key={goal} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedGoals.includes(goal)}
                                        onChange={() => toggleFilter(goal, selectedGoals, setSelectedGoals)}
                                    />
                                    <span className="text-sm text-gray-600">{goal}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">형식</h4>
                        <div className="space-y-2">
                            {["영상 강의", "읽기 자료(PDF)", "실전 연습(퀴즈)", "수업 녹화"].map((format) => (
                                <label key={format} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedFormats.includes(format)}
                                        onChange={() => toggleFilter(format, selectedFormats, setSelectedFormats)}
                                    />
                                    <span className="text-sm text-gray-600">{format}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">소요 시간</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="duration"
                                    className="text-primary focus:ring-primary"
                                    checked={selectedDuration === "all"}
                                    onChange={() => setSelectedDuration("all")}
                                />
                                <span className="text-sm text-gray-600">전체</span>
                            </label>
                            {["15분 이하", "30분 내", "1시간 이상"].map((time) => (
                                <label key={time} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="duration"
                                        className="text-primary focus:ring-primary"
                                        checked={selectedDuration === time}
                                        onChange={() => setSelectedDuration(time)}
                                    />
                                    <span className="text-sm text-gray-600">{time}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">총 <span className="font-bold text-primary">{filteredClasses.length}개</span> 강의</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">정렬:</span>
                            <select className="rounded-md border border-gray-200 py-1 pl-2 pr-8 text-sm focus:border-primary focus:outline-none">
                                <option>추천순</option>
                                <option>최신순</option>
                                <option>인기순</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-sm text-gray-600">영상 강의만</span>
                            </label>
                        </div>
                    </div>

                    {filteredClasses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredClasses.map((cls) => (
                                <div key={cls.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                                    <div className="relative h-40 w-full bg-gray-200">
                                        <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
                                        <div className="absolute right-3 top-3 flex gap-2">
                                            <button
                                                onClick={(e) => toggleLike(e, cls.id)}
                                                className="rounded-full bg-white/90 p-1.5 text-gray-400 hover:text-red-500 backdrop-blur-sm transition-colors"
                                            >
                                                <svg
                                                    className={cn("h-4 w-4", likedClassIds.has(cls.id) ? "fill-red-500 text-red-500" : "")}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                            <Badge className="bg-white/90 backdrop-blur-sm">{cls.category}</Badge>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">{cls.title}</h3>
                                        <div className="mb-3 flex items-center gap-2 text-xs">
                                            <Badge variant="primary">{cls.level}</Badge>
                                            <span className="text-gray-500">{cls.type}</span>
                                        </div>
                                        <p className="mb-6 text-sm text-gray-500 line-clamp-2 h-10">
                                            {cls.description}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link href={`/class/${cls.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full rounded-lg text-sm" size="sm">자세히 보기</Button>
                                            </Link>
                                            <Button
                                                className="flex-1 rounded-lg text-sm bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white border-none"
                                                size="sm"
                                                onClick={() => handleBookingClick(cls)}
                                            >
                                                수업 예약
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                            <p className="text-gray-500 mb-4">조건에 맞는 강의가 없습니다.</p>
                            <Button variant="outline" onClick={resetFilters}>필터 초기화</Button>
                        </div>
                    )}

                    <Modal
                        isOpen={!!selectedClass}
                        onClose={() => setSelectedClass(null)}
                        title="수업예약"
                        footer={
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setSelectedClass(null)}>
                                    취소
                                </Button>
                                <Button className="flex-1 bg-primary text-white" onClick={handleBooking}>
                                    확인
                                </Button>
                            </div>
                        }
                    >
                        <p className="text-lg">
                            <span className="font-bold text-primary">{selectedClass?.title}</span> 수업을 예약 하시겠습니까?
                        </p>
                    </Modal>

                    <Modal
                        isOpen={isSuccessModalOpen}
                        onClose={() => setIsSuccessModalOpen(false)}
                    >
                        <div className="flex flex-col items-center space-y-4 py-4">
                            <h3 className="text-xl font-bold text-primary">예약 완료!</h3>
                            <p className="text-center text-gray-500">
                                수업 예약이 완료되었습니다.<br />
                                스케줄 페이지에서 확인해보세요.
                            </p>
                            <Link href="/schedule" className="w-full">
                                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                                    스케줄 확인하기
                                </Button>
                            </Link>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
