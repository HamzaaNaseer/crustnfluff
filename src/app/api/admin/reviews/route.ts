import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

export async function GET() {
  await connectToDatabase();
  const reviews = await ReviewModel.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();
  const count = await ReviewModel.countDocuments();
  const review = await ReviewModel.create({
    name: body.name ?? "",
    area: body.area ?? "",
    text: body.text ?? "",
    link: body.link ?? "",
    active: true,
    order: count,
  });
  return NextResponse.json(review, { status: 201 });
}
