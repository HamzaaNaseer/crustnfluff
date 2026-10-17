import { Schema, model, models, type InferSchemaType } from "mongoose";
import { OCCASIONS, PRODUCT_TYPES, STYLES } from "@/lib/taxonomy";

const cakeSchema = new Schema(
  {
    title: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    productType: { type: String, enum: PRODUCT_TYPES, default: "cake" },
    occasion: [{ type: String, enum: OCCASIONS }],
    style: [{ type: String, enum: STYLES }],
    // Free-text display details — shown to customers on the cake's detail view.
    flavor: { type: String, default: "" },
    weight: { type: String, default: "" },
    servings: { type: String, default: "" },
    price: { type: String, default: "" },
    notes: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type Cake = InferSchemaType<typeof cakeSchema>;

export const CakeModel = models.Cake ?? model("Cake", cakeSchema);
