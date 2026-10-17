import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectToDatabase();
  const cake = await CakeModel.findOne({ _id: id, active: true }).select(
    "title imageUrl productType occasion style flavor weight servings price notes featured",
  );
  if (!cake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cake);
}
