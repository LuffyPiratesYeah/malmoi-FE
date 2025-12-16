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
      .select('id, email, name, user_type, is_teacher, profile_image, verification_status, certification_doc_url, id_doc_url')
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
      certificationDocUrl: user.certification_doc_url,
      idDocUrl: user.id_doc_url,
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
      certification_doc_url?: string;
      id_doc_url?: string;
    } = {};
    if (body.name) updateData.name = body.name;
    if (body.profileImage !== undefined) updateData.profile_image = body.profileImage;
    if (body.verificationStatus) updateData.verification_status = body.verificationStatus;
    if (typeof body.isTeacher === "boolean") updateData.is_teacher = body.isTeacher;
    if (body.userType && ["student", "teacher"].includes(body.userType)) {
      updateData.user_type = body.userType;
    }
    if (body.certificationDocUrl) updateData.certification_doc_url = body.certificationDocUrl;
    if (body.idDocUrl) updateData.id_doc_url = body.idDocUrl;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, user_type, is_teacher, profile_image, verification_status, certification_doc_url, id_doc_url')
      .single();

    if (error || !updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Send email notification if verification is approved
    if (body.verificationStatus === 'verified' && updatedUser.email) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: updatedUser.email,
          subject: "[말모이] 튜터 인증이 승인되었습니다! 🎉",
          html: `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>말모이 튜터 인증 승인</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #ffffff;">
                    <img src="cid:logo" alt="Malmoi" style="width: 120px; height: auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px 40px 40px; text-align: center;">
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">튜터 인증이 승인되었습니다!</h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                      안녕하세요, ${updatedUser.name} 선생님!<br>
                      말모이 튜터 인증이 성공적으로 완료되었습니다.<br>
                      이제 수업을 개설하고 학생들을 만나보세요!
                    </p>

                    <!-- Important Notice -->
                    <div style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 8px; padding: 16px; margin-bottom: 32px; text-align: left;">
                      <p style="margin: 0; font-size: 14px; color: #9A3412; font-weight: 600; text-align: center;">
                        ⚠️ 권한 적용을 위해 반드시 로그아웃 후 다시 로그인해주세요.
                      </p>
                    </div>

                    <!-- Action Button -->
                    <div style="margin-bottom: 32px;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/manage-classes" style="display: inline-block; background-color: #00C2FF; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">수업 관리하러 가기</a>
                    </div>

                    <p style="margin: 0; font-size: 14px; color: #6B7280;">
                      멋진 수업을 기대하겠습니다.<br>
                      문의사항이 있으시면 언제든 연락주세요.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 32px 40px; background-color: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      © 2025 Malmoi. All rights reserved.<br>
                      본 메일은 발신 전용이며 회신되지 않습니다.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: 'logo.png',
              path: process.cwd() + '/public/logo.png',
              cid: 'logo'
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${updatedUser.email}`);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the request if email fails, just log it
      }
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
      certificationDocUrl: updatedUser.certification_doc_url,
      idDocUrl: updatedUser.id_doc_url,
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
