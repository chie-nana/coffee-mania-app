// 1) NextResponse を使う（JSONを返すため）
 // 2) prisma を読み込む（さっきの入口ファイル）
// 3) GET関数を書く（Next.jsの決まり）
// TODO: Region一覧をDBから取ってくる
// TODO: JSONで返す

import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";

// 地域一覧APIのレスポンスの型
export type RegionsIndexResponse = {
  regions: {
    id: number
    name: string
  }[]
}

export async function GET() {
  try {
    // 地域一覧をDBから取得
    const regions = await prisma.region.findMany({
      orderBy: {
        id: 'asc'
      },
    });
    // レスポンスを返す
    return NextResponse.json<RegionsIndexResponse>({ regions }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
