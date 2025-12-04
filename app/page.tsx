import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function Dashboard() {
  const schedules = await db.schedule.getAll();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <DashboardClient schedules={schedules} />
    </div>
  );
}

