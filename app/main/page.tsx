"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Modal } from "@/components/ui/Modal";
import { DashboardClient } from "./dashboard-client";
import { ManageClassesClient } from "@/app/manage-classes/client";
import { useEffect, useState } from "react";
import { ScheduleItem, ClassItem } from "@/types";
import { useAuthStore } from "@/lib/useAuthStore";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTeacherVerificationModal, setShowTeacherVerificationModal] = useState(false);
  const [myClasses, setMyClasses] = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (user?.userType === "admin") {
      router.replace("/admin/verification");
      return;
    }
    const fetchSchedules = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/schedules?studentId=${user.id}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setSchedules(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load schedules", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [user?.id, user?.userType, router]);

  useEffect(() => {
    // Show teacher verification modal for unverified teachers
    if (isAuthenticated && user?.userType === "teacher" && !user?.isTeacher && user?.verificationStatus !== "pending") {
      setShowTeacherVerificationModal(true);
    }
  }, [isAuthenticated, user]);

  // 선생님일 때 수업 목록 로드 (userType이 teacher이면 isTeacher 여부와 관계없이)
  useEffect(() => {
    const loadClasses = async () => {
      if (!user?.id || user?.userType !== "teacher") {
        setClassesLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/classes');
        const allClasses: ClassItem[] = await response.json();
        const filtered = allClasses.filter(c => c.tutorId === user?.id);
        setMyClasses(filtered);
      } catch (error) {
        console.error("Failed to load classes:", error);
        setMyClasses([]);
      } finally {
        setClassesLoading(false);
      }
    };
    loadClasses();
  }, [user?.id, user?.userType]);

  if (user?.userType === "admin") {
    return null;
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <p className="text-gray-600 mb-6">로그인 후 대시보드를 확인할 수 있습니다.</p>
          <Link href="/login">
            <Button className="bg-primary text-white">로그인하기</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* 선생님: 수업 관리 화면 / 학생: 대시보드 화면 */}
      {user?.userType === "teacher" ? (
        <main className="mx-auto max-w-6xl px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">수업 관리</h1>
            <p className="text-gray-500 mt-2">내가 등록한 수업을 관리하세요</p>
          </div>
          {classesLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : (
            <ManageClassesClient myClasses={myClasses} />
          )}
        </main>
      ) : (
        <DashboardClient schedules={schedules} isLoading={isLoading} />
      )}

      {/* Teacher Verification Modal */}
      <Modal
        isOpen={showTeacherVerificationModal}
        onClose={() => setShowTeacherVerificationModal(false)}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Icon */}
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900">선생님 인증이 필요해요</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              튜터로 활동하시려면 인증이 필요합니다.<br />
              마이페이지에서 서류를 업로드하고<br />
              승인 요청을 보내주세요.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Link href="/profile" className="block w-full">
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90"
                onClick={() => setShowTeacherVerificationModal(false)}
              >
                인증하러 가기
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowTeacherVerificationModal(false)}
            >
              나중에 하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
