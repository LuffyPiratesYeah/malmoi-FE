import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const classes = await db.class.getAll();
    console.log("API: Returning classes:", classes.length);
    return NextResponse.json(classes);
}
