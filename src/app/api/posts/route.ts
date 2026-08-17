import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

type CreatePostRequestBody = {
  title?: string;
  recordType?: "SIMPLE" | "DETAIL";
  memo?: string;
};

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      supabaseId: data.user.id,
    },
  });
  if (!user) {
    return NextResponse.json(
      { message: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  const body = (await request.json()) as CreatePostRequestBody;
  const title = body.title?.trim();
  const recordType = body.recordType;

  if (!title) {
    return NextResponse.json(
      { message: "titleが必要です" },
      { status: 400 }
    );
  }

  if (recordType !== "SIMPLE" && recordType !== "DETAIL") {
    return NextResponse.json(
      { message: "recordTypeはSIMPLEまたはDETAILで指定してください" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      userId: user.id,
      title,
      recordType,
      memo: body.memo,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
