import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { CakeModel } from "@/models/Cake";

// Body: { updates: [{ id, order }] } — order values are assigned by the
// client from the positions the dragged subset already occupied, so this
// only touches the items being reordered and never disturbs items outside
// the current filter.
export async function PATCH(req: Request) {
  const { updates } = (await req.json()) as { updates: { id: string; order: number }[] };
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  await connectToDatabase();
  await CakeModel.bulkWrite(
    updates.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    })),
  );

  revalidateTag("cakes", "max");
  return NextResponse.json({ ok: true, updated: updates.length });
}
