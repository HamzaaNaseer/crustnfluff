"use client";

import { useState } from "react";
import { OCCASIONS, STYLES, toLabel } from "@/lib/taxonomy";

type AdminCake = {
  _id: string;
  title: string;
  occasion: string[];
  style: string[];
  flavor?: string;
  weight?: string;
  servings?: string;
  price?: string;
  notes?: string;
};

export function CakeEditPanel({
  cake,
  onSave,
  onCancel,
}: {
  cake: AdminCake;
  onSave: (updates: Partial<AdminCake>) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(cake.title);
  const [occasion, setOccasion] = useState<string[]>(cake.occasion);
  const [style, setStyle] = useState<string[]>(cake.style);
  const [flavor, setFlavor] = useState(cake.flavor ?? "");
  const [weight, setWeight] = useState(cake.weight ?? "");
  const [servings, setServings] = useState(cake.servings ?? "");
  const [price, setPrice] = useState(cake.price ?? "");
  const [notes, setNotes] = useState(cake.notes ?? "");
  const [saving, setSaving] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ title, occasion, style, flavor, weight, servings, price, notes });
    setSaving(false);
  }

  return (
    <div className="space-y-4 rounded-xl border border-rose/30 bg-blush/30 p-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <input
          type="text"
          placeholder="Flavour (e.g. Chocolate)"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Weight (e.g. 2 lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Servings (e.g. 15-20)"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Price (e.g. Rs 3,500)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-rose/30 px-3 py-2 text-sm"
        />
      </div>

      <textarea
        placeholder="Extra notes shown to customers (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-rose/30 px-3 py-2 text-sm"
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cocoa/70">Occasion</p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggle(occasion, setOccasion, o)}
              className={`rounded-full px-3 py-1.5 text-xs ${
                occasion.includes(o) ? "bg-cocoa text-cream" : "border border-rose/40"
              }`}
            >
              {toLabel(o)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cocoa/70">Style</p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(style, setStyle, s)}
              className={`rounded-full px-3 py-1.5 text-xs ${
                style.includes(s) ? "bg-cocoa text-cream" : "border border-rose/40"
              }`}
            >
              {toLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-cocoa px-5 py-2 text-sm font-medium text-cream disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="rounded-full border border-rose/40 px-5 py-2 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
