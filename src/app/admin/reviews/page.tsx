"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminReview = {
  _id: string;
  name: string;
  area: string;
  text: string;
  link: string;
  active: boolean;
  order: number;
};

const emptyDraft = { name: "", area: "", text: "", link: "" };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  async function loadReviews() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name || !draft.text) return;
    setAdding(true);
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(emptyDraft);
    setAdding(false);
    loadReviews();
  }

  async function updateReview(id: string, updates: Partial<AdminReview>) {
    setReviews((cur) => cur.map((r) => (r._id === id ? { ...r, ...updates } : r)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    setReviews((cur) => cur.filter((r) => r._id !== id));
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= reviews.length) return;
    const reordered = [...reviews];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setReviews(reordered);
    await Promise.all(
      reordered.map((r, i) =>
        fetch(`/api/admin/reviews/${r._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        }),
      ),
    );
  }

  function startEdit(r: AdminReview) {
    setEditingId(r._id);
    setEditDraft({ name: r.name, area: r.area, text: r.text, link: r.link });
  }

  async function saveEdit(id: string) {
    await updateReview(id, editDraft);
    setEditingId(null);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa">Reviews admin</h1>
        <Link href="/admin" className="text-sm text-ink/60 underline">
          Back to gallery admin
        </Link>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-10 space-y-3 rounded-2xl border border-rose/30 p-6"
      >
        <h2 className="font-display text-xl text-cocoa">Add a review</h2>
        <input
          type="text"
          placeholder="Reviewer name"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Area (optional, e.g. B-17 Islamabad)"
          value={draft.area}
          onChange={(e) => setDraft((d) => ({ ...d, area: e.target.value }))}
          className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Review text (paste exactly as written on Google)"
          value={draft.text}
          onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <input
          type="url"
          placeholder="Google review share link (optional but recommended)"
          value={draft.link}
          onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
          className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={adding || !draft.name || !draft.text}
          className="rounded-full bg-cocoa px-6 py-2.5 text-sm font-medium text-cream disabled:opacity-60"
        >
          {adding ? "Adding…" : "Add review"}
        </button>
      </form>

      <h2 className="mb-4 font-display text-xl text-cocoa">
        All reviews {loading ? "" : `(${reviews.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-ink/60">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink/60">No reviews yet — add one above.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r, i) =>
            editingId === r._id ? (
              <li key={r._id} className="space-y-3 rounded-xl border border-rose/30 bg-blush/30 p-4">
                <input
                  type="text"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
                  placeholder="Reviewer name"
                />
                <input
                  type="text"
                  value={editDraft.area}
                  onChange={(e) => setEditDraft((d) => ({ ...d, area: e.target.value }))}
                  className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
                  placeholder="Area"
                />
                <textarea
                  value={editDraft.text}
                  onChange={(e) => setEditDraft((d) => ({ ...d, text: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
                  placeholder="Review text"
                />
                <input
                  type="url"
                  value={editDraft.link}
                  onChange={(e) => setEditDraft((d) => ({ ...d, link: e.target.value }))}
                  className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
                  placeholder="Google review share link"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(r._id)}
                    className="rounded-full bg-cocoa px-5 py-2 text-sm font-medium text-cream"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-full border border-rose/40 px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li
                key={r._id}
                className="flex flex-col gap-3 rounded-xl border border-rose/20 p-4 sm:flex-row sm:items-start"
              >
                <div className="flex-1">
                  <p className="text-sm text-ink/80">“{r.text}”</p>
                  <p className="mt-2 text-sm font-medium text-cocoa">
                    {r.name}
                    {r.area && <span className="font-normal text-ink/50"> · {r.area}</span>}
                  </p>
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-cocoa underline underline-offset-4"
                    >
                      Google link ↗
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-full border border-rose/40 px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === reviews.length - 1}
                    className="rounded-full border border-rose/40 px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => startEdit(r)}
                    className="rounded-full border border-rose/40 px-3 py-1.5 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateReview(r._id, { active: !r.active })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      r.active ? "bg-green-600 text-white" : "border border-rose/40"
                    }`}
                  >
                    {r.active ? "Live" : "Hidden"}
                  </button>
                  <button
                    onClick={() => deleteReview(r._id)}
                    className="rounded-full border border-red-300 px-3 py-1.5 text-xs text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
