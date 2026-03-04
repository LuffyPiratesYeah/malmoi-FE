import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_BUCKETS = new Set(["image", "pdf"]);

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") || "");
    const userId = String(formData.get("userId") || "anonymous");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: "지원하지 않는 버킷입니다." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const safeName = sanitizeFileName(file.name);
    const path = `teacher-verification/${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}-${safeName}`;

    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (error) {
      console.error("Failed to upload file", error);
      return NextResponse.json({ error: "파일 업로드에 실패했습니다." }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload API error", error);
    return NextResponse.json({ error: "업로드 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
