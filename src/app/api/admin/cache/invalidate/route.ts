import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Manual safety-net button — every write already auto-invalidates its own
// tag, this exists for peace of mind / edge cases (e.g. a direct DB edit).
export async function POST() {
  revalidateTag("cakes", "max");
  revalidateTag("reviews", "max");
  return NextResponse.json({ ok: true });
}
