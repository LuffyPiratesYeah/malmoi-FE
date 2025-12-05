import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');

    let query = supabaseAdmin
      .from('schedules')
      .select(`
        *,
        class:classes (*),
        student:users (id, name, email)
      `)
      .order('date', { ascending: true });

    if (classId) {
      query = query.eq('class_id', classId);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data: schedules, error } = await query;

    if (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schedules' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      classId: schedule.class_id,
      date: schedule.date,
      time: schedule.time,
      status: schedule.status,
      studentId: schedule.student_id,
      studentName: schedule.student?.name ?? "",
      studentEmail: schedule.student?.email ?? "",
      class: schedule.class ? {
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
      } : null,
    }));

    return NextResponse.json(transformedSchedules);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, date, time, studentId } = body;

    // Validate required fields
    if (!classId || !date || !time || !studentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if class exists
    const { data: classItem, error: classError } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError || !classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Insert new schedule
    const { data: newSchedule, error } = await supabaseAdmin
      .from('schedules')
      .insert([
        {
          class_id: classId,
          date,
          time,
          student_id: studentId,
          status: 'scheduled',
        }
      ])
      .select(`
        *,
        class:classes (*),
        student:users (id, name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating schedule:', error);
      return NextResponse.json(
        { error: 'Failed to create schedule' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedSchedule = {
      id: newSchedule.id,
      classId: newSchedule.class_id,
      date: newSchedule.date,
      time: newSchedule.time,
      status: newSchedule.status,
      studentId: newSchedule.student_id,
      studentName: newSchedule.student?.name ?? "",
      studentEmail: newSchedule.student?.email ?? "",
      class: {
        id: newSchedule.class.id,
        title: newSchedule.class.title,
        description: newSchedule.class.description,
        level: newSchedule.class.level,
        type: newSchedule.class.type,
        category: newSchedule.class.category,
        image: newSchedule.class.image,
        tutorId: newSchedule.class.tutor_id,
        tutorName: newSchedule.class.tutor_name,
        details: newSchedule.class.details,
      },
    };

    return NextResponse.json(transformedSchedule, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
