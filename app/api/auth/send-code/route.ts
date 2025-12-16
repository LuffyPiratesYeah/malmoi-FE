import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const CODE_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const supabaseAdmin = await getSupabaseAdmin();

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // Prevent sending codes to existing accounts
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 가입된 이메일입니다. 로그인해주세요." },
        { status: 409 }
      );
    }

    const now = new Date();

    // Basic cooldown to prevent spamming
    const { data: recentCode, error: recentCodeError } = await supabaseAdmin
      .from("email_verification_codes")
      .select("id, created_at, consumed")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentCodeError && recentCodeError.code !== "PGRST116") {
      console.error("Verification code fetch error:", recentCodeError);
    }

    if (recentCode && !recentCode.consumed) {
      const createdAt = new Date(recentCode.created_at);
      const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        return NextResponse.json(
          { error: `${RESEND_COOLDOWN_SECONDS - elapsedSeconds}초 뒤에 다시 시도해주세요.` },
          { status: 429 }
        );
      }
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(now.getTime() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Save to database
    const { error: insertError } = await supabaseAdmin
      .from("email_verification_codes")
      .insert({
        email: normalizedEmail,
        code_hash: codeHash,
        expires_at: expiresAt,
        consumed: false,
      });

    if (insertError) {
      console.error("Verification code insert error:", insertError);
      return NextResponse.json(
        { error: "인증 코드를 저장하지 못했습니다." },
        { status: 500 }
      );
    }

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "[말모이] 이메일 인증코드",
      html: `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>말모이 이메일 인증</title>
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
                <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">이메일 인증 코드</h2>
                <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  안녕하세요!<br>
                  말모이 서비스를 이용해 주셔서 감사합니다.<br>
                  아래 인증 코드를 입력하여 회원가입을 완료해 주세요.
                </p>

                <!-- Code Box -->
                <div style="background-color: #F3F4F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #00C2FF; display: block;">${code}</span>
                </div>

                <p style="margin: 0; font-size: 14px; color: #6B7280;">
                  인증 코드는 <strong style="color: #EF4444;">${CODE_EXPIRY_MINUTES}분</strong> 후 만료됩니다.<br>
                  본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.
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
          cid: 'logo' // same cid value as in the html img src
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "인증 코드가 발송되었습니다.",
      expiresIn: CODE_EXPIRY_MINUTES * 60,
      cooldown: RESEND_COOLDOWN_SECONDS,
    });

  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json(
      { error: "인증 코드 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
