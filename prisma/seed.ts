import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("@/app/_libs/prisma");

  console.log("seed start");

  await prisma.region.createMany({
    data: [
      { name: "アフリカ" },
      { name: "中米" },
      { name: "南米" },
      { name: "アジア" },
    ],
    skipDuplicates: true,
  });
  const region = await prisma.region.findMany();

  const africa = region.find((region) => region.name === "アフリカ");
  const centralAmerica = region.find((region) => region.name === "中米");
  const southAmerica = region.find((region) => region.name === "南米");
  const asia = region.find((region) => region.name === "アジア");

  if (!africa || !centralAmerica || !southAmerica || !asia) {
    throw new Error("必要な地域データが見つかりません");
  }

  await prisma.country.createMany({
    data: [
      { name: "エチオピア", regionId: africa.id },
      { name: "ケニア", regionId: africa.id },
      { name: "ルワンダ", regionId: africa.id },
      { name: "タンザニア", regionId: africa.id },
      { name: "イエメン", regionId: africa.id },
      { name: "コンゴ共和国", regionId: africa.id },

      { name: "グアテマラ", regionId: centralAmerica.id },
      { name: "コスタリカ", regionId: centralAmerica.id },
      { name: "ホンジュラス", regionId: centralAmerica.id },
      { name: "パナマ", regionId: centralAmerica.id },

      { name: "ブラジル", regionId: southAmerica.id },
      { name: "コロンビア", regionId: southAmerica.id },
      { name: "ペルー", regionId: southAmerica.id },
      { name: "ボリビア", regionId: southAmerica.id },

      { name: "インドネシア", regionId: asia.id },
      { name: "パプアニューギニア", regionId: asia.id },
      { name: "イーストティモール", regionId: asia.id },
      { name: "インド", regionId: asia.id },
      { name: "中国", regionId: asia.id },
      { name: "ベトナム", regionId: asia.id },
      { name: "タイ", regionId: asia.id },
    ],
    skipDuplicates: true,
  });

  const citrusCategory = await findOrCreateFlavorCategory("シトラス");
  const floralCategory = await findOrCreateFlavorCategory("フローラル");
  const berryCategory = await findOrCreateFlavorCategory("ベリー");
  const tropicalCategory = await findOrCreateFlavorCategory("トロピカル");
  const nuttyCategory = await findOrCreateFlavorCategory("ナッツ");
  const chocolateCategory = await findOrCreateFlavorCategory("カカオ・チョコ");
  const caramelCategory = await findOrCreateFlavorCategory("キャラメル・シュガー");
  const spiceCategory = await findOrCreateFlavorCategory("スパイス");
  const herbalCategory = await findOrCreateFlavorCategory("ハーバル・グリーン");
  const roastedCategory = await findOrCreateFlavorCategory("ロースト・スモーキー");

  await createFlavorIfNotExists(citrusCategory.id, [
    "レモン",
    "ライム",
    "オレンジ",
    "グレープフルーツ",
  ]);
  await createFlavorIfNotExists(floralCategory.id, [
    "ジャスミン",
    "ラベンダー",
    "ローズ",
  ]);
  await createFlavorIfNotExists(berryCategory.id, [
    "ラズベリー",
    "ブルーベリー",
    "ストロベリー",
    "ブラックベリー",
  ]);
  await createFlavorIfNotExists(tropicalCategory.id, [
    "パイナップル",
    "マンゴー",
    "パパイヤ",
    "パッションフルーツ",
    "ピーチ",
  ]);
  await createFlavorIfNotExists(nuttyCategory.id, [
    "アーモンド",
    "ヘーゼルナッツ",
    "ピーナッツ",
  ]);
  await createFlavorIfNotExists(chocolateCategory.id, [
    "カカオニブ",
    "ミルクチョコ",
    "ダークチョコ",
    "ココア",
  ]);
  await createFlavorIfNotExists(caramelCategory.id, [
    "キャラメル",
    "ブラウンシュガー",
    "メープル",
    "ハニー",
  ]);
  await createFlavorIfNotExists(spiceCategory.id, [
    "シナモン",
    "クローブ",
    "ジンジャー",
  ]);
  await createFlavorIfNotExists(herbalCategory.id, [
    "ミント",
    "ハーブティー",
    "緑茶",
    "セージ",
  ]);
  await createFlavorIfNotExists(roastedCategory.id, [
    "ローストナッツ",
    "スモーク",
    "トースト",
  ]);

  async function findOrCreateFlavorCategory(name: string) {
    const flavorCategory = await prisma.flavorCategory.findFirst({
      where: { name },
    });

    if (flavorCategory) {
      return flavorCategory;
    }

    return prisma.flavorCategory.create({
      data: { name },
    });
  }

  async function createFlavorIfNotExists(
    flavorCategoryId: number,
    names: string[]
  ) {
    for (const name of names) {
      const flavor = await prisma.flavor.findFirst({
        where: {
          flavorCategoryId,
          name,
        },
      });

      if (!flavor) {
        await prisma.flavor.create({
          data: {
            flavorCategoryId,
            name,
          },
        });
      }
    }
  }
}

main()
  .then(() => {
    console.log("seed end");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
