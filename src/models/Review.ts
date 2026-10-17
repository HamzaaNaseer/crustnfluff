import { Schema, model, models, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String, default: "" },
    text: { type: String, required: true },
    link: { type: String, default: "" }, // the review's own Google share link
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type Review = InferSchemaType<typeof reviewSchema>;

export const ReviewModel = models.Review ?? model("Review", reviewSchema);
