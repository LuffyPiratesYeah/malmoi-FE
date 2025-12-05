import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

const CODE_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const FIXED_CODE = "1234";

async function sendEmailIfConfigured(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  // If email provider isn't configured, log the code for local testing
  if (!apiKey || !from) {
    console.info(`[email dev] Verification code for ${email}: ${code}`);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "말모이 이메일 인증코드",
        text: [
          "안녕하세요!",
          "",
          "말모이 가입을 위해 아래 인증코드를 입력해주세요.",
          "",
          `인증코드: ${code}`,
          "",
          `본 코드는 ${CODE_EXPIRY_MINUTES}분 후 만료됩니다.`,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Failed to send verification email:", body);
    }
  } catch (error) {
    console.error("Email send error:", error);
  }
}

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

    const code = FIXED_CODE;
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(now.getTime() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();

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

    // 이메일 발송은 추후 적용 예정. 현재는 코드만 반환합니다.

    return NextResponse.json({
      message: "인증 코드가 발송되었습니다. (현재 테스트용 코드 1234)",
      expiresIn: CODE_EXPIRY_MINUTES * 60,
      cooldown: RESEND_COOLDOWN_SECONDS,
      code,
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json(
      { error: "인증 코드 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
