import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.json(
    { message: "ログインユーザーを確認できました", user: user },
    { status: 200 }
  );
}
