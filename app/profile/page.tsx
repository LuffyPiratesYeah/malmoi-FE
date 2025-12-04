import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { ProfileClient } from "./client";

export default async function ProfilePage() {
    const user = await db.user.getCurrent();
    const classes = await db.class.getAll();
    const myClasses = classes.filter(c => c.tutorId === user.id);

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-4xl px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user.name}<span className="font-normal text-gray-500">님</span>
                    </h1>
                </div>

                <ProfileClient user={user} myClasses={myClasses} />
            </main>
        </div>
    );
}

