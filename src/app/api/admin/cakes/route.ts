import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

export async function GET() {
  await connectToDatabase();
  const cakes = await CakeModel.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(cakes);
}

function uploadToCloudinary(buffer: Buffer): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cakes" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadToCloudinary(buffer);

  await connectToDatabase();
  const cake = await CakeModel.create({
    title: formData.get("title") ?? "",
    imageUrl: uploaded.secure_url,
    cloudinaryId: uploaded.public_id,
    productType: formData.get("productType") ?? "cake",
    occasion: formData.getAll("occasion"),
    style: formData.getAll("style"),
    active: false,
  });

  return NextResponse.json(cake, { status: 201 });
}
