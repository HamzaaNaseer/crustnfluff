import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const updates = await req.json();

  const allowed = ["name", "area", "text", "link", "active", "order"];
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowed.includes(key)),
  );

  await connectToDatabase();
  const review = await ReviewModel.findByIdAndUpdate(id, safeUpdates, { new: true });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTag("reviews", "max");
  return NextResponse.json(review);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectToDatabase();
  const review = await ReviewModel.findByIdAndDelete(id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTag("reviews", "max");
  return NextResponse.json({ ok: true });
}
