import { NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

const PRODUCT_TYPE_BY_SLUG: Record<string, string> = {
  cakes: "cake",
  brownies: "brownie",
  cupcakes: "cupcake",
};

const PAGE_SIZE = 24;

// Cached per unique (productType, occasion, page, limit) combo — tagged
// "cakes" so any admin write invalidates every cached variant at once.
async function getCakesPage(productTypeSlug: string | null, occasion: string | null, page: number, limit: number) {
  "use cache";
  cacheTag("cakes");
  cacheLife({ revalidate: 86400, expire: 86400 * 7 });

  await connectToDatabase();

  const filter: Record<string, unknown> = { active: true };
  if (productTypeSlug && PRODUCT_TYPE_BY_SLUG[productTypeSlug]) {
    filter.productType = PRODUCT_TYPE_BY_SLUG[productTypeSlug];
  }
  if (occasion) {
    filter.occasion = occasion;
  }

  const [cakes, total, occasionsRaw] = await Promise.all([
    CakeModel.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .select("title imageUrl productType occasion style flavor weight servings price notes featured"),
    CakeModel.countDocuments(filter),
    page === 0 ? CakeModel.distinct("occasion", { active: true }) : Promise.resolve(null),
  ]);

  return {
    cakes,
    total,
    hasMore: (page + 1) * limit < total,
    ...(occasionsRaw ? { availableOccasions: occasionsRaw } : {}),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productTypeSlug = searchParams.get("productType");
  const occasion = searchParams.get("occasion");
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const limit = Math.min(60, Number(searchParams.get("limit") ?? PAGE_SIZE));

  const data = await getCakesPage(productTypeSlug, occasion, page, limit);
  return NextResponse.json(data);
}
