import { NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

async function getCakeById(id: string) {
  "use cache";
  cacheTag("cakes");
  cacheLife({ revalidate: 86400, expire: 86400 * 7 });

  await connectToDatabase();
  const cake = await CakeModel.findOne({ _id: id, active: true }).select(
    "title imageUrl productType occasion style flavor weight servings price notes featured",
  );
  return cake;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cake = await getCakeById(id);
  if (!cake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cake);
}
