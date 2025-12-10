import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabaseAdmin = await getSupabaseAdmin();

    const { data: classItem, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Transform to camelCase
    const transformedClass = {
      id: classItem.id,
      title: classItem.title,
      description: classItem.description,
      level: classItem.level,
      type: classItem.type,
      category: classItem.category,
      image: classItem.image,
      tutorId: classItem.tutor_id,
      tutorName: classItem.tutor_name,
      details: classItem.details,
    };

    return NextResponse.json(transformedClass);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabaseAdmin = await getSupabaseAdmin();

    // Ensure class exists and tutor is verified
    const { data: existingClass, error: classError } = await supabaseAdmin
      .from('classes')
      .select('tutor_id')
      .eq('id', id)
      .single();

    if (classError || !existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    const { data: tutor } = await supabaseAdmin
      .from('users')
      .select('is_teacher, verification_status')
      .eq('id', existingClass.tutor_id)
      .single();

    if (!tutor?.is_teacher || tutor.verification_status !== 'verified') {
      return NextResponse.json(
        { error: '튜터 인증 완료 후에만 수업을 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // Transform camelCase to snake_case for database
    const updateData: {
      title?: string;
      description?: string;
      level?: string;
      type?: string;
      category?: string;
      image?: string;
      details?: unknown;
    } = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.level) updateData.level = body.level;
    if (body.type) updateData.type = body.type;
    if (body.category) updateData.category = body.category;
    if (body.image) updateData.image = body.image;
    if (body.details) updateData.details = body.details;

    const { data: updatedClass, error } = await supabaseAdmin
      .from('classes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedClass) {
      return NextResponse.json(
        { error: 'Failed to update class' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedClass = {
      id: updatedClass.id,
      title: updatedClass.title,
      description: updatedClass.description,
      level: updatedClass.level,
      type: updatedClass.type,
      category: updatedClass.category,
      image: updatedClass.image,
      tutorId: updatedClass.tutor_id,
      tutorName: updatedClass.tutor_name,
      details: updatedClass.details,
    };

    return NextResponse.json(transformedClass);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const { data: existingClass, error: classError } = await supabaseAdmin
      .from('classes')
      .select('tutor_id')
      .eq('id', id)
      .single();

    if (classError || !existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    const { data: tutor } = await supabaseAdmin
      .from('users')
      .select('is_teacher, verification_status')
      .eq('id', existingClass.tutor_id)
      .single();

    if (!tutor?.is_teacher || tutor.verification_status !== 'verified') {
      return NextResponse.json(
        { error: '튜터 인증 완료 후에만 수업을 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    const { error } = await supabaseAdmin
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete class' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
