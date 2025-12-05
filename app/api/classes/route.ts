import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data: classes, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching classes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const transformedClasses = classes.map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      level: cls.level,
      type: cls.type,
      category: cls.category,
      image: cls.image,
      tutorId: cls.tutor_id,
      tutorName: cls.tutor_name,
      details: cls.details,
    }));

    return NextResponse.json(transformedClasses);
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
    const { title, description, level, type, category, image, tutorId, tutorName, details } = body;

    // Validate required fields
    if (!title || !description || !level || !type || !category || !image || !tutorId || !tutorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure tutor is verified
    const { data: tutor, error: tutorError } = await supabaseAdmin
      .from('users')
      .select('id, is_teacher, verification_status')
      .eq('id', tutorId)
      .single();

    if (tutorError || !tutor) {
      return NextResponse.json(
        { error: '튜터 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (!tutor.is_teacher || tutor.verification_status !== 'verified') {
      return NextResponse.json(
        { error: '튜터 인증 완료 후 수업을 등록할 수 있습니다.' },
        { status: 403 }
      );
    }

    // Insert new class
    const { data: newClass, error } = await supabaseAdmin
      .from('classes')
      .insert([
        {
          title,
          description,
          level,
          type,
          category,
          image,
          tutor_id: tutorId,
          tutor_name: tutorName,
          details: details || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      return NextResponse.json(
        { error: 'Failed to create class' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedClass = {
      id: newClass.id,
      title: newClass.title,
      description: newClass.description,
      level: newClass.level,
      type: newClass.type,
      category: newClass.category,
      image: newClass.image,
      tutorId: newClass.tutor_id,
      tutorName: newClass.tutor_name,
      details: newClass.details,
    };

    return NextResponse.json(transformedClass, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
