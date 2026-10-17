// One-off (re-runnable) migration: copies all documents from the local dev
// DB into the Atlas cluster, upserting by _id so it's safe to run again.
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
  const [k, ...rest] = line.split("=");
  if (k && rest.length && !k.startsWith("#")) process.env[k.trim()] = rest.join("=").trim();
}

const localUri = process.env.MONGODB_URI;
const atlasUri = process.env.ATLAS_MONGODB_URI;
if (!atlasUri) throw new Error("ATLAS_MONGODB_URI not set in .env.local");

const collections = ["cakes", "reviews"];

const localConn = await mongoose.createConnection(localUri).asPromise();
const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
console.log("Connected to both local and Atlas.");

for (const name of collections) {
  const localCol = localConn.db.collection(name);
  const atlasCol = atlasConn.db.collection(name);

  const docs = await localCol.find({}).toArray();
  if (docs.length === 0) {
    console.log(`${name}: 0 documents locally, skipping.`);
    continue;
  }

  const ops = docs.map((doc) => ({
    replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
  }));
  const result = await atlasCol.bulkWrite(ops);
  console.log(
    `${name}: ${docs.length} local docs -> Atlas (${result.upsertedCount} inserted, ${result.modifiedCount} updated)`,
  );
}

await localConn.close();
await atlasConn.close();
console.log("Done.");
