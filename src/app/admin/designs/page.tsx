"use client";

import CrudManager from "@/components/admin/CrudManager";
import type { CrudConfig } from "@/types/crud";

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

const designsConfig: CrudConfig<Design> = {
  entityName: "Design",
  entityNamePlural: "Designs",
  apiEndpoint: "/api/designs",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter design title",
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      placeholder: "e.g. anime, tech, minimalist",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your design...",
      span: 2,
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "url",
      required: true,
      placeholder: "https://...",
    },
    {
      name: "thumbnailUrl",
      label: "Thumbnail URL",
      type: "url",
      placeholder: "https://... (optional)",
    },
    {
      name: "tags",
      label: "Tags",
      type: "tags",
      placeholder: "comma, separated, tags",
      span: 2,
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      defaultValue: true,
    },
  ],
  displayFields: (design) => ({
    primary: design.title,
    secondary: `${design.category || "General"} · ${
      design.isActive ? "Active" : "Inactive"
    }`,
    imageUrl: design.thumbnailUrl || design.imageUrl,
    badge: design.isActive
      ? { text: "Active", color: "#10b981" }
      : { text: "Inactive", color: "#6b7280" },
  }),
  getItemId: (design) => design.id,
  palette: {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
  },
};

export default function AdminDesignsPage() {
  return <CrudManager config={designsConfig} />;
}
