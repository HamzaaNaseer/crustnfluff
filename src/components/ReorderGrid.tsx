"use client";

import { useEffect, useRef, useState } from "react";
import { CakeEditPanel } from "@/components/CakeEditPanel";
import { OCCASIONS, PRODUCT_TYPES, toLabel } from "@/lib/taxonomy";

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

// Drag-and-drop reorder grid, doubling as the main photo management view —
// edit/live/delete controls live right on each thumbnail. Reordering only
// ever touches the items in the current filter — on save, the dragged-to
// positions are mapped back onto the exact `order` values that subset
// already occupied (sorted ascending), so items outside the filter never move.
export function ReorderGrid({
  cakes,
  onReorderSaved,
  onUpdateCake,
  onDeleteCake,
}: {
  cakes: AdminCake[];
  onReorderSaved: (updates: { id: string; order: number }[]) => void;
  onUpdateCake: (id: string, updates: Partial<AdminCake>) => Promise<void>;
  onDeleteCake: (id: string) => Promise<void>;
}) {
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all");
  const [occasionFilter, setOccasionFilter] = useState<string>("all");
  const [activeOnly, setActiveOnly] = useState(false);

  const [working, setWorking] = useState<AdminCake[]>([]);
  const slotsRef = useRef<number[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const [editingCake, setEditingCake] = useState<AdminCake | null>(null);

  useEffect(() => {
    const filtered = cakes
      .filter((c) => (activeOnly ? c.active : true))
      .filter((c) => productTypeFilter === "all" || c.productType === productTypeFilter)
      .filter((c) => occasionFilter === "all" || c.occasion.includes(occasionFilter))
      .sort((a, b) => a.order - b.order);
    slotsRef.current = filtered.map((c) => c.order);
    setWorking(filtered);
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakes, productTypeFilter, occasionFilter, activeOnly]);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragEnter(index: number) {
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setWorking((cur) => {
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = index;
    setDirty(true);
  }

  async function handleSaveOrder() {
    setSaving(true);
    const updates = working.map((c, i) => ({ id: c._id, order: slotsRef.current[i] }));
    await fetch("/api/admin/cakes/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
    onReorderSaved(updates);
    setSaving(false);
    setDirty(false);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={productTypeFilter}
          onChange={(e) => setProductTypeFilter(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-1.5 text-sm"
        >
          <option value="all">All types</option>
          {PRODUCT_TYPES.map((p) => (
            <option key={p} value={p}>
              {toLabel(p)}
            </option>
          ))}
        </select>
        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-1.5 text-sm"
        >
          <option value="all">All occasions</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {toLabel(o)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Live only
        </label>
        <span className="text-sm text-ink/50">{working.length} photos</span>
        <button
          onClick={handleSaveOrder}
          disabled={!dirty || saving}
          className="ml-auto rounded-full bg-cocoa px-5 py-2 text-sm font-medium text-cream disabled:opacity-40"
        >
          {saving ? "Saving…" : dirty ? "Save order" : "Order saved"}
        </button>
      </div>

      <p className="mb-3 text-xs text-ink/50">
        Drag any photo to move it anywhere. Use the icons to edit details, flip live/draft, or delete.
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {working.map((cake, i) => (
          <div
            key={cake._id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={() => (dragIndex.current = null)}
            className="group relative cursor-grab overflow-hidden rounded-xl border border-rose/20 bg-blush active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cake.imageUrl}
              alt={cake.title || "Cake"}
              draggable={false}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {i + 1}
            </span>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-linear-to-t from-black/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                title="Edit details"
                onClick={() => setEditingCake(cake)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm hover:bg-white"
              >
                ✎
              </button>
              <button
                type="button"
                title={cake.active ? "Live — click to draft" : "Draft — click to publish"}
                onClick={() => onUpdateCake(cake._id, { active: !cake.active })}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                  cake.active ? "bg-green-600 text-white" : "bg-white/90 text-ink"
                }`}
              >
                {cake.active ? "●" : "○"}
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => {
                  if (confirm("Delete this photo permanently?")) onDeleteCake(cake._id);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-red-600 hover:bg-white"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCake && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setEditingCake(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg text-cocoa">Edit photo</h3>
              <button onClick={() => setEditingCake(null)} className="text-sm text-ink/60">
                ✕
              </button>
            </div>
            <CakeEditPanel
              cake={editingCake}
              onCancel={() => setEditingCake(null)}
              onSave={async (updates) => {
                await onUpdateCake(editingCake._id, updates);
                setEditingCake(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
