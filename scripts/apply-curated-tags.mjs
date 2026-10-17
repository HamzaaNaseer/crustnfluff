// Applies the curated tagging pass onto the bulk-imported draft docs.
// Matches by sourceFile (the original filename), set by bulk-import.mjs.
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
  const [k, ...rest] = line.split("=");
  if (k && rest.length) process.env[k] = rest.join("=").trim();
}

const cakeSchema = new mongoose.Schema({}, { strict: false });
const Cake = mongoose.models.Cake ?? mongoose.model("Cake", cakeSchema);

const tags = JSON.parse(fs.readFileSync(path.join(root, "scripts/curated-tags.json"), "utf8"));

await mongoose.connect(process.env.MONGODB_URI);

let updated = 0;
let missing = 0;
for (const [sourceFile, data] of Object.entries(tags)) {
  const res = await Cake.updateOne({ sourceFile }, { $set: data });
  if (res.matchedCount === 0) {
    console.log(`  NOT FOUND: ${sourceFile}`);
    missing++;
  } else {
    updated++;
  }
}

console.log(`Updated ${updated} cakes, ${missing} not found.`);
await mongoose.disconnect();
