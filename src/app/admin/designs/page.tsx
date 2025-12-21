"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Design = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
  tags: string[] | null;
  isActive: boolean;
};

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    thumbnailUrl: "",
    category: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const palette = {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
  };

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/designs?limit=50", { cache: "no-store" });
      const json = await res.json();
      setDesigns(json.data || []);
    } catch (error) {
      console.error("Failed to load designs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        imageUrl: form.imageUrl,
        thumbnailUrl: form.thumbnailUrl || undefined,
        category: form.category || undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : undefined,
      };
      const res = await fetch("/api/designs/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Upload failed");
      setForm({
        title: "",
        description: "",
        imageUrl: "",
        thumbnailUrl: "",
        category: "",
        tags: "",
      });
      await fetchDesigns();
    } catch (error) {
      console.error("Create design failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: palette.background }}
    >
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h4
            className="text-3xl font-black"
            style={{ color: palette.primary }}
          >
            Design Manager
          </h4>
          <p style={{ color: "rgba(64, 18, 104, 0.7)" }}>
            Upload, list, and manage launch designs.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 rounded-2xl border p-6"
          style={{ borderColor: "#e0e0e0", backgroundColor: "#ffffff" }}
        >
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-4 py-3 rounded-lg border"
            style={{ borderColor: "#e0e0e0" }}
          />
          <input
            placeholder="Category (e.g. anime, tech)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-3 rounded-lg border"
            style={{ borderColor: "#e0e0e0" }}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-3 rounded-lg border md:col-span-2"
            style={{ borderColor: "#e0e0e0" }}
          />
          <input
            required
            placeholder="Image URL (Supabase Storage)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="px-4 py-3 rounded-lg border"
            style={{ borderColor: "#e0e0e0" }}
          />
          <input
            placeholder="Thumbnail URL (optional)"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            className="px-4 py-3 rounded-lg border"
            style={{ borderColor: "#e0e0e0" }}
          />
          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="px-4 py-3 rounded-lg border md:col-span-2"
            style={{ borderColor: "#e0e0e0" }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 px-6 py-3 rounded-lg font-bold transition"
            style={{
              backgroundColor: palette.primary,
              color: "#ffffff",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Save design"}
          </button>
        </form>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "#e0e0e0" }}
        >
          <div
            className="px-4 py-3 font-semibold"
            style={{
              backgroundColor: "rgba(197,163,255,0.15)",
              color: palette.primary,
            }}
          >
            Designs ({designs.length})
          </div>
          <div className="divide-y" style={{ color: palette.primary }}>
            {loading ? (
              <p className="p-4" style={{ color: palette.primary }}>
                Loading...
              </p>
            ) : designs.length === 0 ? (
              <p className="p-4" style={{ color: "rgba(64, 18, 104, 0.7)" }}>
                No designs yet.
              </p>
            ) : (
              designs.map((d) => (
                <div key={d.id} className="p-4 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden border"
                    style={{ borderColor: "#e0e0e0" }}
                  >
                    <Image
                      width={150}
                      height={150}
                      src={d.thumbnailUrl || d.imageUrl}
                      alt={d.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{d.title}</div>
                    <div
                      className="text-sm"
                      style={{ color: "rgba(64, 18, 104, 0.65)" }}
                    >
                      {d.category || "General"} ·{" "}
                      {d.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <a
                    href={`/designs/${d.id}`}
                    className="text-sm font-semibold"
                    style={{ color: palette.primary }}
                  >
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
