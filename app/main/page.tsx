"use client";

import { Navbar } from "@/components/layout/Navbar";
import { DashboardClient } from "./dashboard-client";
import { useEffect, useState } from "react";
import { ScheduleItem } from "@/types";
import { useAuthStore } from "@/lib/useAuthStore";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (user?.userType === "admin") {
    return null;
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-8 py-12 text-center">
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
      <DashboardClient schedules={schedules} isLoading={isLoading} />
    </div>
  );
}
