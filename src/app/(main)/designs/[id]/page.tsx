import Link from "next/link";

type Design = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
  tags: string[] | null;
};

async function getDesign(id: string): Promise<Design | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/designs/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Design;
  } catch (error) {
    console.error("design detail fetch failed", error);
    return null;
  }
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const design = await getDesign(id);
  const palette = {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
    accentWarm: "#e2ae3d",
  };

  if (!design) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.background }}
      >
        <p style={{ color: palette.primary }}>Design not found.</p>
      </main>
    );
  }

  const productTypes = [
    { label: "T-Shirt", handle: "t-shirt", price: "₦8,000" },
    { label: "Hoodie", handle: "hoodie", price: "₦18,000" },
    { label: "Mug", handle: "mug", price: "₦5,000" },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: palette.background }}
    >
      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div
          className="rounded-2xl overflow-hidden shadow-lg border"
          style={{ borderColor: "#e0e0e0", backgroundColor: "#ffffff" }}
        >
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "rgba(197,163,255,0.2)",
                color: palette.primary,
              }}
            >
              {design.category || "General"}
            </span>
            <h1
              className="text-4xl font-black"
              style={{ color: palette.primary }}
            >
              {design.title}
            </h1>
            <p className="text-lg" style={{ color: "rgba(64, 18, 104, 0.75)" }}>
              {design.description ||
                "Premium print-ready artwork for tees, hoodies, and mugs."}
            </p>
            {design.tags && (
              <div className="flex flex-wrap gap-2">
                {design.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "rgba(226,174,61,0.15)",
                      color: palette.primary,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3
              className="text-xl font-bold"
              style={{ color: palette.primary }}
            >
              Choose a product
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {productTypes.map((p) => (
                <Link
                  key={p.label}
                  href={`/products/${p.handle}?design=${design.id}`}
                  className="rounded-2xl border p-4 transition hover:-translate-y-1"
                  style={{
                    borderColor: "#e0e0e0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: palette.primary }}
                  >
                    {p.label}
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: palette.primary }}
                  >
                    {p.price}
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(64, 18, 104, 0.6)" }}
                  >
                    Printful/Printify fulfillment
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
