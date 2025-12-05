"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClassAction } from "@/app/actions";

export default function NewClassPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        toast.success("수업이 등록되었습니다!");

        // 서버 액션 호출 - redirect()가 자동으로 페이지 이동시킴
        await createClassAction(formData);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-4xl px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-gray-900">강의/교재 추가하기</h1>
                    <p className="text-sm text-gray-500">학생과 함께 수업할 강의를 추가해보세요</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Title */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <span className="text-red-500">*</span>제목 추가하기
                        </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="제목을 입력해주세요"
                            className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:border-primary focus:outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <span className="text-red-500">*</span>설명 추가하기
                        </label>
                        <textarea
                            name="description"
                            placeholder="추가설명을 입력해주세요"
                            className="h-32 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm focus:border-primary focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Thumbnail */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                <span className="text-red-500">*</span>썸네일 추가하기
                            </label>
                            <input
                                name="thumbnail"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                id="thumbnail-input"
                                required
                            />
                            <label htmlFor="thumbnail-input" className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-center">
                                <span className="text-sm text-gray-300">사진을 추가해주세요</span>
                                <span className="text-xs text-gray-300">600X500 이하</span>
                            </label>
                        </div>

                        {/* Right side grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* 레벨 */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <span className="text-red-500">*</span>레벨
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["입문 (TOPIK 1-2)", "중급 (TOPIK 3-4)", "고급 (TOPIK 5-6)"].map((level) => (
                                        <label key={level} className="cursor-pointer">
                                            <input type="radio" name="level" value={level} className="peer sr-only" required />
                                            <span className="inline-block rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 transition-colors peer-checked:bg-primary peer-checked:text-white hover:bg-gray-200">
                                                {level}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Goal */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <span className="text-red-500">*</span>학습목표
                                </label>
                                <div className="flex flex-wrap gap-1">
                                    {["비즈니스", "유학/학업", "K-Drama/K-POP", "일상 회화", "시험 대비"].map((goal) => (
                                        <label key={goal} className="cursor-pointer">
                                            <input type="checkbox" name="category" value={goal} className="peer sr-only" />
                                            <span className="inline-block rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 transition-colors peer-checked:bg-primary peer-checked:text-white hover:bg-gray-200">
                                                {goal}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Format */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <span className="text-red-500">*</span>형식
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["영상 강의", "읽기 자료(PDF)", "실전 연습(퀴즈)", "수업 녹화"].map((format) => (
                                        <label key={format} className="cursor-pointer">
                                            <input type="checkbox" name="type" value={format} className="peer sr-only" />
                                            <span className="inline-block rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 transition-colors peer-checked:bg-primary peer-checked:text-white hover:bg-gray-200">
                                                {format}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <span className="text-red-500">*</span>자료
                                </label>
                                <input
                                    name="materials"
                                    type="file"
                                    accept=".pdf,.pptx"
                                    className="hidden"
                                    id="materials-input"
                                    required
                                />
                                <label htmlFor="materials-input" className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-center">
                                    <span className="text-xs text-gray-300">형식에 맞는 자료를<br/>업로드해주세요</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-8">
                        <Link href="/manage-classes" className="w-40">
                            <Button variant="outline" className="w-full" type="button">
                                취소
                            </Button>
                        </Link>
                        <Button
                            className="w-40 bg-primary hover:bg-primary/90"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "등록 중..." : "추가하기"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
