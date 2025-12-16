import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabaseAdmin = await getSupabaseAdmin();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Find user by email (using username as email)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Return user data (excluding password_hash)
    const { password_hash, ...userData } = user;

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        userType: userData.user_type,
        isTeacher: userData.is_teacher,
        profileImage: userData.profile_image,
        verificationStatus: userData.verification_status,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
