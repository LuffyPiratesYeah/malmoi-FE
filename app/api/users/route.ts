import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verificationStatus = searchParams.get('verificationStatus');
  const userType = searchParams.get('userType');

  try {
    const supabaseAdmin = await getSupabaseAdmin();
    let query = supabaseAdmin
      .from('users')
      .select('id, email, name, user_type, is_teacher, profile_image, verification_status, certification_doc_url, id_doc_url')
      .order('created_at', { ascending: false });

    if (verificationStatus) {
      query = query.eq('verification_status', verificationStatus);
    }

    if (userType) {
      query = query.eq('user_type', userType);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const transformed = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      isTeacher: user.is_teacher,
      profileImage: user.profile_image,
      verificationStatus: user.verification_status,
      certificationDocUrl: user.certification_doc_url,
      idDocUrl: user.id_doc_url,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
