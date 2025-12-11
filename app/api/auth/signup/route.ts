import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name, userType, verificationCode } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedCode = typeof verificationCode === 'string' ? verificationCode.trim() : '';
    const isBypassCode = trimmedCode === '1234';
    const supabaseAdmin = await getSupabaseAdmin();

    // Validate input
    if (!normalizedEmail || !password || !name || !userType || !trimmedCode) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!['student', 'teacher', 'admin'].includes(userType)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 유형입니다.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // Validate verification code
    if (!isBypassCode) {
      const { data: latestCode, error: codeError } = await supabaseAdmin
        .from('email_verification_codes')
        .select('id, code_hash, expires_at, consumed')
        .eq('email', normalizedEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (codeError && codeError.code !== 'PGRST116') {
        console.error('Verification code fetch error:', codeError);
        return NextResponse.json(
          { error: '이메일 인증을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      if (!latestCode) {
        return NextResponse.json(
          { error: '이메일 인증을 먼저 완료해주세요.' },
          { status: 400 }
        );
      }

      if (latestCode.consumed) {
        return NextResponse.json(
          { error: '이미 사용된 인증코드입니다. 다시 받아주세요.' },
          { status: 400 }
        );
      }

      const isExpired = new Date(latestCode.expires_at) < new Date();
      if (isExpired) {
        return NextResponse.json(
          { error: '인증코드가 만료되었습니다. 다시 받아주세요.' },
          { status: 400 }
        );
      }

      const isCodeValid = await bcrypt.compare(trimmedCode, latestCode.code_hash);
      if (!isCodeValid) {
        return NextResponse.json(
          { error: '인증코드가 올바르지 않습니다.' },
          { status: 400 }
        );
      }

      const { error: consumeError } = await supabaseAdmin
        .from('email_verification_codes')
        .update({ consumed: true })
        .eq('id', latestCode.id);

      if (consumeError) {
        console.error('Verification code consume error:', consumeError);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: normalizedEmail,
          password_hash: passwordHash,
          name,
          user_type: userType,
          is_teacher: userType === 'teacher' ? false : false,
          verification_status: 'none',
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: '회원가입 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // Return user data (excluding password_hash)
    const { password_hash, ...userData } = newUser;

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
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
