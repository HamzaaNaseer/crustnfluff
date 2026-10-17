import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const updates = await req.json();

  const allowed = [
    "title",
    "productType",
    "occasion",
    "style",
    "flavor",
    "weight",
    "servings",
    "price",
    "notes",
    "featured",
    "active",
    "order",
  ];
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowed.includes(key)),
  );

  await connectToDatabase();
  const cake = await CakeModel.findByIdAndUpdate(id, safeUpdates, { new: true });
  if (!cake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTag("cakes", "max");
  return NextResponse.json(cake);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectToDatabase();
  const cake = await CakeModel.findByIdAndDelete(id);
  if (!cake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await cloudinary.uploader.destroy(cake.cloudinaryId).catch(() => {});
  revalidateTag("cakes", "max");
  return NextResponse.json({ ok: true });
}
