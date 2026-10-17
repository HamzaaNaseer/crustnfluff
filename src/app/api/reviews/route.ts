import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

export async function GET() {
  await connectToDatabase();
  const reviews = await ReviewModel.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .select("name area text link");
  return NextResponse.json(reviews);
}
