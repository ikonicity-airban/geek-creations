"use client";

import CrudManager from "@/components/admin/CrudManager";
import type { CrudConfig } from "@/types/crud";

// Example Product type - adjust based on your actual product schema
type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  handle: string;
  status: "active" | "draft" | "archived";
  vendor: string | null;
  productType: string | null;
  featuredImage: string | null;
};

const productsConfig: CrudConfig<Product> = {
  entityName: "Product",
  entityNamePlural: "Products",
  apiEndpoint: "/api/products",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter product title",
    },
    {
      name: "handle",
      label: "Handle (URL slug)",
      type: "text",
      required: true,
      placeholder: "product-url-slug",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your product...",
      span: 2,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      placeholder: "0.00",
    },
    {
      name: "vendor",
      label: "Vendor",
      type: "text",
      placeholder: "Product vendor",
    },
    {
      name: "productType",
      label: "Product Type",
      type: "text",
      placeholder: "e.g. T-Shirt, Hoodie",
    },
    {
      name: "featuredImage",
      label: "Featured Image URL",
      type: "url",
      placeholder: "https://...",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "draft", "archived"],
      defaultValue: "draft",
    },
  ],
  displayFields: (product) => ({
    primary: product.title,
    secondary: `${product.vendor || "No vendor"} · ${product.productType || "General"} · ₦${product.price?.toLocaleString() || "0"}`,
    imageUrl: product.featuredImage || undefined,
    badge: {
      text: product.status,
      color:
        product.status === "active"
          ? "#10b981"
          : product.status === "draft"
          ? "#f59e0b"
          : "#6b7280",
    },
  }),
  getItemId: (product) => product.id,
  palette: {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
  },
  emptyState: {
    title: "No products yet",
    description: "Get started by creating your first product",
  },
};

export default function AdminProductsPage() {
  return <CrudManager config={productsConfig} />;
}
