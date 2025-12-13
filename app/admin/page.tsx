"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";

interface UserRow {
  id: string;
  email: string;
  name: string;
  userType: "student" | "teacher" | "admin";
  isTeacher: boolean;
  verificationStatus: "none" | "pending" | "verified";
}

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUserType, setNewUserType] = useState<"student" | "teacher" | "admin">("student");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data: UserRow[] = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("사용자 목록을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openEditModal = (userRow: UserRow) => {
    setSelectedUser(userRow);
    setNewUserType(userRow.userType);
    setIsEditModalOpen(true);
  };

  const handleUpdateUserType = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType: newUserType,
          // admin으로 변경 시 자동으로 teacher 권한도 부여
          isTeacher: newUserType === "admin" ? true : selectedUser.isTeacher,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success("권한이 변경되었습니다");
      setIsEditModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Failed to update user type", error);
      toast.error("권한 변경에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "student": return "학생";
      case "teacher": return "튜터";
      case "admin": return "관리자";
      default: return userType;
    }
  };

  const getUserTypeBadgeColor = (userType: string) => {
    switch (userType) {
      case "student": return "bg-blue-100 text-blue-800";
      case "teacher": return "bg-green-100 text-green-800";
      case "admin": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user || user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-sm text-gray-500 mt-1">모든 사용자의 권한을 관리하세요.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={loadUsers} className="flex-1 sm:flex-initial">
              새로고침
            </Button>
            <Link href="/admin/verification" className="flex-1 sm:flex-initial">
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                튜터 인증 관리
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">불러오는 중...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-dashed border-gray-200 rounded-2xl">
            등록된 사용자가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider hidden sm:table-cell">
                    이메일
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    권한
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider hidden md:table-cell">
                    튜터 인증
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userRow) => (
                  <tr key={userRow.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{userRow.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{userRow.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {userRow.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getUserTypeBadgeColor(userRow.userType)}`}>
                        {getUserTypeLabel(userRow.userType)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {userRow.isTeacher ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          인증 완료
                        </span>
                      ) : userRow.verificationStatus === "pending" ? (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          대기 중
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">미인증</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(userRow)}
                      >
                        권한 변경
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Type Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="사용자 권한 변경"
        >
          <div className="space-y-6">
            {selectedUser && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-500 mb-1">사용자 정보</div>
                  <div className="font-bold text-gray-900">{selectedUser.name}</div>
                  <div className="text-sm text-gray-600">{selectedUser.email}</div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900">새로운 권한 선택</label>
                  <div className="space-y-2">
                    {(["student", "teacher", "admin"] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          newUserType === type
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={type}
                          checked={newUserType === type}
                          onChange={(e) => setNewUserType(e.target.value as typeof type)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{getUserTypeLabel(type)}</div>
                          <div className="text-xs text-gray-500">
                            {type === "student" && "기본 학생 권한"}
                            {type === "teacher" && "수업 생성 및 관리 권한"}
                            {type === "admin" && "모든 관리 권한 (최고 권한)"}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {newUserType === "admin" && (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                    <div className="flex gap-2">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs text-yellow-800">
                        관리자 권한을 부여하면 모든 시스템 설정과 사용자 관리가 가능합니다. 신중하게 선택하세요.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditModalOpen(false)}
                disabled={submitting}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                onClick={handleUpdateUserType}
                disabled={submitting || newUserType === selectedUser?.userType}
              >
                {submitting ? "변경 중..." : "권한 변경"}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
