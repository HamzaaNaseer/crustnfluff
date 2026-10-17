// One-off bulk import: uploads every JPG in .import-tmp/converted to
// Cloudinary's "cakes" folder and creates a matching MongoDB draft doc
// (active: false) for each. Run once, then delete .import-tmp.
import { v2 as cloudinary } from "cloudinary";
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cakeSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    productType: { type: String, default: "cake" },
    occasion: [String],
    style: [String],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    sourceFile: { type: String }, // local filename, for the tagging pass
  },
  { timestamps: true },
);
const Cake = mongoose.models.Cake ?? mongoose.model("Cake", cakeSchema);

const dir = path.join(root, ".import-tmp/converted");
const files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg)$/i.test(f));
console.log(`Found ${files.length} files to import.`);

await mongoose.connect(process.env.MONGODB_URI);

const results = [];
let i = 0;
for (const file of files) {
  i++;
  const buffer = fs.readFileSync(path.join(dir, file));
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "cakes" }, (err, res) => {
      if (err || !res) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });

  const doc = await Cake.create({
    imageUrl: uploaded.secure_url,
    cloudinaryId: uploaded.public_id,
    sourceFile: file,
    active: false,
  });

  results.push({ id: doc._id.toString(), file, imageUrl: uploaded.secure_url });
  if (i % 25 === 0 || i === files.length) console.log(`  ${i}/${files.length} uploaded`);
}

fs.writeFileSync(path.join(root, ".import-tmp/import-results.json"), JSON.stringify(results, null, 2));
console.log(`Done. ${results.length} cakes imported as drafts.`);
await mongoose.disconnect();
