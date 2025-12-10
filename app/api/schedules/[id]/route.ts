import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const allowedStatuses = ["pending", "scheduled", "completed", "cancelled"] as const;
type AllowedStatus = (typeof allowedStatuses)[number];

type RawSchedule = {
  id: string;
  class_id: string;
  date: string;
  time: string;
  status: AllowedStatus;
  student_id: string;
  contact_info?: string;
  zoom_link?: string;
  google_docs_link?: string;
  student?: { id: string; name: string; email: string } | null;
  class?: {
    id: string;
    title: string;
    description: string;
    level: string;
    type: string;
    category: string;
    image: string;
    tutor_id: string;
    tutor_name: string;
    details: unknown;
  } | null;
};

function transformSchedule(schedule: RawSchedule) {
  return {
    id: schedule.id,
    classId: schedule.class_id,
    date: schedule.date,
    time: schedule.time,
    status: schedule.status,
    studentId: schedule.student_id,
    studentName: schedule.student?.name ?? "",
    studentEmail: schedule.student?.email ?? "",
    contactInfo: schedule.contact_info,
    zoomLink: schedule.zoom_link,
    googleDocsLink: schedule.google_docs_link,
    class: schedule.class
      ? {
          id: schedule.class.id,
          title: schedule.class.title,
          description: schedule.class.description,
          level: schedule.class.level,
          type: schedule.class.type,
          category: schedule.class.category,
          image: schedule.class.image,
          tutorId: schedule.class.tutor_id,
          tutorName: schedule.class.tutor_name,
          details: schedule.class.details,
        }
      : null,
  };
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabaseAdmin = await getSupabaseAdmin();
    const updates: {
      status?: string;
      date?: string;
      time?: string;
      zoom_link?: string;
      google_docs_link?: string;
    } = {};

    if (body.status) {
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.date) updates.date = body.date;
    if (body.time) updates.time = body.time;
    if (body.zoomLink !== undefined) updates.zoom_link = body.zoomLink;
    if (body.googleDocsLink !== undefined) updates.google_docs_link = body.googleDocsLink;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("schedules")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        class:classes (*),
        student:users (id, name, email)
      `
      )
      .single();

    if (error || !data) {
      console.error("Schedule update error:", error);
      return NextResponse.json(
        { error: "Failed to update schedule" },
        { status: 500 }
      );
    }

    return NextResponse.json(transformSchedule(data));
  } catch (error) {
    console.error("Schedule update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Schedule delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete schedule" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Schedule delete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
