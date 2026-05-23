import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

// 地域一覧APIのレスポンスの型
export type RegionsIndexResponse = {
  regions: {
    id: number;
    name: string;
  }[];
};

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const regions = await prisma.region.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json<RegionsIndexResponse>({ regions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "地域一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
