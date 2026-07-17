import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export type FlavorsIndexResponse = {
  flavorCategories: {
    id: number;
    name: string;
    flavors: {
      id: number;
      flavorCategoryId: number;
      name: string;
    }[];
  }[];
};

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const flavorCategories = await prisma.flavorCategory.findMany({
      include: {
        flavors: {
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json<FlavorsIndexResponse>(
      { flavorCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "フレーバー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
