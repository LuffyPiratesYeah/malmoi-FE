"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createScheduleAction(classId: string, date: string, time: string) {
    console.log("Creating schedule:", { classId, date, time });

    await db.schedule.create(classId, date, time);

    revalidatePath("/manage-classes");
    revalidatePath(`/manage-classes/${classId}`);
    revalidatePath("/main");
}
