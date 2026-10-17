"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReorderGrid } from "@/components/ReorderGrid";
import { OCCASIONS, PRODUCT_TYPES, STYLES, toLabel } from "@/lib/taxonomy";

type AdminCake = {
  _id: string;
  title: string;
  imageUrl: string;
  productType: string;
  occasion: string[];
  style: string[];
  flavor?: string;
  weight?: string;
  servings?: string;
  price?: string;
  notes?: string;
  active: boolean;
  order: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [cakes, setCakes] = useState<AdminCake[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [productType, setProductType] = useState<string>("cake");
  const [occasion, setOccasion] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  async function loadCakes() {
    setLoading(true);
    const res = await fetch("/api/admin/cakes");
    setCakes(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadCakes();
  }, []);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("image", file);
    formData.set("title", title);
    formData.set("productType", productType);
    occasion.forEach((o) => formData.append("occasion", o));
    style.forEach((s) => formData.append("style", s));

    await fetch("/api/admin/cakes", { method: "POST", body: formData });

    setTitle("");
    setProductType("cake");
    setOccasion([]);
    setStyle([]);
    setFile(null);
    (e.target as HTMLFormElement).reset();
    setUploading(false);
    loadCakes();
  }

  async function updateCake(id: string, updates: Partial<AdminCake>) {
    setCakes((cur) => cur.map((c) => (c._id === id ? { ...c, ...updates } : c)));
    await fetch(`/api/admin/cakes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteCake(id: string) {
    setCakes((cur) => cur.filter((c) => c._id !== id));
    await fetch(`/api/admin/cakes/${id}`, { method: "DELETE" });
  }

  function handleReorderSaved(updates: { id: string; order: number }[]) {
    const orderById = new Map(updates.map((u) => [u.id, u.order]));
    setCakes((cur) => cur.map((c) => (orderById.has(c._id) ? { ...c, order: orderById.get(c._id)! } : c)));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa">Gallery admin</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/reviews" className="text-sm text-cocoa underline">
            Manage reviews
          </Link>
          <button onClick={handleLogout} className="text-sm text-ink/60 underline">
            Sign out
          </button>
        </div>
      </div>

      <form
        onSubmit={handleUpload}
        className="mb-12 space-y-4 rounded-2xl border border-rose/30 p-6"
      >
        <h2 className="font-display text-xl text-cocoa">Upload a photo</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="block text-sm"
        />
        <input
          type="text"
          placeholder="Title (optional, e.g. Tissot Watch Cake)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Product type
          </p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProductType(p)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  productType === p ? "bg-cocoa text-cream" : "border border-rose/40"
                }`}
              >
                {toLabel(p)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Occasion
          </p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggle(occasion, setOccasion, o)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  occasion.includes(o) ? "bg-cocoa text-cream" : "border border-rose/40"
                }`}
              >
                {toLabel(o)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Style
          </p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(style, setStyle, s)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  style.includes(s) ? "bg-cocoa text-cream" : "border border-rose/40"
                }`}
              >
                {toLabel(s)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="rounded-full bg-cocoa px-6 py-3 text-sm font-medium text-cream disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>

      <h2 className="mb-4 font-display text-xl text-cocoa">
        All photos {loading ? "" : `(${cakes.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-ink/60">Loading…</p>
      ) : (
        <ReorderGrid
          cakes={cakes}
          onReorderSaved={handleReorderSaved}
          onUpdateCake={updateCake}
          onDeleteCake={deleteCake}
        />
      )}
    </main>
  );
}
