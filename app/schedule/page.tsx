import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { ScheduleClient } from "./client";

export default async function SchedulePage() {
    const schedules = await db.schedule.getAll();

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />
            <ScheduleClient schedules={schedules} />
        </div>
    );
}
