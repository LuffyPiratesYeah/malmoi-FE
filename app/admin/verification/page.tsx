"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/useAuthStore";
import toast from "react-hot-toast";

interface UserRow {
  id: string;
  email: string;
  name: string;
  userType: "student" | "teacher" | "admin";
  isTeacher: boolean;
  verificationStatus: "none" | "pending" | "verified";
}

export default function AdminVerificationPage() {
  const user = useAuthStore((state) => state.user);
  const [pendingTeachers, setPendingTeachers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users?verificationStatus=pending&userType=teacher", { cache: "no-store" });
      const data: UserRow[] = await res.json();
      setPendingTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load pending teachers", error);
      toast.error("승인 대기 목록을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const approve = async (id: string) => {
    setSubmitting(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus: "verified",
          isTeacher: true,
          userType: "teacher",
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      toast.success("인증을 승인했습니다");
      loadPending();
    } catch (error) {
      console.error("Failed to approve teacher", error);
      toast.error("승인에 실패했습니다");
    } finally {
      setSubmitting(null);
    }
  };

  if (!user || user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Navbar />
        <main className="mx-auto max-w-4xl px-8 py-12 text-center">
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <main className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">튜터 인증 승인</h1>
            <p className="text-sm text-gray-500 mt-1">승인 대기 중인 튜터 신청을 처리하세요.</p>
          </div>
          <Button variant="outline" onClick={loadPending}>새로고침</Button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">불러오는 중...</div>
        ) : pendingTeachers.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-dashed border-gray-200 rounded-2xl">
            승인 대기 중인 신청이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div>
                  <div className="font-bold text-gray-900">{teacher.name}</div>
                  <div className="text-sm text-gray-500">{teacher.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">대기</span>
                  <Button
                    className="bg-primary text-white hover:bg-primary/90"
                    size="sm"
                    onClick={() => approve(teacher.id)}
                    disabled={submitting === teacher.id}
                  >
                    {submitting === teacher.id ? "처리 중..." : "인증 승인"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
