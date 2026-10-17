import { NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

async function getActiveReviews() {
  "use cache";
  cacheTag("reviews");
  cacheLife({ revalidate: 86400, expire: 86400 * 7 });

  await connectToDatabase();
  const reviews = await ReviewModel.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .select("name area text link");
  return reviews;
}

export async function GET() {
  const reviews = await getActiveReviews();
  return NextResponse.json(reviews);
}
