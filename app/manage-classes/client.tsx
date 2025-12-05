"use client";

import { Button } from "@/components/ui/Button";
import { ClassItem } from "@/types";
import Link from "next/link";

interface ManageClassesClientProps {
    myClasses: ClassItem[];
}

export function ManageClassesClient({ myClasses }: ManageClassesClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">내가 등록한 수업</h2>
                <Link href="/class/new">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                        + 새 수업 등록
                    </Button>
                </Link>
            </div>

            {myClasses.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myClasses.map((cls) => (
                        <div key={cls.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                            <div className="relative h-48 bg-gray-200">
                                <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
                                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 backdrop-blur-sm">
                                    {cls.category}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="mb-2 text-lg font-bold text-gray-900">{cls.title}</h3>
                                <div className="mb-4 flex items-center gap-2 text-xs">
                                    <span className="bg-blue-50 text-primary px-2 py-1 rounded font-bold">
                                        {cls.level}
                                    </span>
                                    <span className="text-gray-500">{cls.type}</span>
                                </div>
                                <p className="mb-6 text-sm text-gray-500 line-clamp-2">
                                    {cls.description}
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/manage-classes/${cls.id}`} className="flex-1">
                                        <Button variant="primary" className="w-full rounded-lg bg-primary text-white">
                                            관리하기
                                        </Button>
                                    </Link>
                                    <Link href={`/class/${cls.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-lg">
                                            자세히보기
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                    <p className="text-gray-500 mb-4">등록된 수업이 없습니다.</p>
                    <Link href="/class/new">
                        <Button>첫 수업 등록하기</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
