import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 서비스 역할 키를 사용하여 RLS 우회
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = formData.get("bucket") as string;

        if (!file) {
            return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
        }

        if (!bucket) {
            return NextResponse.json({ error: "버킷 이름이 없습니다" }, { status: 400 });
        }

        // 파일 확장자 추출
        const fileExt = file.name.split('.').pop() || '';
        
        // 안전한 파일명 생성 (타임스탬프 + 랜덤 문자열 + 확장자)
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;

        // 파일을 ArrayBuffer로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 });
        }

        // 공개 URL 생성
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
    }
}
