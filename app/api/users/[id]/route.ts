import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabaseAdmin = await getSupabaseAdmin();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, user_type, is_teacher, profile_image, verification_status')
      .eq('id', id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform to camelCase
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      isTeacher: user.is_teacher,
      profileImage: user.profile_image,
      verificationStatus: user.verification_status,
    };

    return NextResponse.json(transformedUser);
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

    // Transform camelCase to snake_case for database
    const updateData: {
      name?: string;
      profile_image?: string | null;
      verification_status?: string;
      is_teacher?: boolean;
      user_type?: string;
    } = {};
    if (body.name) updateData.name = body.name;
    if (body.profileImage !== undefined) updateData.profile_image = body.profileImage;
    if (body.verificationStatus) updateData.verification_status = body.verificationStatus;
    if (typeof body.isTeacher === "boolean") updateData.is_teacher = body.isTeacher;
    if (body.userType && ["student", "teacher"].includes(body.userType)) {
      updateData.user_type = body.userType;
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, user_type, is_teacher, profile_image, verification_status')
      .single();

    if (error || !updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      userType: updatedUser.user_type,
      isTeacher: updatedUser.is_teacher,
      profileImage: updatedUser.profile_image,
      verificationStatus: updatedUser.verification_status,
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
