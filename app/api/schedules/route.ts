import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    const allSchedules = await db.schedule.getAll();

    if (classId) {
        const filtered = allSchedules.filter(s => s.classId === classId);
        return NextResponse.json(filtered);
    }

    return NextResponse.json(allSchedules);
}
