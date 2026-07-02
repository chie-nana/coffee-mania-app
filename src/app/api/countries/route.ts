import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

// 国一覧APIのレスポンスの型
export type CountriesIndexResponse = {
  countries: {
    id: number;
    regionId: number;
    name: string;
  }[];
};

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  const regionId = request.nextUrl.searchParams.get("regionId");
  if (!regionId) {
    return NextResponse.json(
      {
        message: "regionIdが必要です"
      },
      { status: 400 }
    );
  }

  const regionIdNumber = Number(regionId);
  if (Number.isNaN(regionIdNumber)) {
    return NextResponse.json(
      { message: "regionIdは数値で指定してください" },
      { status: 400 }
    );
  }
  try {
    const countries = await prisma.country.findMany({
      where: {
        regionId: regionIdNumber,
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json({ countries }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "国一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
