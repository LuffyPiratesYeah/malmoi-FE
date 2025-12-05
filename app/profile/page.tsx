import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { ProfileClient } from "./client";

export default async function ProfilePage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-4xl px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                    <p className="mt-2 text-gray-500">
                        내 정보를 확인하고 관리하세요
                    </p>
                </div>

                <ProfileClient />
            </main>
        </div>
    );
}
