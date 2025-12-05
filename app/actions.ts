"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    // Simulate login
    redirect("/");
}

export async function signupAction(formData: FormData) {
    // Simulate signup
    redirect("/login");
}

export async function createClassAction(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const level = formData.get("level") as string;
    const category = formData.get("category") as string;
    const type = formData.get("type") as string;

    console.log("====== 수업 등록 시작 ======");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Level:", level);
    console.log("Category:", category);
    console.log("Type:", type);

    const newClass = await db.class.create({
        title,
        description,
        level,
        category,
        type,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000", // Default image
    });

    console.log("Created class:", newClass);
    console.log("All classes:", await db.class.getAll());
    console.log("====== 수업 등록 완료 ======");

    revalidatePath("/class");
    revalidatePath("/manage-classes");
    redirect("/manage-classes");
}

export async function bookClassAction(classId: string) {
    // Book for today at random time for demo
    await db.schedule.create(classId, "2025-10-16", "20:00");
    revalidatePath("/schedule");
    revalidatePath("/class");
}

export async function verifyTeacherAction() {
    const user = await db.user.getCurrent();
    await db.user.update(user.id, { isTeacher: true, verificationStatus: "verified" });
    revalidatePath("/profile");
}
