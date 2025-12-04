import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { db } from "@/lib/db";
import { ClassListClient } from "./client";

export default async function ClassListPage() {
  const classes = await db.class.getAll();

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">강의/교재</h1>
            <p className="text-sm text-gray-500">튜터와 함께 사용할 강의·교재를 미리 골라보세요.</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </div>
              최근에 사용한 강의만 보기
            </label>
            <button className="text-sm font-medium text-primary hover:underline">내가 찜한 강의</button>
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="강의 이름, 주제, 교재를 검색하세요"
              className="h-12 w-full rounded-lg border border-gray-200 pl-12 pr-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <Link href="/class/new">
            <Button className="h-12 bg-blue-50 text-primary hover:bg-blue-100">
              수업 추가하기
            </Button>
          </Link>
          <div className="flex gap-2">
            {["비즈니스", "K-Drama", "TOPIK 대비", "입문자용"].map((tag) => (
              <button key={tag} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <ClassListClient classes={classes} />
      </main>
    </div>
  );
}
